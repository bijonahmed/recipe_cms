<?php

namespace App\Http\Controllers\Booking;

use App\Category;
use App\Http\Controllers\Controller;
use App\Models\Attribute;
use App\Models\AttributeValues;
use App\Models\Booking;
use App\Models\Categorys;
use App\Models\MiningCategory;
use App\Models\MiningHistory;
use App\Models\Mystore;
use App\Models\PostCategory;
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
use Carbon\Carbon;
use DB;
use Helper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Validator;

class GuestBookingController extends Controller
{

 

    public function bookingRequest(Request $request)
    {
        //dd($request->all());
        $validator = Validator::make(
            $request->all(),
            [
                'name'          => 'required',
                'phone'         => 'required',
                'slug'          => 'required',
                'paymenttype'   => 'required',
                'email'     => 'required|email',
                'checkin'   => 'required|date',
                'checkout'  => 'required|date|after_or_equal:checkin',
            ],
            [
                'name.required'            => 'Please enter your name.',
                'phone.required'           => 'Please enter your phone.',
                'paymenttype.required'     => 'Please select payment type.',
                'email.required'    => 'Email address is required.',
                'email.email'       => 'Please provide a valid email address.',
                'checkin.required'  => 'Please select a check-in date.',
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

        // Call the separate method to generate a unique booking ID
        $bookingId = $this->generateUniqueBookingId();
        $checkRoom = Room::where('id', $checkSlug->id)->first();

        $data = [
            'booking_id'  => $bookingId,  // Adding custom unique booking ID
            'name'        => $request->name,
            'email'       => $request->email,
            'phone'       => $request->phone,
            'checkin'     => $request->checkin,
            'checkout'    => $request->checkout,
            'paymenttype' => $request->paymenttype,
            'room_price'  => $checkRoom->roomPrice,
            'room_id'     => $checkSlug->id,
            'adult'       => $request->adult,
            'child'       => $request->child,
            'message'     => $request->message,
            'customer_id' => $request->user_id,
            'booking_status' => 1,
        ];

        Booking::create($data);

        $updateRoom = [
            'booking_status' => 1,
        ];
        Room::where('id', $checkSlug->id)->update($updateRoom);

        return response()->json(['message' => 'Successfully booked.']);
    }

    // Separate method to generate unique booking ID
    public function generateUniqueBookingId()
    {
        // Generate a random 5-digit number initially
        $bookingId = rand(10000, 99999); // 5-digit number
        // Continue generating until a unique ID is found
        while (Booking::where('booking_id', $bookingId)->exists()) {
            $bookingId = rand(10000, 99999); // Generate a new 5-digit number if it exists
        }
        return $bookingId; // Return the unique booking ID
    }
}
