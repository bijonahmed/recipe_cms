<?php

namespace App\Http\Controllers\Booking;

use App\Category;
use App\Http\Controllers\Controller;
use App\Models\Attribute;
use App\Models\AttributeValues;
use App\Models\Booking;
use App\Models\Categorys;
use App\Models\MiningCategory;
use App\Models\MiningHistory;
use App\Models\Mystore;
use App\Models\PostCategory;
use App\Models\Product;
use App\Models\ProductAttributes;
use App\Models\ProductAttributeValue;
use App\Models\Room;
use App\Models\RoomImages;
use App\Models\Setting;
use App\Models\SubAttribute;
use App\Models\User;
use App\Rules\MatchOldPassword;
use Auth;
use Carbon\Carbon;
use DB;
use Helper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Validator;

class BookingController extends Controller
{
    protected $userid;
    public function __construct()
    {
        $this->middleware('auth:api'); // Apply the auth middleware
        $user = auth('api')->user();  // Get the user from the token
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401); // If no user is found, return unauthenticated
        }
        $this->userid = $user->id;
        //dd("User ID: ".$this->userid); // Debugging to see the user ID
    }



    public function checkStatusUpdate(Request $request){

        //dd($request->all());
        $validator = Validator::make(
            $request->all(),
            [
                'id'             => 'required',
                'status'         => 'required',
                'room_id'        => 'required',
            ],
            [
                'id.required'       => 'Please first select id.',
                'status.required'   => 'Please select a status.',
                'room_id.required'  => 'Please select a status.',
            ]
        );

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $updateBooking = [
            'booking_status'   => $request->status,
            'check_out_reason' => $request->note,
            'check_out_by'     => $this->userid,
            
        ];
        Booking::where('id', $request->id)->update($updateBooking);

        $updateRoom = [
            'booking_status' => 2, //Allow only release.
        ];
        Room::where('id', $request->room_id)->update($updateRoom);

        return response()->json(['message' => 'Successfully booked.']);

    }

    public function adminBookingRequest(Request $request)
    {
        // dd($request->all());
        $validator = Validator::make(
            $request->all(),
            [
                'name'          => 'required',
                'email'         => 'required|email',
                'checkin'       => 'required|date',
                'checkout'      => 'required|date|after_or_equal:checkin',
                'paymenttype'   => 'required',
                'room_id'       => 'required',
                'phone'         => 'required',

            ],
            [
                'name.required'     => 'Please enter your name.',
                'email.required'    => 'Email address is required.',
                'email.email'       => 'Please provide a valid email address.',
                'paymenttype.required'     => 'Please select payment type.',
                'checkin.required'  => 'Please select a check-in date.',
                'checkin.date'      => 'Check-in date must be a valid date.',
                'checkout.required' => 'Please select a check-out date.',
                'checkout.date'     => 'Check-out date must be a valid date.',
                'checkout.after_or_equal' => 'Check-out date must be the same or after the check-in date.',
                'phone.required'    => 'Please enter your phone.',
            ]
        );

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $password = '#123456#';
        $username = $this->generateUniqueRandomNumber(); // you'll define this method

        $existingUser = User::where('email', $request->email)
            ->orWhere('phone', $request->phone)
            ->exists();

            if ($existingUser) {
                // If user exists, do nothing and return
                return;
            }

        $user = User::create([
            'name'          => $request->name,
            'email'         => $request->email,
            'phone'         => $request->phone,
            'role_id'       => 2,
            'status'        => 1,
            'username'      => $username, // generated unique number
            'register_ip'   => $request->ip(),
            'inviteCode'    => $this->generateUniqueRandomNumber(),
            'show_password' => $password, // store plain text (optional, not recommended for security)
            'password'      => bcrypt($password), // secure hash
        ]);
        $lastInsertedId = $user->id;




        $existingBooking = Booking::where('room_id', $request->room_id)
            ->where(function ($query) use ($request) {
                $query->where(function ($q) use ($request) {
                    $q->where('checkin', '<', $request->checkout)
                        ->where('checkout', '>', $request->checkin);
                });
            })->first();

        if ($existingBooking) {
            $nextAvailableDate = Carbon::parse($existingBooking->checkout)->format('Y-m-d');
            return response()->json([
                'message' => 'Room already booked for selected dates. Please choose a checkout date after ' . $nextAvailableDate,
            ], 409); // 409 Conflict
        }

        // Call the separate method to generate a unique booking ID
        $bookingId = $this->generateUniqueBookingId();
        $checkRoom = Room::where('id', $request->room_id)->first();

        $data = [
            'booking_id'  => $bookingId,  // Adding custom unique booking ID
            'name'        => $request->name,
            'email'       => $request->email,
            'checkin'     => $request->checkin,
            'checkout'    => $request->checkout,
            'room_price'  => $checkRoom->roomPrice,
            'paymenttype' => $request->paymenttype,
            'room_id'     => $request->room_id,
            'adult'       => $request->adult,
            'child'       => $request->child,
            'message'     => $request->message,
            'customer_id' => $lastInsertedId,
            'booking_status' => 1,
        ];

        Booking::create($data);

        $updateRoom = [
            'booking_status' => 1,
        ];
        Room::where('id', $request->room_id)->update($updateRoom);
        return response()->json(['message' => 'Successfully booked.']);
    }

    public function getBookingDetails(Request $request)
    {
        try {

            $bookingId = $request->id;
            $roomParticular = Booking::where('booking.booking_id', $bookingId)
                ->select(
                    'booking.*',
                    'room.name as room_name',
                    'booking.checkin',
                    'booking.checkout',
                    'room.roomPrice',
                    'room.roomDescription',
                    'bed_type.name as bed_name',
                    \DB::raw('DATEDIFF(booking.checkout, booking.checkin) as total_booking_days')
                )
                ->leftJoin('room', 'booking.room_id', '=', 'room.id') // Fixing bed_type join
                ->leftJoin('bed_type', 'room.bed_type_id', '=', 'bed_type.id') // Fixing bed_type join
                ->first();
            //dd($roomParticular->room_id);
            $setting = Setting::find(1);

            $room_id          = $roomParticular->room_id;
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
            $data['setting'] = $setting;
            /// dd($data);

            return response()->json($data, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


    public function activeBookingRooms(Request $request)
    {

        try {
            $rowsData = Booking::where('booking.customer_id', $this->userid)
                ->where('booking.booking_status', 1)
                ->leftJoin('room', 'room.id', '=', 'booking.room_id')
                ->leftJoinSub(
                    RoomImages::select('room_id', DB::raw('MIN(id) as min_id'))
                        ->groupBy('room_id'),
                    'first_images',
                    'room.id',
                    '=',
                    'first_images.room_id'
                )
                ->leftJoin('room_images', 'room_images.id', '=', 'first_images.min_id')
                ->select(
                    'room.slug',
                    'room.id',
                    'room.name',
                    'room.roomDescription',
                    'room.roomPrice',
                    'booking.checkin',
                    'booking.checkout',
                    'booking.booking_id',
                    'room_images.roomImage'
                )
                ->get()
                ->map(function ($room) {
                    return [
                        'room_id'         => $room->id,
                        'name'            => $room->name,
                        'slug'            => $room->slug,
                        'booking_id'      => $room->booking_id,
                        'checkin'         => date("d-m-Y", strtotime($room->checkin)),
                        'checkout'        => date("d-m-Y", strtotime($room->checkout)),
                        'roomPrice'       => number_format($room->roomPrice, 2),
                        'roomDescription' => Str::limit($room->roomDescription, 50),
                        'roomImage'       => !empty($room->roomImage) ? url($room->roomImage) : "",
                    ];
                });

            return response()->json($rowsData, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function bookingRequest(Request $request)
    {
        //dd($request->all());
        $validator = Validator::make(
            $request->all(),
            [
                'name'          => 'required',
                'slug'          => 'required',
                'paymenttype'   => 'required',
                'email'     => 'required|email',
                'checkin'   => 'required|date',
                'checkout'  => 'required|date|after_or_equal:checkin',
            ],
            [
                'name.required'     => 'Please enter your name.',
                'email.required'    => 'Email address is required.',
                'paymenttype.required'     => 'Please select payment type.',
                'email.email'       => 'Please provide a valid email address.',
                'checkin.required'  => 'Please select a check-in date.',
                'checkin.date'      => 'Check-in date must be a valid date.',
                'checkout.required' => 'Please select a check-out date.',
                'checkout.date'     => 'Check-out date must be a valid date.',
                'checkout.after_or_equal' => 'Check-out date must be the same or after the check-in date.',
            ]
        );

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $checkSlug = Room::where('slug', $request->slug)->first();
        $existingBooking = Booking::where('room_id', $checkSlug->id)
            ->where(function ($query) use ($request) {
                $query->where(function ($q) use ($request) {
                    $q->where('checkin', '<', $request->checkout)
                        ->where('checkout', '>', $request->checkin);
                });
            })->first();

        if ($existingBooking) {
            $nextAvailableDate = Carbon::parse($existingBooking->checkout)->format('Y-m-d');
            return response()->json([
                'message' => 'Room already booked for selected dates. Please choose a checkout date after ' . $nextAvailableDate,
            ], 409); // 409 Conflict
        }

        // Call the separate method to generate a unique booking ID
        $bookingId = $this->generateUniqueBookingId();
        $checkRoom = Room::where('id', $checkSlug->id)->first();

        $data = [
            'booking_id'  => $bookingId,  // Adding custom unique booking ID
            'name'        => $request->name,
            'email'       => $request->email,
            'checkin'     => $request->checkin,
            'checkout'    => $request->checkout,
            'room_price'  => $checkRoom->roomPrice,
            'paymenttype' => $request->paymenttype,
            'room_id'     => $checkSlug->id,
            'adult'       => $request->adult,
            'child'       => $request->child,
            'message'     => $request->message,
            'customer_id' => $this->userid,
            'booking_status' => 1,
        ];

        Booking::create($data);

        $updateRoom = [
            'booking_status' => 1,
        ];
        Room::where('id', $checkSlug->id)->update($updateRoom);
        return response()->json(['message' => 'Successfully booked.']);
    }

    // Separate method to generate unique booking ID
    public function generateUniqueBookingId()
    {
        // Generate a random 5-digit number initially
        $bookingId = rand(10000, 99999); // 5-digit number
        // Continue generating until a unique ID is found
        while (Booking::where('booking_id', $bookingId)->exists()) {
            $bookingId = rand(10000, 99999); // Generate a new 5-digit number if it exists
        }
        return $bookingId; // Return the unique booking ID
    }


    public function editUserId(Request $request)
    {
        $id = $this->userid;
        $data = User::find($id);

        $response = [
            'data'     => $data,
            'dataImg'  => !empty($data->image) ? url($data->image) : "",
            'doc_file' => !empty($data->doc_file) ? url($data->doc_file) : "",
            'message'  => 'success'
        ];
        return response()->json($response, 200);
    }

    public function checkroomBookingStatus()
    {

        $booking_rooms = Booking::where('booking.booking_status', 1)
            ->leftJoin('room', 'room.id', '=', 'booking.room_id')
            ->select(
                'booking.*',
                'room.roomType',
                'room.slug as roomslug',
                DB::raw('DATEDIFF(booking.checkout, booking.checkin) as total_booking_days')
            )->get();

        $roomIds         = $booking_rooms->pluck('room_id')->unique()->toArray(); // this is correct
        $available_rooms = Room::whereNotIn('id', $roomIds)->select('id', 'roomType', 'roomPrice')->get();

        $data['booking_rooms'] = $booking_rooms;
        $data['available_rooms'] = $available_rooms;

        return response()->json($data, 200);
    }

    public function getBookingEditdata(Request $request)
    {
        //dd($request->all());
        $bookingId     = $request->bookingId;
        $booking_data  = Booking::where('booking.booking_status', 1)
            ->where('booking.id', $bookingId)
            ->leftJoin('users', 'users.id', '=', 'booking.customer_id')
            ->select(
                'booking.*',
                'users.phone',
                DB::raw('DATEDIFF(booking.checkout, booking.checkin) as total_booking_days')
            )->first();

        $data['booking_data'] = $booking_data;
        return response()->json($data, 200);
    }


    public function bookingUpdateInOut(Request $request)
    {

        // dd($request->all());
        $validator = Validator::make(
            $request->all(),
            [
                'id'             => 'required', //booking id primary ke
                'roomslug'       => 'required',
                'checkin'        => 'required|date',
                'checkout'       => 'required|date|after_or_equal:checkin',
            ],
            [
                'roomslug.required'    => 'Room slug is required.',
                'checkin.required'  => 'Please select a check-in date.',
                'checkin.date'      => 'Check-in date must be a valid date.',
                'checkout.required' => 'Please select a check-out date.',
                'checkout.date'     => 'Check-out date must be a valid date.',
                'checkout.after_or_equal' => 'Check-out date must be the same or after the check-in date.',
            ]
        );

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $checkSlug  = Room::where('slug', $request->roomslug)->first();

        $checkinDate = Carbon::parse($request->checkin)->toDateString();  // Y-m-d
        $checkoutDate = Carbon::parse($request->checkout)->toDateString();

        $existingBooking = Booking::where('room_id', $checkSlug->id)
            ->whereDate('checkin', '<', $checkoutDate) // existing booking starts before new checkout
            ->whereDate('checkout', '>', $checkinDate) // existing booking ends after new checkin
            ->orderByDesc('id')
            ->first();
        // dd($existingBooking);

        if ($existingBooking) {
            $nextAvailableDate = Carbon::parse($existingBooking->checkout)->format('Y-m-d');
            return response()->json([
                'message' => 'Room already booked for selected dates. Please choose a checkout date after ' . $nextAvailableDate,
            ], 409); // 409 Conflict
        }
        //dd($existingBooking);
        $data = [
            //'checkin'     => $request->checkin,
            'checkout'    => $request->checkout,
            'update_by'   => $this->userid,
        ];
        //dd($data);
        Booking::where('id', $request->id)->update($data);
        return response()->json(['message' => 'Successfully booked.']);
    }

    public function bookingUpdate(Request $request)
    {
        //dd($request->all());
        $validator = Validator::make(
            $request->all(),
            [
                'id'             => 'required', //booking id primary ke
                'bookingName'    => 'required',
                'room_slug'      => 'required',
            ],
            [
                'bookingName.required' => 'Please enter your name.',
                'room_slug.required'   => 'Room slug is required.',
            ]
        );

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $booking_id  =  $request->id;
        $chkCustomer =  Booking::where('id', $booking_id)->select('customer_id')->first();

        //dd($chkCustomer->customer_id);

        $data = [
            'name'        => $request->bookingName,
            'adult'       => $request->adult,
            'child'       => $request->child,
            'message'     => $request->message,
            'phone'       => $request->phone,
            'arival_from' => $request->arival_from,
            'update_by'   => $this->userid,
            'booking_status' => 1,
        ];

        if (!empty($chkCustomer)) {
            $udata = [
                'name'        => $request->bookingName,
                'phone'       => $request->phone,
            ];
            User::where('id', $chkCustomer->customer_id)->update($udata);
        }


        Booking::where('id', $booking_id)->update($data);
        return response()->json(['message' => 'Successfully booked.']);
    }

    public function generateUniqueRandomNumber()
    {
        $microtime = microtime(true); // Get the current microtime as a float
        $microtimeString = str_replace('.', '', (string)$microtime); // Remove the dot from microtime
        // Extract the last 5 digits
        $uniqueId = substr($microtimeString, -7);
        return $uniqueId; // Since we're generating only one number, return the first (and only) element of the array
    }
}
