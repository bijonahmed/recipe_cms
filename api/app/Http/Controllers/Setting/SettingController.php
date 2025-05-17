<?php

namespace App\Http\Controllers\Setting;

use DB;
use Auth;
use Helper;
use Validator;
use App\Models\User;
use App\Models\ApiKey;
use App\Models\Profile;
use App\Models\Setting;
use App\Models\Sliders;
use App\Models\Language;
use App\Models\Translation;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Rules\MatchOldPassword;
use App\Http\Controllers\Controller;
use App\Models\BulkAddress;
use App\Models\Service as ModelsService;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\File;
use PhpOffice\PhpSpreadsheet\Calculation\Web\Service;

class SettingController extends Controller
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



    public function getPayGroupList(Request $request)
    {
        try {
            $rows = Setting::filterPayGroupList($request->all());
            $response = [
                'data' => $rows,
                'message' => 'success'
            ];
        } catch (\Throwable $th) {
            $response = [
                'data' => [],
                'message' => 'failed'
            ];
        }
        return response()->json($response, 200);
    }

    public function settingrow()
    {

        $data = Setting::find(1);

        $response = [
            'data'         => $data,
            'banner_image' => !empty($data->banner_image) ? url($data->banner_image) : "",
            'message' => 'success'
        ];
        return response()->json($response, 200);
    }


    public function getLanguageActiveList()
    {
        $response = Language::where('status', 1)->orderBy('id', 'desc')->Get();
        return response()->json($response);
    }

    public function getLanguageList(Request $request)
    {

        $page = $request->input('page', 1);
        $pageSize = $request->input('pageSize', 10);
        // Get search query from the request
        $searchQuery    = $request->searchQuery;
        $selectedFilter = (int)$request->selectedFilter;
        // dd($selectedFilter);
        $query = Language::orderBy('id', 'desc');

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
                'code'          => $item->code,
                'created_at'    => date("Y-M-d H:i:s", strtotime($item->created_at)),
                'updated_at'    => date("Y-M-d H:i:s", strtotime($item->updated_at)),
                'status'        => $item->status,
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

    public function chkLanguagerow($id)
    {
        $chkpoint = Language::where('id', $id)->first();
        return response()->json($chkpoint);
    }


    public function searchByConfigrationApiKey(Request $request)
    {
        // dd($request->all());
        $page = $request->input('page', 1);
        $pageSize = $request->input('pageSize', 10);

        // Get search query from the request
        $searchQuery    = $request->searchQuery;
        $selectedFilter = (int)$request->selectedFilter;
        $searchMerchant = (int)$request->searchMerchant;
        if ($searchMerchant === 0) {
            $searchMerchant = null; // or use '' (empty string) if you prefer
        }
        //dd($searchMerchant);
        $query = ApiKey::orderBy('api_key.id', 'desc');

        if ($searchQuery !== null) {
            $query->where('api_key.key', 'like', '%' . $searchQuery . '%');
        }

        if ($selectedFilter !== null) {
            $query->where('api_key.status', $selectedFilter);
        }

        if ($searchMerchant !== null) {
            $query->where('api_key.merchant_id', $searchMerchant);
        }

        // $query->whereNotIn('users.role_id', [2]);
        $paginator = $query->paginate($pageSize, ['*'], 'page', $page);

        $modifiedCollection = $paginator->getCollection()->map(function ($item) {
            $findMrchent    =  User::where('id', $item->merchant_id)->first();
            $countBulkAdd   =  BulkAddress::where('merchant_id', $item->merchant_id)->where('status', 1)->get();

            return [
                'id'            => $item->id,
                'merchant_id'   => $item->merchant_id,
                'company_name'  => $findMrchent->company_name ?? "",
                'name'          => $findMrchent->name ?? "",
                'key'           => $item->key ?? "",
                'callback_domain' => $item->callback_domain ?? "",
                'password'      => $item->password ?? "",
                'created_at'    => date("Y-M-d", strtotime($item->created_at)),
                'updated_at'    => date("Y-M-d H:i:s", strtotime($item->updated_at)),
                'status'        => $item->status == 1 ? 'Open' : 'Close',
                'countBulkAdd'  => count($countBulkAdd),
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



    public function saveMerchantBulkAddress(Request $request)
    {

        //dd($request->all());

        $validator = Validator::make($request->all(), [
            'walletAddress' => [
                'required',
                Rule::unique('bulk_address')->where(function ($query) use ($request) {
                    return $query->where('merchant_id', $request->id);
                }),
            ],
            'id' => 'required',
            'status' => 'required',
        ], [
            'walletAddress.required' => 'The wallet address is required.',
            'id.required'            => 'The merchant is required.',
            'status.required'        => 'The status field is required.',
            'walletAddress.unique'   => 'The wallet address must be unique under the same merchant.',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // If validation passes, insert the record
        $data = [
            'merchant_id'   => $request->id,
            'walletAddress' => $request->walletAddress,
            'status'        => $request->status,
        ];

        // Insert data and get the ID
        $insertedId = BulkAddress::insertGetId($data);
        $resdata['id']   = "Id {$insertedId} Wallet address added successfully.";
        return response()->json($resdata);
    }




    public function saveSetting(Request $request)
    {

        //dd($request->all());
        $validator = Validator::make($request->all(), [
            'name'          => 'required',
            'slugan'        => 'required',
            'email'         => 'required',
            'address'       => 'required',
            'whatsApp'      => 'required',
            'about_us'      => 'required',
        ]);


        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }


        $data = array(
            'name'                => $request->name,
            'slugan'              => $request->slugan,
            'email'               => $request->email,
            'address'             => $request->address ?? "",
            'whatsApp'            => $request->whatsApp ?? "",
            'about_us'            => $request->about_us,
            'fblink'              => $request->fblink,
            'youtubelink'         => $request->youtubelink,
        );

        if (!empty($request->file('banner_image'))) {
            $files = $request->file('banner_image');
            $fileName = Str::random(20);
            $ext = strtolower($files->getClientOriginalExtension());
            $path = $fileName . '.' . $ext;
            $uploadPath = '/backend/files/';
            $upload_url = $uploadPath . $path;
            $files->move(public_path('/backend/files/'), $upload_url);
            $file_url = $uploadPath . $path;
            $data['banner_image'] = $file_url;
        }

        Setting::where('id', 1)->update($data);

        return response()->json("Successfull update", 200);
    }


    public function saveAPIKey(Request $request)
    {
        if (empty($request->id)) {
            $validator = Validator::make($request->all(), [
                'merchant_id' => 'required|unique:api_key,merchant_id',
                'callback_domain' => 'required|url',
                'key'         => 'required',
                'password'    => 'required',
                'status'      => 'required',
            ], [
                'merchant_id.required' => 'The merchant is required.',
                'callback_domain.required' => 'The callback domain is required.',
                'key.required'         => 'The API key is required.',
                'password.required'    => 'The password is required.',
                'status.required'      => 'The status field is required.',
            ]);
        } else {
            $validator = Validator::make($request->all(), [
                'merchant_id' => 'required',
                'status'      => 'required',
            ], [
                'merchant_id.required' => 'The merchant is required.',
                'status.required'      => 'The status field is required.',
            ]);
        }

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if (empty($request->id)) {
            $data = array(
                'merchant_id'                => $request->merchant_id,
                'callback_domain'            => $request->callback_domain,
                'key'                        => $request->key ?? "",
                'password'                   => $request->password ?? "",
                'status'                     => $request->status,
            );
            $resdata['id']                   = ApiKey::insertGetId($data);
        } else {

            $data = array(
                'merchant_id'                => $request->merchant_id,
                'callback_domain'            => $request->callback_domain,
                'status'                     => $request->status,
            );
            $resdata['id']                    = ApiKey::where('id', $request->id)->update($data);
        }
        return response()->json($resdata);
    }


    public function insertLanguageAdd(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'                       => 'required',
            'code'                       => 'required|string|alpha',
            'status'                     => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        if (empty($request->id)) {
            $existing = Language::where('name', $request->input('name'))->first();
            if ($existing) {
                return response()->json(['errors_name' => 'Language with this name already exists'], 422);
            }
        }
        $data = array(
            'name'                       => $request->name,
            'code'                       => $request->code,
            'status'                     => $request->status,
        );
        if (empty($request->id)) {
            $resdata['id']                   = Language::insertGetId($data);
        } else {
            $resdata['id']                   = Language::where('id', $request->id)->update($data);
        }
        return response()->json($resdata);
    }

    public function getsSliderImages()
    {
        try {
            $allImages = Sliders::where('status', 1)->get();
            $data = [];
            foreach ($allImages as $key => $v) {

                $data[] = [
                    'id'          => $v->id,
                    'description' => !empty($v->description) ? $v->description : "",
                    'title_name'  => !empty($v->title_name) ? $v->title_name : "",
                    'sliderImage' => !empty($v->sliderImage) ? url($v->sliderImage) : ""
                ];
            }

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }



    public function getsServiceList()
    {
        try {
            $data = ModelsService::where('status', 1)->get();
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function deleteService(Request $request)
    {
        try {
            $data = ModelsService::where('id', $request->id)->first();

            if (!$data) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Service not found.',
                ], 404);
            }

            $data->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Service deleted successfully.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while deleting the service.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function delteSliderImages(Request $request)
    {
        // dd($request->all());
        try {
            $row = Sliders::where('id', $request->id)->first();
            if ($row) {

                $imagePath = public_path($row->sliderImage);

                if (File::exists($imagePath)) {
                    File::delete($imagePath);
                }
                $row->delete();

                return response()->json([
                    'status' => 'success',
                    'message' => 'Image deleted successfully.',
                ]);
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Image not found.',
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while deleting the image.',
                'error' => $e->getMessage(),
            ]);
        }
    }


    public function servicedataSave(Request $request)
    {
        // dd($request->all());
        $validator = Validator::make($request->all(), [
            'name'      => 'required',
            'status'    => 'required',
        ], [
            'name.required'   => 'Name is requried.',
            'status.required'       => 'Please select the room status.',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = array(
            'name'                => $request->name,
            'status'              => $request->status,
        );

        if (empty($request->id)) {
            ModelsService::create($data);
        } else {
            ModelsService::where('id', $request->id)->update($data);
        }

        $response = [
            'message' => 'Successfull insert',
        ];
        return response()->json($response);
    }



    public function sliderSave(Request $request)
    {
        // dd($request->all());
        $validator = Validator::make($request->all(), [
            'title_name'      => 'required',
            'sliderImage'    => 'required|file|mimes:jpg,jpeg,png|max:2048',
            'status'       => 'required',
        ], [
            'title_name.required'   => 'Title name is requried.',
            'sliderImage.required'    => 'Please upload a slider image.',
            'sliderImage.file'        => 'The uploaded file must be an image.',
            'sliderImage.mimes'       => 'Only JPG, JPEG, and PNG images are allowed.',
            'sliderImage.max'         => 'The image size must be less than 2MB.',
            'status.required'       => 'Please select the room status.',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = array(
            'title_name'             => $request->title_name,
            'description'            => !empty($request->description) ? $request->description : "",
            'status'                 => $request->status,
        );

        if (!empty($request->file('sliderImage'))) {
            $files = $request->file('sliderImage');
            $fileName = Str::random(20);
            $ext = strtolower($files->getClientOriginalExtension());
            $path = $fileName . '.' . $ext;
            $uploadPath = '/backend/files/';
            $upload_url = $uploadPath . $path;
            $files->move(public_path('/backend/files/'), $upload_url);
            $file_url = $uploadPath . $path;
            $data['sliderImage'] = $file_url;
        }


        if (empty($request->id)) {
            Sliders::create($data);
        } else {
            Sliders::where('id', $request->id)->update($data);
        }

        $response = [
            'message' => 'Successfull insert',
        ];
        return response()->json($response);
    }
}
