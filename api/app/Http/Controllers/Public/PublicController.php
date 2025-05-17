<?php

namespace App\Http\Controllers\Public;

use Cart;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Categorys;
use App\Models\PostCategory;
use App\Models\Room;
use App\Models\RoomImages;
use App\Models\SelectedRoomFacility;
use App\Models\Service;
use App\Models\Setting;
use App\Models\Sliders;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Validator;
use Illuminate\Support\Facades\DB;
use App\Models\Recipe;
use App\Models\User;
use App\Models\Comment;
use App\Models\PostLike;

class PublicController extends Controller
{


    public function getCommentsData(Request $request)
    {

        $slugrow   = Recipe::where('slug', $request->slug)->first();
        $recepi_id = !empty($slugrow->id) ? $slugrow->id : "";
        $data      = Comment::where('recepi_id', $recepi_id)->orderBy('id', 'desc')->get();

        $arryData = [];
        foreach ($data as $v) {
            $chkuser  = User::where('id', $v->user_id)->first();
            $onlyName = !empty($chkuser) ? $chkuser->name : "";
            $arryData[] = [
                'id'                     => $v->id,
                'message'                => $v->comment,
                'name'                   => $onlyName,
            ];
        }
        $responseData['data']  = $arryData;
        return response()->json($responseData);


        $response = [
            'data' => $data,
            'message' => 'success'
        ];
        return response()->json($response, 200);
    }



