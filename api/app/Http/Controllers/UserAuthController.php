<?php

namespace App\Http\Controllers;

use App\Mail\Guestsendingmail;
use DB;
use Validator;
use App\Models\User;
use App\Models\Setting;
use App\Models\ApiConfig;
use App\Models\Booking;
use App\Models\MakePlayers;
use App\Models\Room;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class UserAuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'userRegister', 'guestRegister', 'register', 'showProfileData', 'updateprofile', 'updatePassword']]);
    }
    protected function validateLogin(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);
    }
    public function login(Request $request)
    {
        // dd($request->all());
        $this->validateLogin($request);
        $credentials = request(['username', 'password']);
        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json([
                'errors' => [
                    'account' => [
                        "Invalid username or password"
                    ]
                ]
            ], 422);
        }
        return $this->respondWithToken($token);
    }

    public function guestRegister(Request $request)
    {
        //dd($request->all());
        $validator = Validator::make(
            $request->all(),
            [
                'name'  => 'required',
                'email' => 'required|email|unique:users,email',
                'phone' => 'required',
                'paymenttype' => 'required',
                'checkin'   => 'required|date',
                'checkout'  => 'required|date|after_or_equal:checkin',
            ],
            [
                'name.required'     => 'Please enter your name.',
                'phone.required'    => 'Please enter your phone.',
                'paymenttype.required' => 'Payment type required.',
                'email.required'    => 'Email address is required.',
                'email.email'       => 'Please provide a valid email address.',
                'email.unique'      => 'This email address is already taken.',
                'checkin.date'      => 'Check-in date must be a valid date.',
                'checkout.required' => 'Please select a check-out date.',
                'checkout.date'     => 'Check-out date must be a valid date.',
                'checkout.after_or_equal' => 'Check-out date must be the same or after the check-in date.',
            ]
        );


        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $checkSlug = Room::where('slug', $request->slug)->first();
        //echo $checkSlug->id;exit; 
        $existingBooking = Booking::where('room_id', $checkSlug->id)
            ->where(function ($query) use ($request) {
                $query->where(function ($q) use ($request) {
                    $q->where('checkin', '<', $request->checkout)
                        ->where('checkout', '>', $request->checkin);
                });
            })->first();

        if ($existingBooking) {
            $nextAvailableDate = Carbon::parse($existingBooking->checkout)->format('Y-m-d');
            return response()->json([
                'message' => 'Room already booked for selected dates. Please choose a checkout date after ' . $nextAvailableDate,
            ], 409); // 409 Conflict
        }

        $password = '#123456#';
        $username = $this->generateUniqueRandomNumber(); // you'll define this method
        
        $user = User::create([
            'name'          => $request->name,
            'email'         => $request->email,
            'phone'         => $request->phone,
            'role_id'       => 2,
            'status'        => 1,
            'username'      => $username, // generated unique number
            'register_ip'   => $request->ip(),
            'inviteCode'    => $this->generateUniqueRandomNumber(),
            'show_password' => $password, // store plain text (optional, not recommended for security)
            'password'      => bcrypt($password), // secure hash
        ]);


        $domain   = $request->domain;
        $loginUrl = "https://moon-nest.com/login";//$domain . '/login';
       
        $customData = [
            'username'   => $username,
            'login_url'  => $loginUrl,
            'password'   => $password
        ];
        // Send email
        
        
        $to = $request->email;
        $subject = 'Moon Nest Account';
        
        $headers  = "MIME-Version: 1.0\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8\r\n";
        $headers .= "From: Moon Nest <info@moon-nest.com>\r\n";
        
        $message = "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <title>Moon Nest Account</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                .email-container { background-color: #ffffff; max-width: 600px; margin: 40px auto; padding: 30px 40px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); }
                h2 { color: #2c3e50; margin-bottom: 20px; }
                p { font-size: 16px; line-height: 1.6; color: #333; }
                ul { list-style-type: none; padding: 0; }
                ul li { font-size: 16px; margin-bottom: 10px; background-color: #f9f9f9; padding: 10px 15px; border-radius: 6px; }
                .btn { display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; font-weight: bold; border-radius: 5px; }
                .footer { margin-top: 30px; font-size: 14px; color: #888; }
            </style>
        </head>
        <body>
            <div class='email-container'>
                <h2>Welcome to Moon Nest!</h2>
                <p>Dear user,</p>
                <p>Thank you for registering. Below are your login credentials:</p>
                <ul>
                    <li><strong>Username:</strong> {$customData['username']}</li>
                    <li><strong>Password:</strong> {$customData['password']}</li>
                </ul>
                <p>Please keep this information safe and do not share it with anyone.</p>
                <p><a href='{$customData['login_url']}' class='btn'>Login to Moon Nest</a></p>
                <div class='footer'>
                    <p>Best regards,<br><strong>Moon Nest Team</strong></p>
                </div>
            </div>
        </body>
        </html>
        ";
        
        mail($to, $subject, $message, $headers);
                
        
       // Mail::to($request->email)->send(new Guestsendingmail($customData));
        //end

        $inviteCode               = $this->generateUniqueRandomNumber();
        $fg                       = 'FG' . sprintf('%09d', $user->id);
        $user->update([
            'inviteCode'       => $inviteCode,
            'fg_id'            => $fg, // Add other fields and their respective values here
            'fg_wallet_address' => md5($fg),
            // Add more fields as needed
        ]);
        // Get the token
        $token = auth('api')->login($user);
        return $this->respondWithToken($token);

    }
    public function userRegister(Request $request)
    {
        //  dd($request->all());
        $setting = Setting::find(1);

        $this->validate($request, [
            'name'        => 'required',
            'email'       => 'required|unique:users,email',
            'username'    => 'required|unique:users,username',
            'password'    => 'required|min:6|confirmed',
            // 'password'   => 'required|min:6'
        ]);

        $inviteCode       = $request->input('inviteCode');
        $user             = User::where('inviteCode', $inviteCode)->first();
        //$this->checkMlmComission($inviteCode);
        $user = User::create([
            'name'                => $request->name,
            'email'               => $request->email,
            'role_id'             => 2,
            'available_balance'   => !empty($setting->register_bonus) ? $setting->register_bonus : 0, // 3 UIC
            'ref_id'              => !empty($user->id) ? $user->id : "",
            'status'              => 1,
            'username'            => $request->username,
            'register_ip'         => $request->ip(),
            'inviteCode'          => $this->generateUniqueRandomNumber(),
            'show_password'       => $request->password,
            'password'            => bcrypt($request->password),
        ]);

        $lastInsertedId           = $user->id;
        $inviteCode               = $this->generateUniqueRandomNumber();
        $fg                       = 'FG' . sprintf('%09d', $user->id);
        $user->update([
            'inviteCode'       => $inviteCode,
            'fg_id'            => $fg, // Add other fields and their respective values here
            'fg_wallet_address' => md5($fg),
            // Add more fields as needed
        ]);


        // Get the token
        $token = auth('api')->login($user);
        //echo $token;exit; 
        //$this->makePlayer($request->username, $request->password, $lastInsertedId);

        // echo $token;exit; 
        return $this->respondWithToken($token);
    }
    public function register(Request $request)
    {

        // dd($request->all());
        $setting = Setting::find(1);

        $this->validate($request, [
            'name'        => 'required',
            'email'       => 'required|unique:users,email',
            'username'    => 'required|unique:users,username',
            'password'    => 'required|min:6|confirmed',
            // 'password'   => 'required|min:6'
        ]);

        $inviteCode       = $request->input('inviteCode');
        $user             = User::where('inviteCode', $inviteCode)->first();
        //$this->checkMlmComission($inviteCode);
        $user = User::create([
            'name'                => $request->name,
            'email'               => $request->email,
            'role_id'             => 2,
            'available_balance'   => !empty($setting->register_bonus) ? $setting->register_bonus : 0, // 3 UIC
            'ref_id'              => !empty($user->id) ? $user->id : "",
            'status'              => 1,
            'username'            => $request->username,
            'register_ip'         => $request->ip(),
            'inviteCode'          => $this->generateUniqueRandomNumber(),
            'show_password'       => $request->password,
            'password'            => bcrypt($request->password),
        ]);

        $lastInsertedId           = $user->id;
        $inviteCode               = $this->generateUniqueRandomNumber();
        $fg                       = 'FG' . sprintf('%09d', $user->id);
        $user->update([
            'inviteCode'       => $inviteCode,
            'fg_id'            => $fg, // Add other fields and their respective values here
            'fg_wallet_address' => md5($fg),
            // Add more fields as needed
        ]);
        // Get the token
        $token = auth('api')->login($user);
        $this->makePlayer($request->username, $request->password, $lastInsertedId);

        return $this->respondWithToken($token);
    }


    public function generateUniqueRandomNumber()
    {
        $microtime = microtime(true); // Get the current microtime as a float
        $microtimeString = str_replace('.', '', (string)$microtime); // Remove the dot from microtime
        // Extract the last 5 digits
        $uniqueId = substr($microtimeString, -7);
        return $uniqueId; // Since we're generating only one number, return the first (and only) element of the array
    }


    public function me()
    {
        return response()->json($this->guard('api')->user());
    }
    public function logout()
    {
        auth()->guard('api')->logout();
        return response()->json(['message' => 'Successfully logged out']);
    }
    public function refresh()
    {
        return $this->respondWithToken($this->guard('api')->refresh());
    }


    protected function respondWithToken($token)
    {
        $user = auth('api')->user();
        return response()->json([
            'success' => true, // Indicating success
            'status'  => 200, // Indicating success
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => $user
        ], 200); // Explicitly set HTTP status 200
    }

    public function guard()
    {
        return Auth::guard();
    }
    public function profile(Request $request)
    {
        $user = auth('api')->user();
        $this->validate($request, [
            'name' => 'required',
            'email' => "required|unique:users,email, $user->id",
            'password' => 'sometimes|nullable|min:8'
        ]);
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);
        if ($request->password) {
            $user->update([
                'password' => bcrypt($request->password),
            ]);
        }
        return response()->json([
            'success' => true,
            'user' => $user
        ], 200);
    }
    public function updateprofile(Request $request)
    {
        $user = auth('api')->user();
        $authId = $user->id;
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required',
            'phone_number' => 'required',
            'address' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $data = array(
            'id'                => $authId,
            'name'              => !empty($request->name) ? $request->name : "",
            'email'             => !empty($request->email) ? $request->email : "",
            'phone_number'      => !empty($request->phone_number) ? $request->phone_number : "",
            'address'           => !empty($request->address) ? $request->address : "",
            'website'           => !empty($request->website) ? $request->website : "",
            'github'            => !empty($request->github) ? $request->github : "",
            'twitter'           => !empty($request->twitter) ? $request->twitter : "",
            'instagram'         => !empty($request->instagram) ? $request->instagram : "",
            'facebook'          => !empty($request->facebook) ? $request->facebook : "",
        );
        if (!empty($request->file('file'))) {
            $documents = $request->file('file');
            $fileName = Str::random(20);
            $ext = strtolower($documents->getClientOriginalExtension());
            $path = $fileName . '.' . $ext;
            $uploadPath = '/backend/files/';
            $upload_url = $uploadPath . $path;
            $documents->move(public_path('/backend/files/'), $upload_url);
            $data['image'] = $upload_url;
        }
        //dd($data);
        DB::table('users')->where('id', $authId)->update($data);
        $response = [
            'imagelink' => !empty($user) ? url($user->image) : "",
            'message' => 'User successfully update'
        ];
        return response()->json($response);
    }
    public function showProfileData(Request $request)
    {
        $data = auth('api')->user();
        return response()->json([
            'data' => $data,
            'dataImg' => !empty($data->image) ? url($data->image) : "",
            'message' => 'User Profile Data'
        ]);
    }
    public function changesPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'password' => 'required|min:1|confirmed',
            'password_confirmation' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $id = auth('api')->user();
        $user = User::find($id->id);
        //dd($currentuser->username);
        $user->password = Hash::make($request->password);
        $user->show_password = $request->password;
        $user->save();
        $response = "Password successfully changed!";
        return response()->json($response);
    }
}