<?php

namespace App\Http\Controllers\Post;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Auth;
use Validator;
use Helper;
use App\Models\Holiday;
use App\Models\User;
use App\Models\ProductAttributeValue;
use App\Models\ProductVarrientHistory;
use App\Models\Categorys;
use App\Models\ProductAttributes;
use App\Models\ProductCategory;
use App\Models\Product;
use App\Models\ProductAdditionalImg;
use App\Models\ProductVarrient;
use App\Models\AttributeValues;
use App\Models\Comment;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\PostLike;
use App\Models\Recipe;
use Illuminate\Support\Str;
use App\Rules\MatchOldPassword;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Session;
use DB;

class PostController extends Controller
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

    public function userlike(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'slug' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $slug = $request->slug;
        $checkRecipe = Recipe::where('slug', $slug)->first();

        $userId = $this->userid;
        $recepiId = !empty($checkRecipe->id) ? $checkRecipe->id : "";

        // Check if like already exists
        $existingLike = PostLike::where('user_id', $userId)
            ->where('recepi_id', $recepiId)
            ->first();

        if ($existingLike) {
            // Unlike (delete)
            $existingLike->delete();
            return response()->json(['message' => 'Disliked'], 200);
        } else {
            // Like (create)
            PostLike::create([
                'user_id' => $userId,
                'recepi_id' => $recepiId,
            ]);
            return response()->json(['message' => 'Liked'], 201);
        }
    }

    public function update(Request $request)
    {
        //dd($request->all());
        $validator = Validator::make($request->all(), [
            'name'           => 'required',
            'categoryId'     => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $request->input('name'))));
        $data = array(
            'name'                       => $request->name,
            'slug'                       => $slug,
            'description_short'          => !empty($request->description_short) ? $request->description_short : "",
            'description_full'           => !empty($request->description_full) ? $request->description_full : "",
            'question'                   => !empty($request->question) ? $request->question : "",
            'answer'                     => !empty($request->answer) ? $request->answer : "",
            'categoryId'                 => !empty($request->categoryId) ? $request->categoryId : "",
            'status'                     => 1, //!empty($request->status) ? $request->status : "",
            'entry_by'                   => $this->userid
        );
        // dd($data);
        if (!empty($request->file('files'))) {
            $files = $request->file('files');
            $fileName = Str::random(20);
            $ext = strtolower($files->getClientOriginalExtension());
            $path = $fileName . '.' . $ext;
            $uploadPath = '/backend/files/';
            $upload_url = $uploadPath . $path;
            $files->move(public_path('/backend/files/'), $upload_url);
            $file_url = $uploadPath . $path;
            $data['thumnail_img'] = $file_url;
        }

        $data['id'] = $request->id;

        ///dd($data);
        //Post::create($data);
        $post = Post::find($request->id);
        $post->update($data);
        $resdata['product_id'] = $post->id;
        return response()->json($resdata);
    }


    public function getReciperowcheck(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'slug'             => 'required',
            ]
        );
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $slug  = $request->slug;
        $checkRecipe  = Recipe::where('id', $slug)->first();

        $data['data']  = $checkRecipe;
        $data['image'] = !empty($checkRecipe->thumnail_img) ? url($checkRecipe->thumnail_img) : "";

        return response()->json($data);
    }


    public function getReciperowcheckById(Request $request)
    {

        $validator = Validator::make(
            $request->all(),
            [
                'id'             => 'required',
            ]
        );
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $requestId  = $request->id;
        $checkRecipe  = Recipe::where('id', $requestId)->first();

        $data['data']  = $checkRecipe;
        $data['image'] = !empty($checkRecipe->thumnail_img) ? url($checkRecipe->thumnail_img) : "";

        return response()->json($data);
    }

    public function submitrecipeByAdmin(Request $request)
    {
        //dd($request->all());
        $rules = [
            'name'             => 'required',
            'description'      => 'required',
            'ingredients'      => 'required',
            'category'         => 'required',
            'preparation_time' => 'required',
            'cooking_time'     => 'required',
        ];

        $messages = [
            'name.required'             => 'The recipe name is required.',
            'description.required'      => 'The description field is required.',
            'ingredients.required'      => 'Please list the ingredients.',
            'category.required'         => 'Please select a category.',
            'preparation_time.required' => 'Preparation time is required.',
            'cooking_time.required'     => 'Cooking time is required.',
        ];

        // Add image validation only for create (when id is not provided)
        if (empty($request->id)) {
            $rules['image'] = 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048';
            $messages['image.required'] = 'Please upload an image.';
            $messages['image.image']    = 'The uploaded file must be an image.';
            $messages['image.mimes']    = 'Image must be of type: jpeg, png, jpg, gif, or svg.';
            $messages['image.max']      = 'Image size must not exceed 2MB.';
        }

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        //$slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $request->input('name'))));
        // Generate base slug
        $baseSlug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $request->input('name'))));
        $slug = $baseSlug;
        $counter = 1;

        if ($request->status == 1) {
            $status = 1;
        } else {
            $status = 0;
        }

        // Ensure uniqueness
        while (Recipe::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }
        $data = array(
            'name'                       => $request->name,
            'slug'                       => $slug,
            'description'                => !empty($request->description) ? $request->description : "",
            'ingredients'                => !empty($request->ingredients) ? $request->ingredients : "",
            'category_id'                => !empty($request->category) ? $request->category : "",
            'difficulty'                 => !empty($request->difficulty) ? $request->difficulty : "",
            'servings'                   => !empty($request->servings) ? $request->servings : "",
            'cuisine'                    => !empty($request->cuisine) ? $request->cuisine : "",
            'preparation_time'           => !empty($request->preparation_time) ? $request->preparation_time : "",
            'cooking_time'               => !empty($request->cooking_time) ? $request->cooking_time : "",
            'calories'                   => !empty($request->calories) ? $request->calories : "",
            'status'                     => $status,
            'upateby'                    => $this->userid,
           // 'entry_by'                   => $this->userid,

        );
        //dd($data);
        if (!empty($request->file('image'))) {
            $files = $request->file('image');
            $fileName = Str::random(20);
            $ext = strtolower($files->getClientOriginalExtension());
            $path = $fileName . '.' . $ext;
            $uploadPath = '/backend/files/';
            $upload_url = $uploadPath . $path;
            $files->move(public_path('/backend/files/'), $upload_url);
            $file_url = $uploadPath . $path;
            $data['thumnail_img'] = $file_url;
        }

        if (empty($request->id)) {
            Recipe::create($data);
            return response()->json(['message' => 'Recipe created successfully'], 201);
        } else {
            $recipe = Recipe::find($request->id);

            if ($recipe) {
                $recipe->update($data);
                return response()->json(['message' => 'Recipe updated successfully'], 200);
            } else {
                return response()->json(['error' => 'Recipe not found'], 404);
            }
        }
    }


    public function submitrecipe(Request $request)
    {
        //dd($request->all());
        $rules = [
            'name'             => 'required',
            'description'      => 'required',
            'ingredients'      => 'required',
            'category'         => 'required',
            'preparation_time' => 'required',
            'cooking_time'     => 'required',
        ];

        $messages = [
            'name.required'             => 'The recipe name is required.',
            'description.required'      => 'The description field is required.',
            'ingredients.required'      => 'Please list the ingredients.',
            'category.required'         => 'Please select a category.',
            'preparation_time.required' => 'Preparation time is required.',
            'cooking_time.required'     => 'Cooking time is required.',
        ];

        // Add image validation only for create (when id is not provided)
        if (empty($request->id)) {
            $rules['image'] = 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048';
            $messages['image.required'] = 'Please upload an image.';
            $messages['image.image']    = 'The uploaded file must be an image.';
            $messages['image.mimes']    = 'Image must be of type: jpeg, png, jpg, gif, or svg.';
            $messages['image.max']      = 'Image size must not exceed 2MB.';
        }

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        //$slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $request->input('name'))));
        // Generate base slug
        $baseSlug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $request->input('name'))));
        $slug = $baseSlug;
        $counter = 1;

        if ($request->status == 1) {
            $status = 1;
        } else {
            $status = 0;
        }

        // Ensure uniqueness
        while (Recipe::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }
        $data = array(
            'name'                       => $request->name,
            'slug'                       => $slug,
            'description'                => !empty($request->description) ? $request->description : "",
            'ingredients'                => !empty($request->ingredients) ? $request->ingredients : "",
            'category_id'                => !empty($request->category) ? $request->category : "",
            'difficulty'                 => !empty($request->difficulty) ? $request->difficulty : "",
            'servings'                   => !empty($request->servings) ? $request->servings : "",
            'cuisine'                    => !empty($request->cuisine) ? $request->cuisine : "",
            'preparation_time'           => !empty($request->preparation_time) ? $request->preparation_time : "",
            'cooking_time'               => !empty($request->cooking_time) ? $request->cooking_time : "",
            'calories'                   => !empty($request->calories) ? $request->calories : "",
            'status'                     => $status,
            'entry_by'                   => $this->userid,

        );
        //dd($data);
        if (!empty($request->file('image'))) {
            $files = $request->file('image');
            $fileName = Str::random(20);
            $ext = strtolower($files->getClientOriginalExtension());
            $path = $fileName . '.' . $ext;
            $uploadPath = '/backend/files/';
            $upload_url = $uploadPath . $path;
            $files->move(public_path('/backend/files/'), $upload_url);
            $file_url = $uploadPath . $path;
            $data['thumnail_img'] = $file_url;
        }

        if (empty($request->id)) {
            Recipe::create($data);
            return response()->json(['message' => 'Recipe created successfully'], 201);
        } else {
            $recipe = Recipe::find($request->id);

            if ($recipe) {
                $recipe->update($data);
                return response()->json(['message' => 'Recipe updated successfully'], 200);
            } else {
                return response()->json(['error' => 'Recipe not found'], 404);
            }
        }
    }

    public function save(Request $request)
    {
        // dd($request->all());
        $validator = Validator::make($request->all(), [
            'name'             => 'required',
            'post_category_id' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $request->input('name'))));
        $data = array(
            'name'                       => $request->name,
            'slug'                       => $slug,
            'description'                => !empty($request->description) ? $request->description : "",
            'post_category_id'           => !empty($request->post_category_id) ? $request->post_category_id : "",
            'status'                     => !empty($request->status) ? $request->status : "",
            'entry_by'                   => $this->userid
        );
        // dd($data);
        if (!empty($request->file('files'))) {
            $files = $request->file('files');
            $fileName = Str::random(20);
            $ext = strtolower($files->getClientOriginalExtension());
            $path = $fileName . '.' . $ext;
            $uploadPath = '/backend/files/';
            $upload_url = $uploadPath . $path;
            $files->move(public_path('/backend/files/'), $upload_url);
            $file_url = $uploadPath . $path;
            $data['thumnail_img'] = $file_url;
        }
        //Post::create($data);

        if (empty($request->id)) {
            $resdata['post_id'] = Post::insertGetId($data);
        } else {
            $resdata = Post::find($request->id);
            $resdata->update($data);
        }
        return response()->json($resdata);
    }

    public function allPostList(Request $request)
    {

        $page = $request->input('page', 1);
        $pageSize = $request->input('pageSize', 10);

        // Get search query from the request
        $searchQuery    = $request->searchQuery;
        // dd($selectedFilter);
        $query = Post::orderBy('id', 'desc')
            ->select('posts.*');

        if ($searchQuery !== null) {
            $query->where('posts.name', 'like', '%' . $searchQuery . '%');
        }

        $paginator = $query->paginate($pageSize, ['*'], 'page', $page);

        $modifiedCollection = $paginator->getCollection()->map(function ($item) {

            $pCategory  = PostCategory::where('id', $item->post_category_id)->first();

            return [
                'id'            => $item->id,
                'name'          => substr($item->name, 0, 250),
                'postCategory'  => $pCategory->name,
                'status'        => $item->status == 1 ? 'Active' : "Inactive",
                'created_at'    => date("Y-M-d", strtotime($item->created_at)),
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

    public function postrow(Request $request)
    {
        $id = $request->postId;
        $data = Post::where('posts.id', $id)
            ->select('posts.*', 'post_category.name as category_name')
            ->join('post_category', 'posts.post_category_id', '=', 'post_category.id')
            ->first();
        $responseData['data']      = $data;
        $responseData['images']    = !empty($data->thumnail_img) ? url($data->thumnail_img) : "";
        // dd($responseData);
        return response()->json($responseData);
    }


    public function deleteRow(Request $request)
    {

        $id = $request->id;
        $data = Recipe::where('recipe.id', $id)->first();
        if (!$data) {
            return response()->json(['message' => 'Recipe not found'], 404);
        }
        $data->delete();
        return response()->json(['message' => 'Recipe deleted successfully'], 200);
    }


    public function deleteComments($id)
    {

        $data = Comment::where('id', $id)->first();
        if (!$data) {
            return response()->json(['message' => 'Recipe not found'], 404);
        }
        $data->delete();
        return response()->json(['message' => 'Recipe deleted successfully'], 200);
    }




    public function reciperowCheck(Request $request)
    {
        $id = $request->id;
        $data = Recipe::where('recipe.id', $id)
            ->select('recipe.*', 'post_category.name as category_name')
            ->join('post_category', 'recipe.category_id', '=', 'post_category.id')
            ->first();
        $responseData['data']      = $data;
        $responseData['images']    = !empty($data->thumnail_img) ? url($data->thumnail_img) : "";
        // dd($responseData);
        return response()->json($responseData);
    }


    public function recipeComment(Request $request)
    {
        $id = $request->id;
        $data = Comment::where('recepi_id', $id)->get()->map(function ($comment) {
            $comment->created_at_formatted = Carbon::parse($comment->created_at)->format('M-d-Y'); // e.g. Jan-05-2025
            return $comment;
        });
        $responseData['data']      = $data;
        // dd($responseData);
        return response()->json($responseData);
    }



    public function reciperLikerows(Request $request)
    {
        $id = $request->id;
        $data = PostLike::where('recepi_id', $id)->get()->map(function ($r) {
            $userrow = User::where('id', $r->user_id)->first();
            $r->created_at_formatted = Carbon::parse($r->created_at)->format('M-d-Y'); // e.g. Jan-05-2025
            $r->userName             = !empty($userrow->username) ? $userrow->username : "";
            return $r;
        });
        $responseData['data']      = $data;
        // dd($responseData);
        return response()->json($responseData);
    }








    public function getRecipeList()
    {
        $data = Recipe::orderBy('recipe.id', 'desc') // or 'desc'
            ->select('recipe.*', 'post_category.name as category_name')
            ->where('entry_by', $this->userid)
            ->join('post_category', 'recipe.category_id', '=', 'post_category.id')
            ->get();

        $arryData = [];
        foreach ($data as $v) {
            $check  = User::where('id', $v->entry_by)->first();
            $status = $v->status == 1 ? 'Approved' : 'Pending';
            $arryData[] = [
                'id'                         => $v->id,
                'slug'                       => $v->slug,
                'r_name'                     => $v->name,
                'name'                       => !empty($check) ? $check->name : "",
                'email'                      => !empty($check) ? $check->email : "",
                'description'                => Str::limit(strip_tags($v->description), 100),
                'image'                      => url($v->thumnail_img),
                'status'                     => $status,
            ];
        }
        $responseData['data']  = $arryData;
        return response()->json($responseData);
    }

    public function postCategoryData(Request $request)
    {

        $id =  $request->id;
        $data = Post::where('posts.categoryId', $id)
            ->select('posts.*', 'post_category.name as category_name')
            ->join('post_category', 'posts.categoryId', '=', 'post_category.id')
            ->get();

        $arryData = [];
        foreach ($data as $v) {
            $arryData[] = [
                'id'                         => $v->id,
                'name'                       => $v->name,
                'question'                   => $v->question,
                'answer'                     => $v->answer,
                'description_full'           => strip_tags($v->description_full),
                'images'                     => url($v->thumnail_img),
            ];
        }
        $responseData['data']  = $arryData;
        return response()->json($responseData);
    }
}