    public function getSlugData(Request $request)
    {
        //dd($request->all());
        $slug = $request->slug;
        try {
            $data             = Recipe::where('slug', $slug)->first();
            $entry_by         = User::where('id', $data->entry_by)->first();

            $data['recip_by'] = !empty($entry_by) ? $entry_by->name : "";
            $checkCat         = PostCategory::where('id', $data->category_id)->first();
            $data['cateName'] = !empty($checkCat) ? $checkCat->name : "";
            $recepi_id        = !empty($data->id) ? $data->id : "";
            $likCount         = PostLike::where('recepi_id', $recepi_id)->count();

            $response = [
                'data'         => $data,
                'likeCount'    => $likCount,
                'thumnail_img' => !empty($data->thumnail_img) ? url($data->thumnail_img) : "",
                'message' => 'success'
            ];
            return response()->json($response, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function getRecipeList()
    {
        $data = Recipe::orderBy('recipe.id', 'desc') // or 'desc'
            ->select('recipe.*', 'post_category.name as category_name')
            ->join('post_category', 'recipe.category_id', '=', 'post_category.id')
            ->limit(6)
            ->get();

        $arryData = [];
        foreach ($data as $v) {
            $check     = User::where('id', $v->entry_by)->first();
            $checkCat  = PostCategory::where('id', $v->category_id)->first();

            $status = $v->status == 1 ? 'Approved' : 'Pending';
            $arryData[] = [
                'id'                         => $v->id,
                'slug'                       => $v->slug,
                'r_name'                     => $v->name,
                'created_at'                 => date("M-d-Y", strtotime($v->created_at)),
                'name'                       => !empty($check) ? $check->name : "",
                'email'                      => !empty($check) ? $check->email : "",
                'catName'                    => !empty($checkCat) ? $checkCat->name : "",
                'description'                => Str::limit(strip_tags($v->description), 100),
                'image'                      => url($v->thumnail_img),
                'status'                     => $status,
            ];
        }
        $responseData['data']  = $arryData;
        return response()->json($responseData);
    }

    public function getRecipeData(Request $request)
    {
        $perPage = 6; // number of items per page
        $page = $request->get('page', 1); // default to page 1

        $query = Recipe::orderBy('recipe.id', 'desc')
            ->select('recipe.*', 'post_category.name as category_name')
            ->join('post_category', 'recipe.category_id', '=', 'post_category.id');

        $paginated = $query->paginate($perPage, ['*'], 'page', $page);

        $arryData = [];
        foreach ($paginated->items() as $v) {
            $check     = User::find($v->entry_by);
            $checkCat  = PostCategory::find($v->category_id);
            $status    = $v->status == 1 ? 'Approved' : 'Pending';

            $arryData[] = [
                'id'          => $v->id,
                'slug'        => $v->slug,
                'r_name'      => $v->name,
                'created_at'  => date("M-d-Y", strtotime($v->created_at)),
                'name'        => $check ? $check->name : "",
                'email'       => $check ? $check->email : "",
                'catName'     => $checkCat ? $checkCat->name : "",
                'description' => Str::limit(strip_tags($v->description), 100),
                'image'       => url($v->thumnail_img),
                'status'      => $status,
            ];
        }

        return response()->json([
            'data'       => $arryData,
            'total'      => $paginated->total(),
            'currentPage' => $paginated->currentPage(),
            'perPage'    => $paginated->perPage(),
            'totalPages' => $paginated->lastPage(),
        ]);
    }



    public function filterBooking(Request $request)
    {
        //dd($request->all());
        $validator = Validator::make(
            $request->all(),
            [
                'check_in'  => 'required|date',
                'check_out' => 'required|date|after_or_equal:check_in',
            ],
            [
                'check_in.required' => 'The check-in date is required.',
                'check_in.date'     => 'The check-in must be a valid date.',
                'check_out.required' => 'The check-out date is required.',
                'check_out.date'     => 'The check-out must be a valid date.',
                'check_out.after_or_equal' => 'The check-out date must be after or equal to the check-in date.',
            ]
        );

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }


        // Fetch available rooms (booking_status = 2 or NULL)
        $rooms = Room::where('booking_status', 2)
            ->leftJoin('bed_type', 'room.bed_type_id', '=', 'bed_type.id') // Fixing bed_type join
            ->leftJoinSub(
                \DB::table('room_images')
                    ->select('room_id', \DB::raw('MIN(id) as min_id')) // Get first image ID
                    ->groupBy('room_id'),
                'first_images',
                'room.id',
                '=',
                'first_images.room_id'
            )
            ->leftJoin('room_images', 'room_images.id', '=', 'first_images.min_id') // Join first image
            ->orWhereNull('booking_status')
            ->select('room.slug', 'room.id', 'room.name', 'room.roomDescription', 'bed_type.name as bed_name', 'roomPrice', 'room_images.roomImage')
            ->get()
            ->map(function ($room) {
                return [
                    'room_id'         => $room->id,
                    'name'            => $room->name,
                    'slug'            => $room->slug,
                    'bed_name'        => $room->bed_name,
                    'roomPrice'       => number_format($room->roomPrice, 2),
                    'roomDescription' =>  Str::limit($room->roomDescription, 50), // Limit to 50 characters,
                    'roomImage'       => !empty($room->roomImage) ? url($room->roomImage) : ""
                ];
            });



        return response()->json([
            'message' => 'Available rooms fetched successfully.',
            'rooms' => $rooms
        ], 200);
    }



    public function activeRooms(Request $request)
    {
        try {

            $rowsData = Room::where('room.status', 1)
                ->leftJoin('bed_type', 'room.bed_type_id', '=', 'bed_type.id') // Fixing bed_type join
                ->leftJoinSub(
                    \DB::table('room_images')
                        ->select('room_id', \DB::raw('MIN(id) as min_id')) // Get first image ID
                        ->groupBy('room_id'),
                    'first_images',
                    'room.id',
                    '=',
                    'first_images.room_id'
                )
                ->leftJoin('room_images', 'room_images.id', '=', 'first_images.min_id') // Join first image
                ->select('room.slug', 'room.id', 'room.name', 'room.roomDescription', 'bed_type.name as bed_name', 'roomPrice', 'room_images.roomImage')
                ->get()
                ->map(function ($room) {
                    return [
                        'room_id'         => $room->id,
                        'name'            => $room->name,
                        'slug'            => $room->slug,
                        'bed_name'        => $room->bed_name,
                        'roomPrice'       => number_format($room->roomPrice, 2),
                        'roomDescription' =>  Str::limit($room->roomDescription, 50), // Limit to 50 characters,
                        'roomImage'       => !empty($room->roomImage) ? url($room->roomImage) : ""
                    ];
                });
            return response()->json($rowsData, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


    public function getSliders(Request $request)
    {
        try {
            $slider = Sliders::where('status', 1)->first();

            if ($slider) {
                $sliderData = [
                    'id'          => $slider->id,
                    'title_name'  => $slider->title_name,
                    'description' => $slider->description,
                    'sliderImage' => !empty($slider->sliderImage) ? url($slider->sliderImage) : "",
                ];

                return response()->json(['data' => $sliderData], 200);
            } else {
                return response()->json(['data' => null], 200);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getRoomDetails(Request $request)
    {
        try {

            $roomParticular = Room::where('room.status', 1)->where('room.slug', $request->slug)
                ->select('room.*', 'bed_type.name as bed_name')
                ->leftJoin('bed_type', 'room.bed_type_id', '=', 'bed_type.id') // Fixing bed_type join
                ->first();

            $room_id          = $roomParticular->id;
            $activeRoomImg    = RoomImages::where('status', 1)
                ->where('room_id', $room_id)
                ->get()
                ->map(function ($room) {
                    // Check if roomImage exists and is not empty
                    return [
                        'roomImage' => !empty($room->roomImage) ? url($room->roomImage) : null // Returning null if empty
                    ];
                });

            $data['roomParticular'] = $roomParticular;
            $data['activeRoomImg']  = $activeRoomImg;

            return response()->json($data, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }




    public function checkselectedfacilities(Request $request)
    {

        try {
            $data = SelectedRoomFacility::where('room_id', $request->id)
                ->select('select_room_facilities.id', 'facility_group.name as facility_group_name', 'room.roomType as room_name', 'room_facility.name as facilities_name')
                ->leftJoin('facility_group', 'facility_group.id', '=', 'select_room_facilities.room_facility_group_id')
                ->leftJoin('room', 'room.id', '=', 'select_room_facilities.room_id')
                ->leftJoin('room_facility', 'room_facility.id', '=', 'select_room_facilities.facilities_id')
                ->orderby('id', 'desc')
                ->get();
            if ($data->isEmpty()) {
                return response()->json(['message' => 'No room sizes found'], 404);
            }
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getGlobalData()
    {
        try {
            $data = Setting::where('id', 1)->first();
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


    public function getGlobalSettingdata()
    {
        try {
            $data = Setting::where('id', 1)->first();

            $response = [
                'data'         => $data,
                'banner_image' => !empty($data->banner_image) ? url($data->banner_image) : "",
                'message' => 'success'
            ];
            return response()->json($response, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }



    public function getServiceList()
    {

        try {
            $data = Service::where('status', 1)->get();
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }




    public function sendContact(Request $request)
    {

        // dd($request->all());
        $validator = Validator::make($request->all(), [
            'name'             => 'required',
            'email'            => 'required',
            'subject'          => 'required',
            'message'          => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        //Please add email qeue...

        return response()->json("Send mail", 200);
    }
}
