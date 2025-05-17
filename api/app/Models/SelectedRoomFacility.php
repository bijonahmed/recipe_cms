<?php
namespace App\Models;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use AuthorizesRequests;
use DB;
class SelectedRoomFacility extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    public $table = "select_room_facilities";
    protected $fillable = [
        'room_id',
        'facilities_id',
        'room_facility_group_id',
        'status',
        'user_id'
    ];
}
