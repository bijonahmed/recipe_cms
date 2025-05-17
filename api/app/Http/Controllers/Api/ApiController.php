<?php

namespace App\Http\Controllers\Api;

use DB;
use Auth;
use Helper;
use Session;
use Validator;
use App\Models\Post;
use App\Models\User;
use App\Models\Videos;
use GuzzleHttp\Client;
use App\Models\Gallery;
use App\Models\Category;
use App\Models\Categorys;
use App\Models\OnlineRoom;
use Illuminate\Support\Str;
use App\Models\HostersModel;
use Illuminate\Http\Request;
use App\Rules\MatchOldPassword;
use App\Models\HostersModelVidoes;
use App\Http\Controllers\Controller;
use App\Models\Chaturbateapi;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use GuzzleHttp\Promise; // Import the Promise class
use Illuminate\Support\Facades\Http; // Add this import
use App\Services\ImageDownloaderService;

class ApiController extends Controller
{

    protected $frontend_url;
    protected $userid;
    protected $imageDownloader;
    // Inject the ImageDownloaderService via constructor
    public function __construct(ImageDownloaderService $imageDownloader)
    {
        $this->imageDownloader = $imageDownloader;
    }

    public function filterByeporner(Request $request)
    {
        $selectedCategory = $request->input('selectedCategory', '');
        $selectedPage = $request->input('page', 1);
        $selectedThumbSize = $request->input('selectedThumbSize', 'medium');
        $selectedOrder = $request->input('selectedOrder', 'latest');

        $api_url = 'https://www.eporner.com/api/v2/video/search/';
        $params = [
            'per_page'   => 300,
            'query'      => $selectedCategory,
            'page'       => $selectedPage,
            'thumbsize'  => $selectedThumbSize,
            'order'      => $selectedOrder,
        ];

        $response = $this->ereplaceAPICall($api_url, $params);

        if ($response) {
            $response = json_decode($response);

            // Iterate over the videos returned from the API
            foreach ($response->videos as $video) {
                $insertResponse = $this->insertVideo(
                    $selectedCategory,
                    $video->id,
                    $video->title,
                    $video->keywords ?? '',
                    $video->url,
                    $video->default_thumb->src ?? '',
                    $video->default_thumb->size ?? '',
                    $video->length_sec ?? 0,
                    $video->length_min ?? '',
                    $video->embed ?? '',
                    $selectedPage
                );

                // If video was successfully inserted, handle thumbnails
                if ($insertResponse->getData()->status == 'success') {
                    if (isset($video->thumbs)) {
                        $this->insertThumbnails($insertResponse->getData()->video_id, $video->thumbs);
                    }
                }
            }

            // Return success message after processing
            // Get the total count of rows in the 'videos' table
            $totalRecords = DB::table('videos')->count();
            // Return success message after processing with total record count
            return response()->json([
                'status' => 'completed',
                'message' => 'All videos processed.',
                'processed_count' => count($response->videos),
                'total_records' => $totalRecords // Total rows in the 'videos' table
            ], 200);
        } else {
            return response()->json(['error' => 'No response from API'], 500);
        }
    }

    public function countByeporner()
    {

        $latestVideo  = DB::table('videos')->select('api_id','video_id', 'page')->orderBy('video_id', 'desc')->first();
        $lpageNumber  = !empty($latestVideo->page) ? $latestVideo->page : 0;
        $totalRecords = DB::table('videos')->count();
        $starList = DB::table('videos')->select('api_id','video_id', 'url', 'category', 'thumb_src', 'page', 'status')->where('page', $lpageNumber)->get();

        return response()->json([
            'latestVideo' => $latestVideo,
            'starList' => $starList,
            'total_records' => $totalRecords // Total rows in the 'videos' table
        ], 200);
    }

