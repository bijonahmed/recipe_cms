<?php

namespace App\Http\Controllers\Report;

use App\Category;
use App\Http\Controllers\Controller;
use App\Models\Attribute;
use App\Models\AttributeValues;
use App\Models\Booking;
use App\Models\Categorys;
use App\Models\Comment;
use App\Models\MiningCategory;
use App\Models\MiningHistory;
use App\Models\Mystore;
use App\Models\PostCategory;
use App\Models\PostLike;
use App\Models\Product;
use App\Models\ProductAttributes;
use App\Models\ProductAttributeValue;
use App\Models\Recipe;
use App\Models\Room;
use App\Models\RoomImages;
use App\Models\Setting;
use App\Models\SubAttribute;
use App\Models\User;
use App\Rules\MatchOldPassword;
use Auth;
use BcMath\Number;
use Carbon\Carbon;
use DB;
use Helper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Validator;

class ReportController extends Controller
{
    protected $userid;
    public function __construct()
    {
        $this->middleware('auth:api');
        $user = auth('api')->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }
        $this->userid = $user->id;
    }


    public function filterByRecipieport(Request $request)
    {

        $fromDate   = $request->fromDate;
        $toDate     = $request->toDate;
        $user_id    = $request->user_id;
        $status     = $request->selectedFilter;

        $query = Recipe::query()
            ->select('recipe.*', 'users.username as username', 'users.email') // Add desired user columns
            ->join('users', 'users.id', '=', 'recipe.entry_by'); // Join with users table

        // Filter by date range
        if ($fromDate && $toDate) {
            $query->whereBetween(\DB::raw('DATE(recipe.created_at)'), [$fromDate, $toDate]);
        }

        // Filter by user ID
        if ($user_id) {
            $query->where('recipe.entry_by', $user_id);
        }

        $reportData = $query->orderBy('recipe.id', 'desc')->get();
        // Modify each item for thumbnail URL and formatted date
        $reportData->transform(function ($item) {

            $countComment = Comment::where('recepi_id', $item->id)->count();
            $countLike = PostLike::where('recepi_id', $item->id)->count();

            $item->thumbnailimg = url($item->thumnail_img); // or asset($item->thumbnail_img)
            $item->formatted_date = Carbon::parse($item->created_at)->format('d M Y');
            $item->noComment = $countComment;
            $item->noLike = $countLike;
            return $item;
        });
        return response()->json($reportData, 200);
    }
}
