<?php

namespace App\Http\Controllers\Facility;

use App\Http\Controllers\Controller;
use App\Models\BedType;
use App\Models\FacilityGroup;
use App\Models\PromoCode;
use App\Models\Room;
use App\Models\RoomFacility;
use App\Models\User;
use App\Rules\MatchOldPassword;
use Auth;
use Carbon\Carbon;
use DB;
use Helper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Validator;

class FacilityController extends Controller
{
    protected $userid;
    public function __construct()
    {
        $this->middleware('auth:api');
        $id = auth('api')->user();
        if (!empty($id)) {
            $user = User::find($id->id);
            $this->userid = $user->id;
        }
    }


    public function roomFacilitySave(Request $request)
    {
        //dd($request->all());

        $rules = [
            'room_facility_group_id'    => 'required',
            'name'                      => 'required',
            'status'                    => 'required',
        ];

        // Apply unique validation **only when creating a new record**
        if (empty($request->id)) {
            $rules['name'] = 'required|unique:room_facility,name,NULL,id,room_facility_group_id,' . $request->room_facility_group_id;
        }

        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $request->input('name'))));

        $validator = Validator::make($request->all(), $rules, [
            'room_facility_group_id.required'       => 'The Facility group  is required.',
            'name.required'       => 'The name is required.',
            'status.required'     => 'The status field is required.',
        ]);

        // Check validation
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $data = array(
            'room_facility_group_id'        => $request->room_facility_group_id,
            'name'                          => $request->name,
            'slug'                          => $slug,
            'status'                        => $request->status,
        );
        if (empty($request->id)) {
            RoomFacility::create($data);
        } else {
            RoomFacility::where('id', $request->id)->update($data);
        }

        $response = [
            'message' => 'Successful insert',
        ];
        return response()->json($response);
    }

    public function roomFacilityGroupSave(Request $request)
    {
        //  dd($request->all());
        $rules = [
            'name'       => 'required',
            'status'     => 'required',
        ];

        // Apply unique validation **only when creating a new record**
        if (empty($request->id)) {
            $rules['name']   = 'required|unique:facility_group,name';
        }

        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $request->input('name'))));

        $validator = Validator::make($request->all(), $rules, [
            'name.required'       => 'The name is required.',
            'status.required'     => 'The status field is required.',
        ]);

        // Check validation
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $data = array(
            'name'                 => $request->name,
            'slug'                 => $slug,
            'status'               => $request->status,
        );
        if (empty($request->id)) {
            FacilityGroup::create($data);
        } else {
            FacilityGroup::where('id', $request->id)->update($data);
        }

        $response = [
            'message' => 'Successful insert',
        ];
        return response()->json($response);
    }


    public function checkRoomFacilityGroupRow(Request $request)
    {
        try {
            $id   = $request->id ?? "";
            $data = FacilityGroup::where('id', $id)->first();
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


     public function checkFacilities(Request $request)
    {

        try {
            $id   = $request->room_facility_group_id ?? "";
            $data = RoomFacility::where('room_facility_group_id', $id)->get();
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


    public function checkRoomFacilityRow(Request $request)
    {
        try {
            $id   = $request->id ?? "";
            $data = RoomFacility::where('id', $id)->first();
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


    public function roomfacility_list(Request $request)
    {

        //dd($request->all());

        $page           = $request->input('page', 1);
        $pageSize       = $request->input('pageSize', 10);
        // Get search query from the request
        $searchQuery    = $request->searchQuery;
        $selectedFilter = (int)$request->selectedFilter;
        $fgroupid       = (int)$request->fgroupid;
        // dd($selectedFilter);
        $query = RoomFacility::orderBy('id', 'desc');

        if ($searchQuery !== null) {
            $query->where('name', 'like', '%' . $searchQuery . '%');
        }

        if ($selectedFilter !== null) {
            $query->where('status', $selectedFilter);
        }

        if (!empty($fgroupid)) {
            $query->where('room_facility_group_id', $fgroupid);
        }

        // $query->whereNotIn('users.role_id', [2]);
        $paginator = $query->paginate($pageSize, ['*'], 'page', $page);

        $modifiedCollection = $paginator->getCollection()->map(function ($item) {
            $fagroupName    = FacilityGroup::where('id', $item->room_facility_group_id)->first();
            return [
                'id'            => $item->id,
                'name'          => $item->name,
                'fagroupName'   => !empty($fagroupName->name) ? $fagroupName->name : "",
                'created_at'    => date("Y-M-d H:i:s", strtotime($item->created_at)),
                'updated_at'    => date("Y-M-d H:i:s", strtotime($item->updated_at)),
                'status'        => $item->status == 1 ? 'Active' : 'Inactive',
            ];
        });
        // Return the modified collection along with pagination metadata
        return response()->json([
            'data' => $modifiedCollection,
            'current_page' => $paginator->currentPage(),
            'total_pages' => $paginator->lastPage(),
            'total_records' => $paginator->total(),
        ], 200);
    }



    public function roomfacilityGroupList(Request $request)
    {
        $page           = $request->input('page', 1);
        $pageSize       = $request->input('pageSize', 10);
        // Get search query from the request
        $searchQuery    = $request->searchQuery;
        $selectedFilter = (int)$request->selectedFilter;
        // dd($selectedFilter);
        $query = FacilityGroup::orderBy('id', 'desc');

        if ($searchQuery !== null) {
            $query->where('name', 'like', '%' . $searchQuery . '%');
        }

        if ($selectedFilter !== null) {

            $query->where('status', $selectedFilter);
        }
        // $query->whereNotIn('users.role_id', [2]);
        $paginator = $query->paginate($pageSize, ['*'], 'page', $page);

        $modifiedCollection = $paginator->getCollection()->map(function ($item) {
            return [
                'id'            => $item->id,
                'name'          => $item->name,
                'created_at'    => date("Y-M-d H:i:s", strtotime($item->created_at)),
                'updated_at'    => date("Y-M-d H:i:s", strtotime($item->updated_at)),
                'status'        => $item->status == 1 ? 'Active' : 'Inactive',
            ];
        });
        // Return the modified collection along with pagination metadata
        return response()->json([
            'data' => $modifiedCollection,
            'current_page' => $paginator->currentPage(),
            'total_pages' => $paginator->lastPage(),
            'total_records' => $paginator->total(),
        ], 200);
    }




    public function getsFacilityGruop()
    {
        try {
            $data = FacilityGroup::where('status', 1)->get();
            if ($data->isEmpty()) {
                return response()->json(['message' => 'No room sizes found'], 404);
            }
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    
}
