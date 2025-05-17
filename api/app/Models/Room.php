<?php
namespace App\Models;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use AuthorizesRequests;
use DB;
class Room extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    public $table = "room";
    protected $fillable = [
        'name',
        'slug',
        'roomType',
        'capacity',
        'extraCapacity',
        'roomPrice',
        'bedCharge',
        'room_size_id',
        'bedNumber',
        'bed_type_id',
        'roomDescription',
        'reserveCondition',
        'status',
    ];
}
