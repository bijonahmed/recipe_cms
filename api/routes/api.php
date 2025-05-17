<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;
use App\Http\Controllers\AuthController;
use App\Http\Middleware\CheckUserStatus;
use App\Http\Controllers\UserAuthController;
use App\Http\Controllers\Post\PostController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\Public\PublicController;
use App\Http\Controllers\Setting\SettingController;
use App\Http\Controllers\Deposits\DepositController;
use App\Http\Controllers\Setting\LeftSideMenuController;
use App\Http\Controllers\UnauthenticatedController;
use App\Http\Controllers\Category\CategoryController;
use App\Http\Controllers\RoomSetting\RoomSettingController;
use App\Http\Controllers\Facility\FacilityController;
use App\Http\Controllers\Booking\BookingController;
use App\Http\Controllers\Booking\GuestBookingController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Report\ReportController;
use SebastianBergmann\CodeCoverage\Report\Html\Dashboard;

Route::get('/cc', function () {
    $exitCode = Artisan::call('optimize:clear');
    echo "clean done";
    // return what you want
});
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
Route::get('settingrowClient', [UnauthenticatedController::class, 'settingrowClient']);
Route::group([
    'middleware' => 'api',
    'prefix'     => 'auth'
], function () {
    Route::post('userRegister', [UserAuthController::class, 'userRegister']);
    Route::post('guestRegister', [UserAuthController::class, 'guestRegister']);
    Route::post('userLogin', [UserAuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::post('profile', [AuthController::class, 'profile']);
    Route::post('me', [AuthController::class, 'me']);
    Route::post('updateprofile', [AuthController::class, 'updateprofile']);
    Route::post('updateUserProfileSocial', [AuthController::class, 'updateUserProfileSocial']);
    Route::post('changesPassword', [AuthController::class, 'changesPassword']);
    Route::post('updatePassword', [AuthController::class, 'updatePassword']);
    Route::get('showProfileData', [AuthController::class, 'showProfileData']);
});

Route::group([
    'prefix' => 'public'
], function () {
    Route::get('/getCommentsData', [PublicController::class, 'getCommentsData']);
    Route::get('getSlugData', [PublicController::class, 'getSlugData']);
    Route::get('getRecipeList', [PublicController::class, 'getRecipeList']);
    Route::get('getRecipeData', [PublicController::class, 'getRecipeData']);
    Route::post('bookingRequest', [GuestBookingController::class, 'bookingRequest']);
    Route::get('/activeRooms', [PublicController::class, 'activeRooms']);
    Route::get('/getServiceList', [PublicController::class, 'getServiceList']);
    Route::get('/getRoomDetails', [PublicController::class, 'getRoomDetails']);
    Route::get('/getSliders', [PublicController::class, 'getSliders']);
    Route::post('/getMerchentRequest', [PublicController::class, 'getMerchentRequest']);
    Route::get('/getApiReport', [PublicController::class, 'getTronApiReport']);
    Route::get('checkselectedfacilities', [PublicController::class, 'checkselectedfacilities']);
    Route::get('getGlobalData', [PublicController::class, 'getGlobalData']);
    Route::get('getGlobalSettingdata', [PublicController::class, 'getGlobalSettingdata']);
    Route::post('/sendContact', [PublicController::class, 'sendContact']);
    Route::post('/filterBooking', [PublicController::class, 'filterBooking']);

});
/*
Route::group([
    'prefix' => 'booking'
], function () {
    Route::get('getUserRow', [BookingController::class, 'editUserId']);
    Route::get('/getRoomDetails', [BookingController::class, 'getRoomDetails']);
    Route::post('bookingRequest', [BookingController::class, 'bookingRequest']);
    Route::get('/getBookingDetails', [BookingController::class, 'getBookingDetails']);
    Route::get('/activeBookingRooms', [BookingController::class, 'activeBookingRooms']);
  
});
*/
Route::middleware(['auth:api', CheckUserStatus::class])->group(function () {

    Route::group([
        'prefix' => 'booking'
    ], function () {
        Route::get('getUserRow', [BookingController::class, 'editUserId']);
        Route::get('/getRoomDetails', [BookingController::class, 'getRoomDetails']);
        Route::post('bookingRequest', [BookingController::class, 'bookingRequest']);
        Route::get('/getBookingDetails', [BookingController::class, 'getBookingDetails']);
        Route::get('/activeBookingRooms', [BookingController::class, 'activeBookingRooms']);
        Route::get('/checkroomBookingStatus', [BookingController::class, 'checkroomBookingStatus']);
        Route::get('/getBookingEditdata', [BookingController::class, 'getBookingEditdata']);
        Route::post('/bookingUpdate', [BookingController::class, 'bookingUpdate']);
        Route::post('/bookingUpdateInOut', [BookingController::class, 'bookingUpdateInOut']);
        Route::post('/adminBookingRequest', [BookingController::class, 'adminBookingRequest']);
        Route::post('/checkStatusUpdate', [BookingController::class, 'checkStatusUpdate']);
    });

    Route::group([
        'prefix' => 'user'
    ], function () {
      
        Route::post('/commentSubmit', [UserController::class, 'commentSubmit']);
        Route::get('getBulkAddressMerchant', [UserController::class, 'getBulkAddressMerchant']);
        Route::get('getRoleList', [UserController::class, 'getRoleList']);
        Route::get('getRoles', [UserController::class, 'getRoles']);
        Route::get('roleCheck', [UserController::class, 'roleCheck']);
        Route::post('saveRole', [UserController::class, 'saveRole']);
        Route::post('upload-excel-bulk-address', [UserController::class, 'uploadExcelbulkAddress']);
        Route::get('deleteWallet', [UserController::class, 'deleteWallet']);
        Route::post('changePassword', [UserController::class, 'changePassword']);
        Route::post('changePasswordClient', [UserController::class, 'changePasswordClient']);
        Route::post('updateUserProPass', [UserController::class, 'updateUserProPass']);
        Route::post('saveUser', [UserController::class, 'saveUser']);
        Route::post('updateBookingUser', [UserController::class, 'updateBookingUser']);
        Route::post('updateUser', [UserController::class, 'updateUser']);
        Route::post('updateUserProfileImg', [UserController::class, 'updateUserProfileImg']);
        Route::get('getOnlyMerchantList', [UserController::class, 'getOnlyMerchantList']);
        Route::get('findUserDetails', [UserController::class, 'findUserDetails']);
        Route::get('findMerchantDetails', [UserController::class, 'findMerchantDetails']);
        Route::get('checkCurrentUser', [UserController::class, 'checkCurrentUser']);
        Route::get('getUserRow', [UserController::class, 'editUserId']);
        Route::get('allUsers', [UserController::class, 'allUsers']);
    });

    Route::group([
        'prefix' => 'category'
    ], function () {

        Route::post('save', [CategoryController::class, 'save']);
        Route::post('edit', [CategoryController::class, 'edit']);

        Route::get('PostCategory', [CategoryController::class, 'PostCategory']);
        Route::post('postCategorySave', [CategoryController::class, 'postCategorySave']);
        Route::post('GeneralCategorySave', [CategoryController::class, 'GeneralCategorySave']);
        Route::get('checkPostCategory', [CategoryController::class, 'checkPostCategory']);
        Route::get('checkGeneralCategory', [CategoryController::class, 'checkGeneralCategory']);

        Route::get('categoryRow/{id}', [CategoryController::class, 'findCategoryRow']);
        Route::get('search', [CategoryController::class, 'searchCategory']);

        Route::get('postCategorysearch', [CategoryController::class, 'postCategorysearch']);
        Route::get('allCategorys', [CategoryController::class, 'getCategoryList']);
        Route::get('GeneralCategoryList', [CategoryController::class, 'GeneralCategoryList']);
        Route::get('getPostCategory', [CategoryController::class, 'getPostCategorys']);
    });

    Route::group([
        'prefix' => 'post'
    ], function () {
        Route::post('postInsert', [PostController::class, 'save']);
        Route::post('update', [PostController::class, 'update']);
        Route::get('getPostrow', [PostController::class, 'postrow']);
        Route::get('getPostList', [PostController::class, 'allPostList']);
        Route::get('postCategoryData', [PostController::class, 'postCategoryData']);
        Route::post('submit-recipe', [PostController::class, 'submitrecipe']);
        Route::post('submit-recipe-by-admin', [PostController::class, 'submitrecipeByAdmin']);
        Route::get('getReciperowcheck', [PostController::class, 'getReciperowcheck']);
        Route::get('getReciperowcheckById', [PostController::class, 'getReciperowcheckById']);
        Route::get('getRecipeList', [PostController::class, 'getRecipeList']);
        Route::post('userlike', [PostController::class, 'userlike']);
        Route::get('reciperowCheck', [PostController::class, 'reciperowCheck']);
        Route::get('recipeComment', [PostController::class, 'recipeComment']);
        Route::get('reciperLikerows', [PostController::class, 'reciperLikerows']);
        Route::get('deleteRow', [PostController::class, 'deleteRow']);
        Route::get('deleteComments/{id}', [PostController::class, 'deleteComments']);
    });


    Route::group([
        'prefix' => 'roomsetting'
    ], function () {
        Route::post('roomFacilitiesSave', [RoomSettingController::class, 'roomFacilitiesSave']);
        Route::get('promocodeList', [RoomSettingController::class, 'promocodeList']);
        Route::post('promoCodeSave', [RoomSettingController::class, 'promoCodeSave']);
        Route::get('delteRoomImages', [RoomSettingController::class, 'delteRoomImages']);
        Route::post('roomImagesSave', [RoomSettingController::class, 'roomImagesSave']);
        Route::get('roomList', [RoomSettingController::class, 'roomList']);
        Route::post('roomSave', [RoomSettingController::class, 'roomSave']);
        Route::get('roomSizeList', [RoomSettingController::class, 'roomSizeList']);
        Route::get('getsRoomSize', [RoomSettingController::class, 'getsRoomSize']);
        Route::get('getsRoomTypes', [RoomSettingController::class, 'getsRoomTypes']);
        Route::get('getsRoomImages', [RoomSettingController::class, 'getsRoomImages']);

        Route::get('getsBetType', [RoomSettingController::class, 'getsBetType']);
        Route::post('roomSizeSave', [RoomSettingController::class, 'roomSizeSave']);
        Route::get('checkPromoCodeRow', [RoomSettingController::class, 'checkPromoCodeRow']);
        Route::get('checkRoomSizeRow', [RoomSettingController::class, 'checkRoomSizeRow']);
        Route::post('bedtypeSave', [RoomSettingController::class, 'bedtypeSave']);
        Route::get('bedtypelist', [RoomSettingController::class, 'bedtypelist']);
        Route::get('checkRoomRow', [RoomSettingController::class, 'checkRoomRow']);
        Route::get('checkBedTypeRow', [RoomSettingController::class, 'checkBedTypeRow']);
        Route::post('bookingTypeSave', [RoomSettingController::class, 'bookingTypeSave']);
        Route::get('bookingTypeList', [RoomSettingController::class, 'bookingTypeList']);
        Route::get('checkBookingTypeRow', [RoomSettingController::class, 'checkBookingTypeRow']);
        Route::get('filterRoomImage', [RoomSettingController::class, 'filterRoomImage']);
        Route::get('checkselectedfacilities', [RoomSettingController::class, 'checkselectedfacilities']);
        Route::post('deleteSelectedFacilities', [RoomSettingController::class, 'deleteSelectedFacilities']);
    });


    Route::group([
        'prefix' => 'roomfacility'
    ], function () {

        Route::get('getsFacilityGruop', [FacilityController::class, 'getsFacilityGruop']);
        Route::post('roomFacilitySave', [FacilityController::class, 'roomFacilitySave']);
        Route::get('roomfacility_group_list', [FacilityController::class, 'roomfacilityGroupList']);
        Route::get('roomfacility_list', [FacilityController::class, 'roomfacility_list']);
        Route::post('roomFacilityGroupSave', [FacilityController::class, 'roomFacilityGroupSave']);
        Route::get('checkRoomFacilityGroupRow', [FacilityController::class, 'checkRoomFacilityGroupRow']);
        Route::get('checkFacilities', [FacilityController::class, 'checkFacilities']);
        Route::get('checkRoomFacilityRow', [FacilityController::class, 'checkRoomFacilityRow']);
    });


    Route::group([
        'prefix' => 'dashboard'
    ], function () {
        Route::get('countBookingData', [DashboardController::class, 'countBookingData']);
        Route::get('getTodayBookingList', [DashboardController::class, 'getTodayBookingList']);
    });


    Route::group([
        'prefix' => 'report'
    ], function () {
        Route::get('filterByRecipieport', [ReportController::class, 'filterByRecipieport']);
    });


    Route::group([
        'prefix' => 'setting'
    ], function () {
        Route::get('/dynamicLeftSidebarmenu', [LeftSideMenuController::class, 'dynamicMenuLeftSidebar']);
        Route::post('insertLanguageAdd', [SettingController::class, 'insertLanguageAdd']);
        Route::post('saveAPIKey', [SettingController::class, 'saveAPIKey']);
        Route::post('saveSetting', [SettingController::class, 'saveSetting']);
        Route::post('saveMerchantBulkAddress', [SettingController::class, 'saveMerchantBulkAddress']);
        Route::get('searchByConfigrationApiKey', [SettingController::class, 'searchByConfigrationApiKey']);
        Route::get('settingrowSystem', [SettingController::class, 'settingrow']);
        Route::get('getLanguageList', [SettingController::class, 'getLanguageList']);
        Route::get('getLanguageActiveList', [SettingController::class, 'getLanguageActiveList']);
        Route::get('languagerow/{id}', [SettingController::class, 'chkLanguagerow']);
        Route::get('getsSliderImages', [SettingController::class, 'getsSliderImages']);
        Route::get('getsServiceList', [SettingController::class, 'getsServiceList']);

        Route::get('delteSliderImages', [SettingController::class, 'delteSliderImages']);
        Route::get('deleteService', [SettingController::class, 'deleteService']);
        Route::post('sliderImagesSave', [SettingController::class, 'sliderSave']);
        Route::post('servicedataSave', [SettingController::class, 'servicedataSave']);
    });
});
