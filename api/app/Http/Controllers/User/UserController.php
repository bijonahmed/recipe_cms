<?php

namespace App\Http\Controllers\User;

use DB;
use Auth;
use File;
use Helper;
use Validator;
use App\Models\Role;
use App\Models\User;
use App\Models\Order;
use App\Models\ApiKey;
use App\Models\Videos;
use App\Models\Deposit;
use App\Models\Gallery;
use App\Models\Profile;
use App\Models\Countrys;
use App\Models\Community;
use App\Models\RuleModel;
use Illuminate\Support\Str;
use function Ramsey\Uuid\v1;
use Illuminate\Http\Request;
use App\Models\VideosThunmnail;
use Illuminate\Http\JsonResponse;
use PhpParser\Node\Stmt\TryCatch;
use App\Http\Controllers\Controller;
use App\Imports\BulkAddressImport;
use App\Models\BulkAddress;
use App\Models\Comment;
use App\Models\Recipe;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log; // Add this line
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    protected $frontend_url;
    protected $userid;
    protected $email;
    public function __construct(Request $request)
    {
        $this->middleware('auth:api');
        $id = auth('api')->user();
        if (!empty($id)) {
            $user = User::find($id->id);
            $this->userid = $user->id;
            $this->email = $user->email;
        } else {
            Log::info('Authorization Header:', ['token' => $request->header('Authorization')]);
        }
    }
 
    public function commentSubmit(Request $request)
    {
        //dd($request->all());
        $rules = [
            'comment'             => 'required',
            'slug'                => 'required',
        ];

        $messages = [
            'comment.required'    => 'The comment is required.',
            'slug.required'       => 'Slug comment is required.',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $row = Recipe::where('slug', $request->slug)->first();

        $data = array(
            'recepi_id'    => $row->id,
            'comment'      => $request->comment,
            'user_id'      => $this->userid,
            'status'       => 1,
        );
        Comment::create($data);
        return response()->json(['message' => 'Recipe created successfully'], 201);
        // dd($data);
    }


    public function checkCurrentUser()
    {
        try {
            $user              = User::where('id', $this->userid)->first();
            $data['user']      = $user;
            $data['image']     = !empty($user->image) ? url($user->image) : "";
            $data['country']   = Countrys::where('status', 1)->get();
            return response()->json($data, 200);
        } catch (\Exception $e) {
            \Log::error('Error retrieving user: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving the user'], 500);
        }
    }

    public function me()
    {
        $me = auth('api')->user();
        return response()->json($me);
    }

    public function saveRole(Request $request)
    {
        if (empty($request->id)) {
            $validator = Validator::make($request->all(), [
                'name'   =>  'required|unique:rule,name',
                'status' => 'required',
            ]);
        } else {
            $validator = Validator::make($request->all(), [
                'name'   => 'required',
                'status' => 'required',
            ]);
        }

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $checkPointId = !empty($request->id) ? $request->id : "";

        if (empty($checkPointId)) {
            $data['name']   =  $request->name ?? "";
            $data['status'] =  $request->status ?? "";
            Role::create($data);
        } else {

            $data['name']   =  $request->name ?? "";
            $data['status'] =  $request->status ?? "";
            Role::where('id', $request->id)->update($data);
        }

        $response = [
            'data' => $data,
            'message' => 'success'
        ];
        return response()->json($response, 200);
    }
    public function getUsersList(Request $request)
    {
        $data = User::getUsersList($request->all());
        $response = [
            'data' => $data,
            'message' => 'success'
        ];
        return response()->json($response, 200);
    }

    public function deleteWallet(Request $request)
    {

        // dd($request->all());

        $id       = (int) $request->id;
        $status   = (int) $request->status;
        $data     = BulkAddress::where('id', $id)->first();
        if ($data) {
            $data->status = $status;
            $data->entry_by = $this->userid;
            $data->save();
        }

        $response = [
            'data' => $data,
            'message' => $data ? 'success' : 'record not found or already updated'
        ];

        return response()->json($response, 200);
    }

    public function getRoles(Request $request)
    {
        $data = Role::where('status', 1)->get();
        $response = [
            'data' => $data,
            'message' => 'success'
        ];
        return response()->json($response, 200);
    }


    public function getOnlyMerchantList(Request $request)
    {
        $data = User::where('status', 1)->where('role_id', 4)->get();

        $response = [
            'data' => $data,
            'message' => 'success'
        ];
        return response()->json($response, 200);
    }


    public function getBulkAddressMerchant(Request $request)
    {

        $data = BulkAddress::where('merchant_id', $request->id)->get();
        $response = [
            'data' => $data,
            'message' => 'success'
        ];
        return response()->json($response, 200);
    }

 

    public function getRoleList(Request $request)
    {

        //dd($request->all());
        $page = $request->input('page', 1);
        $pageSize = $request->input('pageSize', 10);

        // Get search query from the request
        $searchQuery    = $request->searchQuery;
        $selectedFilter = (int)$request->selectedFilter;
        // dd($selectedFilter);
        $query = RuleModel::orderBy('rule.id', 'desc');

        if ($searchQuery !== null) {
            $query->where('rule.name', 'like', '%' . $searchQuery . '%');
        }

        if ($selectedFilter !== null) {

            $query->where('rule.status', $selectedFilter);
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
    public function findMerchantDetails(Request $request)
    {

        $id       = $request->id;
        $history  = User::where('id', $id)->first();
        return response()->json($history, 200); // Return the result as JSON

    }
    public function findUserDetails(Request $request)
    {

        $id       = $request->id;
        $history  = ApiKey::where('id', $id)->first();
        return response()->json($history, 200); // Return the result as JSON
    }



    public function allUsers(Request $request)
    {

        // dd($request->all());
        $page = $request->input('page', 1);
        $pageSize = $request->input('pageSize', 10);

        // Get search query from the request
        $searchQuery        = $request->searchQuery;
        $selectedFilter     = (int)$request->selectedFilter;
        $merchant_rule      = (int)$request->merchant_rule;
        $selectEmail        = $request->searchEmail;
        $selectedUsername   = $request->searchUsername;

        // dd($selectedFilter);
        $query = User::orderBy('users.id', 'desc')
            ->where('users.role_id', $request->rule_id)
            ->join('rule', 'users.role_id', '=', 'rule.id')
            ->select('users.company_name', 'users.created_at', 'users.username', 'lastlogin_country', 'register_ip', 'lastlogin_ip', 'users.ref_id', 'users.telegram', 'users.phone', 'users.role_id', 'users.id', 'users.name', 'users.email', 'users.phone_number', 'users.show_password', 'users.status', 'rule.name as rulename');

        if ($searchQuery !== null) {
            $query->where('users.name', 'like', '%' . $searchQuery . '%');
        }

        if ($selectEmail !== null) {
            $query->where('users.email', $selectEmail);
        }

        if ($selectedUsername !== null) {
            $query->where('users.username', $selectedUsername);
        }

        if ($selectedFilter !== null) {
            $query->where('users.status', $selectedFilter);
        }
        // $query->where('users.role_id', $merchant_rule);
        $paginator = $query->paginate($pageSize, ['*'], 'page', $page);

        $modifiedCollection = $paginator->getCollection()->map(function ($item) {

            $telegram       = !empty($item->telegram) ? $item->telegram : "None";
            $phone          = !empty($item->phone_number) ? $item->phone_number : "";
            $whtsapp        = !empty($item->whtsapp) ? $item->whtsapp : "";
            $status         = $item->status == 1  ? 'Active' : "Inactive";
            $ref_id         = !empty($item->ref_id) ? $item->ref_id : ""; //$item->ref_id == 1  ? 'Active' : "None";
            $chkInviteUser  = User::where('id', $ref_id)->select('name', 'phone_number', 'email')->first();
            $registerIP     = $item->register_ip;
            $ipdat = @json_decode(file_get_contents(
                "http://www.geoplugin.net/json.gp?ip=" . $registerIP
            ));

            return [
                'id'            => $item->id,
                'name'          => substr($item->name, 0, 250),
                'rulename'      => substr($item->rulename, 0, 250),
                'email'         => $item->email,
                'register_ip'   => $item->register_ip,
                'lastlogin_ip'  => $item->lastlogin_ip,
                'created_at'    => date("Y-M-d", strtotime($item->created_at)), //$item->created_at,
                'updated_at'    => date("Y-M-d H:i:s", strtotime($item->updated_at)), //$item->updated_at,
                'phone_number'  => $item->phone,
                'show_password' => $item->show_password,
                'company'       => $item->company_name,
                'username'      => $item->username,
                'telegram'      => $telegram,
                'phone'         => $item->phone,
                'status'        => $status,
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

    public function editUserId(Request $request)
    {
        $id = $request->userId ?? "";
        $data = User::find($id);

        $response = [
            'data'     => $data,
            'dataImg'  => !empty($data->image) ? url($data->image) : "",
            'doc_file' => !empty($data->doc_file) ? url($data->doc_file) : "",
            'message'  => 'success'
        ];
        return response()->json($response, 200);
    }

    public function roleCheck(Request $request)
    {
        $id = $request->userId ?? "";

        $data = Role::find($id);
        $response = [
            'data' => $data,
            'message' => 'success'
        ];
        return response()->json($response, 200);
    }

    public function getCountry()
    {
        $data = User::countryList();
        $response = [
            'data' => $data,
            'message' => 'success'
        ];
        return response()->json($response, 200);
    }

    public function updateUserProfileImg(Request $request)
    {
        // dd($request->all());
        $validator = Validator::make($request->all(), [
            //'file'    => 'required',
            'file' => 'required|image|mimes:jpeg,png,jpg,gif', // Adjust max file size as needed
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        if (!empty($request->file('file'))) {
            $files = $request->file('file');
            $fileName = Str::random(20);
            $ext = strtolower($files->getClientOriginalExtension());
            $path = $fileName . '.' . $ext;
            $uploadPath = '/backend/files/';
            $upload_url = $uploadPath . $path;
            $files->move(public_path('/backend/files/'), $upload_url);
            $file_url = $uploadPath . $path;
            $data['image'] = $file_url;
            DB::table('users')->where('id', $this->userid)->update($data);
            $response = [
                'dataImg' => !empty($file_url) ? url($file_url) : "",
                'message' => 'success'
            ];
        } else {
            $response = [
                'dataImg' =>  "",
                'message' => 'failed'
            ];
        }
        return response()->json($response);
    }

    public function uploadExcelbulkAddress(Request $request)
    {
        // Validate the file input
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:10240', // Optional: file size validation (10MB)
        ]);

        // Perform the import directly without using a helper
        try {
            // Use the Excel facade to import the data
            Excel::import(new BulkAddressImport($request->id), $request->file('file'));

            // Return a success response if the import was successful
            return response()->json(['message' => 'File imported successfully!'], 200);
        } catch (\Exception $e) {
            // Return an error response if something goes wrong
            return response()->json(['message' => 'File import failed', 'error' => $e->getMessage()], 500);
        }
    }


    public function updateBookingUser(Request $request)
    {
        //dd($request->all());
        $validator = Validator::make($request->all(), [
            'name'       => 'required',
            'phone'      => 'required',
            'email'      => 'required|email',
            'username' => [
                'required',
                'max:255',
                Rule::unique('users', 'username')->ignore($this->userid),
            ],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = array(
            'name'          => !empty($request->name) ? $request->name : "",
            'phone'         => !empty($request->phone) ? $request->phone : "",
            'email'         => !empty($request->email) ? $request->email : "",
            'username'      => !empty($request->username) ? $request->username : "",
        );

        User::where('id', $this->userid)->update($data);

        $response = [
            'message' => 'User register successfully update:',
        ];
        return response()->json($response);
    }

    public function saveUser(Request $request)
    {
        //  dd($request->all());
        if (empty($request->id)) {
            $validator = Validator::make($request->all(), [
                'rule_id'    => 'required',
                'name'       => 'required',
                'phone'      => 'required',
                'email'      => 'required|unique:users,email|max:255',
                //'company'    => 'required',
                'status'     => 'required',
                'username'   => 'required|unique:users,username|max:255',
                'password'   => 'min:5|required',
            ]);
        } else {
            $validator = Validator::make($request->all(), [
                'rule_id'    => 'required',
                'name'       => 'required',
                'phone'      => 'required',
                'email'      => 'required|email',
                //'company'    => 'required',
                'status'     => 'required',
            ]);
        }

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = array(
            'role_id'       => !empty($request->rule_id) ? $request->rule_id : "",
            'name'          => !empty($request->name) ? $request->name : "",
            'phone'         => !empty($request->phone) ? $request->phone : "",
            'username'      => !empty($request->username) ? $request->username : "",
            'email'         => !empty($request->email) ? $request->email : "",
            'status'        => $request->status,
            'entry_by'      => $this->userid,
        );
        // Handle new record creation
        if (empty($request->id)) {
            $data['password'] = !empty($request->password) ? Hash::make($request->password) : "";
            $data['show_password'] = $request->password ?? "";
        } else {
            // Handle existing record update
            if (!empty($request->password)) {
                $data['password'] = Hash::make($request->password);
                $data['show_password'] = $request->password;
            }
        }

        if (!empty($request->file('file'))) {
            $files = $request->file('file');
            $fileName = Str::random(20);
            $ext = strtolower($files->getClientOriginalExtension());
            $path = $fileName . '.' . $ext;
            $uploadPath = '/backend/files/';
            $upload_url = $uploadPath . $path;
            $files->move(public_path('/backend/files/'), $upload_url);
            $file_url = $uploadPath . $path;
            $data['image'] = $file_url;
        }

        if (empty($request->id)) {
            $userId = User::insertGetId($data);
        } else {
            $userId = $request->id;
            User::where('id', $request->id)->update($data);
        }
        $response = [
            'message' => 'User register successfully insert UserID:' . $userId
        ];
        return response()->json($response);
    }



    public function changePasswordClient(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'password' => 'required|min:2|confirmed', // Use 'confirmed' rule for password confirmation
            'password_confirmation' => 'required|min:2',
            'old_password' => 'required|min:2', // Add validation for old password
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::find($request->id);

        // Validate old password before updating
        if (!Hash::check($request->old_password, $user->password)) {
            return response()->json(['errors' => ['old_password' => ['The old password does not match.']]], 422);
        }

        $user->password = Hash::make($request->password);
        $user->show_password = $request->password; // Consider removing this line for security reasons
        $user->save();

        $response = "Password successfully changed!";
        return response()->json($response);
    }

    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'password' => 'min:2|required_with:password_confirmation|same:password_confirmation',
            'password_confirmation' => 'min:2'
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $user = User::find($request->id);
        $user->password = Hash::make($request->password);
        $user->show_password = $request->password;
        $user->save();
        $response = "Password successfully changed!";
        return response()->json($response);
    }

    public function updateUserProPass(Request $request)
    {
        // dd($request->all());
        $validator = Validator::make($request->all(), [
            //'file'    => 'required',
            'doc_file' => 'required|image|mimes:jpeg,png,jpg,gif', // Adjust max file size as needed
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        if (!empty($request->file('doc_file'))) {
            $files = $request->file('doc_file');
            $fileName = Str::random(20);
            $ext = strtolower($files->getClientOriginalExtension());
            $path = $fileName . '.' . $ext;
            $uploadPath = '/backend/files/';
            $upload_url = $uploadPath . $path;
            $files->move(public_path('/backend/files/'), $upload_url);
            $file_url = $uploadPath . $path;
            $data['doc_file'] = $file_url;
            DB::table('users')->where('id', $this->userid)->update($data);
            $response = [
                'doc_file' => !empty($file_url) ? url($file_url) : "",
                'message' => 'success'
            ];
        } else {
            $response = [
                'doc_file' =>  "",
                'message' => 'failed'
            ];
        }
        return response()->json($response);
    }
}