    private function insertVideo($category, $id, $title, $keywords, $url, $thumb_src, $thumb_size, $length_sec, $length_min, $embed, $page)
    {
        // Check if a video with the same 'id' or 'url' already exists
        $existingVideo = DB::table('videos')
            ->where('id', $id)
            ->orWhere('url', $url)
            ->first();

        // If the video exists, return a message indicating it's a duplicate
        if ($existingVideo) {
            return response()->json([
                'status' => 'duplicate',
                'message' => 'Video with the same ID or URL already exists.',
                'video_id' => $id,
                'url' => $url
            ], 200);
        }

        // Insert video if it does not exist and return a success message
        $lastInsertId = DB::table('videos')->insertGetId([
            'category' => $category,
            'api_id' => $id,
            'title' => $title,
            'keywords' => $keywords,
            'url' => $url,
            'thumb_src' => $thumb_src,
            'thumb_size' => $thumb_size,
            'length_sec' => $length_sec,
            'length_min' => $length_min,
            'embed' => $embed,
            'page' => $page,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Return success message with inserted video details
        return response()->json([
            'status' => 'success',
            'message' => 'Video inserted successfully.',
            'video_id' => $lastInsertId,
            'url' => $url
        ], 201);
    }

    private function insertThumbnails($video_id, $thumbs)
    {
        foreach ($thumbs as $thumb) {
            DB::table('video_thumbnails')->insert([
                'video_id' => $video_id,  // Using the video_id from insertVideo()
                'thumb_src' => $thumb->src,
                'thumb_size' => $thumb->size,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    private function ereplaceAPICall($api_url, $params)
    {
        try {
            $response = Http::get($api_url, $params);  // Using Laravel's Http facade to call the API
            return $response->body();
        } catch (\Exception $e) {
            return false;
        }
    }

    public function getPornCategory()
    {

        $categories = Categorys::select('id', 'name', 'slug')->where('status', 1)->get();
        return response()->json($categories);
    }

    public function filterCategoryWiseGallery(Request $request)
    {
        $selectCat = $request->selectedCategory;
        $page = $request->get('page', 1); // Get the current page, default is 1
        $limit = 100;
        $offset = ($page - 1) * $limit;
        // Paginate the results
        $multipleChk = HostersModel::where('category', 'like', '%' . $selectCat . '%')
            ->offset($offset)
            ->limit($limit)
            ->get();

        $totalCount = HostersModel::where('category', 'like', '%' . $selectCat . '%')->count();
        $totalCountAll = HostersModel::count();
        return response()->json([
            'data' => $multipleChk,
            'totalCount' => $totalCount,
            'totalCountAll' => $totalCountAll
        ]);
    }

    public function filterCategoryWiseVideoGallery(Request $request)
    {

        $selectCat = $request->selectedCategory;
        $page = $request->get('page', 1); // Get the current page, default is 1
        $limit = 6;
        $offset = ($page - 1) * $limit;
        // Paginate the results
        $multipleChk = HostersModel::where('category', 'like', '%' . $selectCat . '%')
            ->offset($offset)
            ->limit($limit)
            ->where('status', 1)
            ->get();
        $totalCount = HostersModel::where('category', 'like', '%' . $selectCat . '%')->count();

        return response()->json([
            'data' => $multipleChk,
            'totalCount' => $totalCount
        ]);
    }

    public function insertForGalleryVideo(Request $request)
    {
        $id = $request->id; // This will be a string like "496,497,499,500"

        if (!empty($id)) {
            $idsArray = explode(',', $id);
            $recordsRows = Videos::whereIn('video_id', $idsArray)->get();

            // Guzzle client
            foreach ($recordsRows as $v) {
                $imageUrl = $v->thumb_src; // URL of the image
                $imageName = basename($imageUrl); // Extract the image file name

                // Use the service to download and save the image with a unique name
                $imagePath = $this->imageDownloader->downloadAndSaveImage($imageUrl, $imageName);

                if ($imagePath) {
                    // Insert the image path into the Gallery table
                    Gallery::create([
                        'video_id'   => $v->video_id,
                        'image_path' => $imagePath,
                        'status'     => 1,
                    ]);
                }
            }

            // Return a success response
            return response()->json([
                'message' => 'Images successfully downloaded and inserted into Gallery.',
            ], 200);
        }
    }

    public function galleryData()
    {
        $recordsRows = Gallery::where('status', 1)->get();
        $dataList = [];
        foreach ($recordsRows as $v) {
            $imageUrl = url($v->image_path);  //'storage/' . $v->image_path; // URL of the image
            // Save data to the array
            $dataList[] = [
                'id'        => $v->id,
                'imagepath' => url($imageUrl), // Path for the image
            ];
        }

        return response()->json($dataList, 200);
    }

    public function deleteGalleryId(Request $request)
    {

        $id       = $request->id; // This will be a string like "496,497,499,500"
        $galleryItem = Gallery::find($id);
        if ($galleryItem) {
            // Optionally, delete the image file from storage if necessary
            Storage::disk('public')->delete($galleryItem->image_path);
            // Delete the gallery item
            $galleryItem->delete();

            // Return a success response
            return response()->json([
                'success' => true,
                'message' => 'Gallery item deleted successfully.'
            ], 200);
        }
    }
    public function deleteVideoId(Request $request)
    {
        $id       = $request->id; // This will be a string like "496,497,499,500"
        if (!empty($id)) {
            $idsArray = explode(',', $id);
            $deletedRows = HostersModel::whereIn('video_id', $idsArray)->delete();
            if ($deletedRows > 0) {
                return response()->json(['success' => 'Records deleted successfully.'], 200);
            } else {
                return response()->json(['error' => 'No records found to delete.'], 404);
            }
        } else {
            return response()->json(['error' => 'No ID Selected.'], 404);
        }
    }
 
    public function getAllchaturbateApiV1Data(Request $request){

        $page = $request->input('page', 1);
        $pageSize = $request->input('pageSize', 10);

        // Get search query from the request
        $searchQuery    = $request->searchQuery;
        $selectedFilter = (int)$request->selectedFilter;
        // dd($selectedFilter);
        $query = Chaturbateapi::orderBy('chaturbate_api.id', 'desc');

        if ($searchQuery !== null) {
            $query->where('chaturbate_api.room_subject', 'like', '%' . $searchQuery . '%');
        }

        if ($selectedFilter !== null) {
            $query->where('chaturbate_api.status', $selectedFilter);
        }
        $paginator = $query->paginate($pageSize, ['*'], 'page', $page);

        $modifiedCollection = $paginator->getCollection()->map(function ($item) {

            $status         = $item->status == 1  ? 'Active' : "None";
            return [
                'id'            => $item->id,
                'display_name'  => $item->display_name,
                'location'      => $item->location, 
                'email'         => $item->current_show,
                'phone_number'  => $item->phone_number,
                'room_subject'  => $item->show_passwroom_subjectord,
                'image_url'     => $item->image_url,
                'spoken_languages' => $item->spoken_languages,
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

    public function chaturbateApiV1Data()
    {

        // $url = 'https://chaturbate.com/affiliates/api/onlinerooms/?format=json&wm=mJxqA';     
        // // Fetch data from the API
        // $response = file_get_contents($url);
        // if ($response === FALSE) {
        //     return response()->json(['error' => 'Error occurred while trying to retrieve the data.'], 500);
        // }
        // // Decode the JSON response
        // $data = json_decode($response, true);

        $url = 'https://chaturbate.com/affiliates/api/onlinerooms/?format=json&wm=mJxqA';
        $ch = curl_init($url);

        // Set cURL options
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);



        
        $response = curl_exec($ch);
        if ($response === FALSE) {
            $error = curl_error($ch);
            curl_close($ch);
            return response()->json(['error' => 'Error occurred while trying to retrieve the data: ' . $error], 500);
        }
        curl_close($ch);
        $data = json_decode($response, true);
        // Check if data is in the expected format
        if (!is_array($data)) {
            return response()->json(['error' => 'Unexpected API response format.'], 500);
        }
        DB::table((new OnlineRoom())->getTable())->truncate();
        // Process each item in the response data
        foreach ($data as $room) {
            // Ensure all necessary keys exist in the data array
            $roomData = [
                'gender' => $room['gender'] ?? null,
                'location' => $room['location'] ?? null,
                'current_show' => $room['current_show'] ?? null,
                'username' => $room['username'] ?? null,
                'room_subject' => $room['room_subject'] ?? null,
                'tags' => $room['tags'] ?? null,
                'is_new' => $room['is_new'] ?? false,
                'num_users' => $room['num_users'] ?? 0,
                'num_followers' => $room['num_followers'] ?? 0,
                'country' => $room['country'] ?? null,
                'spoken_languages' => $room['spoken_languages'] ?? null,
                'display_name' => $room['display_name'] ?? null,
                'birthday' => $room['birthday'] ?? null,
                'is_hd' => $room['is_hd'] ?? false,
                'age' => $room['age'] ?? null,
                'seconds_online' => $room['seconds_online'] ?? 0,
                'image_url' => $room['image_url'] ?? null,
                'image_url_360x270' => $room['image_url_360x270'] ?? null,
                'chat_room_url_revshare' => $room['chat_room_url_revshare'] ?? null,
                'iframe_embed_revshare' => $room['iframe_embed_revshare'] ?? null,
                'chat_room_url' => $room['chat_room_url'] ?? null,
                'iframe_embed' => $room['iframe_embed'] ?? null,
                'block_from_countries' => $room['block_from_countries'] ?? null,
                'block_from_states' => $room['block_from_states'] ?? null,
                'recorded' => $room['recorded'] ?? false,
                'slug' => $room['slug'] ?? null,
                'type' => 'apiv1',
            ];

            // Insert or update the database record
            OnlineRoom::updateOrCreate(
                ['username' => $room['username']], // Unique key
                $roomData
            );
        }
        return response()->json(['success' => 'Data successfully fetched and stored.'], 200);
    }
}
