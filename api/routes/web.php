<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Public\PublicController;
use App\Http\Controllers\Public\ApiDepositRequest;
use App\Http\Controllers\Public\PublicOrderStatusUpdate;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\Payment\PaypalController;
use App\Http\Controllers\FileUploadController;

Route::get('/clear-cache', function () {
    $exitCode = Artisan::call('optimize:clear');
    // return what you want
});
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/
 
Route::get('checkdepositRequest', [ApiDepositRequest::class, 'checkdepositRequest']);

Route::get('/', function () {
    return view('welcome');
});

Route::get('/upload', function () {
    return view('upload'); // Return the upload form view
});


Route::get('/large', function () {
    return view('large'); // Return the upload form view
});


Route::get('/upload', [FileUploadController::class, 'showForm'])->name('file.form');
Route::post('/upload', [FileUploadController::class, 'uploadFile'])->name('file.upload');
Route::post('/largeUpload', [FileUploadController::class, 'largeUploadFile'])->name('file.largeUpload');
