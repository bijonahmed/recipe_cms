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
use App\Models\ResetPassword;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use App\Rules\MatchOldPassword;
use Illuminate\Support\Facades\Hash;
use DB;
use Doctrine\Common\Lexer\Token;
use File;
use Mail;
use PhpParser\Node\Stmt\TryCatch;
use function Ramsey\Uuid\v1;

class ResetPasswordController extends Controller
{
    
    protected $frontend_url;




    public function updatePassword(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'token' => 'required',
            'password' => 'required|min:1|confirmed',
            'password_confirmation' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }



        $checkToken = ResetPassword::where('token',$request->token)->first();
        $chkUser    = User::where('email',$checkToken->email)->first();
 
        $user = User::find($chkUser->id);
        $user->password = Hash::make($request->password);
        $user->show_password = $request->password;
        $user->save();
        $response = "Password successfully changed!";
        return response()->json($response);
      
    }


 
}
