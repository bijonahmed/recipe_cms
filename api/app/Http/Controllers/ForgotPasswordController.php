<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Mail\TestMail;
use App\Mail\ForgotPasswordMail;
use App\Models\Category;
use Illuminate\Http\Request;
use Auth;
use Validator;
use Helper;
use App\Models\Product;
use App\Models\Sliders;
use App\Models\Post;
use App\Models\ProductCategory;
use App\Models\Categorys;
use App\Models\VerifyEmail;
use App\Models\Setting;
use App\Models\User;
use App\Models\ProductAdditionalImg;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use App\Rules\MatchOldPassword;
use Illuminate\Support\Facades\Hash;
use DB;
use File;
use Mail;
use PhpParser\Node\Stmt\TryCatch;
use function Ramsey\Uuid\v1;

class ForgotPasswordController extends Controller
{
    
    protected $frontend_url;




    public function sendPasswordResetEmail(Request $request)
    {

        //dd($request->all());
        $messages = [
            'email.exists' => 'The email does not exist in our records.',
        ];
        
        $validator = Validator::make($request->all(), [
           'email' => 'required|email|exists:users,email',
        ],$messages);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $userRecords = User::select('id','email','ocn_id')->where('email',$request->email)->first();
        $token = Str::random(60);

        DB::table('password_resets')->insert([
            'email' => $userRecords->email,
            'token' => $token,
            'created_at' => now(),
        ]);
        $baseUrl = (strpos($_SERVER['HTTP_HOST'], 'localhost') !== false) ? 'http://localhost:3000/reset-password' : 'https://oceantradeai.com/reset-password';
        $details = [
            'title' => 'Rest Password Verification',
            'body'  => 'This is a email using Forgot Password Mail.',
            'id'    => $userRecords->id,
            'email' => $userRecords->email,
            'token' => $token,
            'baseUrl' => $baseUrl   
        ];

        Mail::to($userRecords->email)->send(new ForgotPasswordMail($details));

        $response = [
            'message' => 'Sending Vertification Email'
        ];
        return response()->json($response, 200);
      
    }


 
}
