<?php
namespace App\Models;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use AuthorizesRequests;
use DB;
class Booking extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    public $table = "booking";
    protected $fillable = [
        'name',
        'email',
        'phone',
        'checkin',
        'checkout',
        'booking_id',
        'paymenttype',
        'room_price',
        'room_id',
        'adult',
        'child',
        'message',
        'customer_id',
        'arival_from',
        'update_by',
        'check_out_reason',
        'check_out_by',
        'booking_status'
    ];
}
