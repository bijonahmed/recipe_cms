<?php
namespace App\Models;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use AuthorizesRequests;
use DB;
class PostLike extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    public $table = "post_likes";
    protected $fillable = [
        'user_id',
        'recepi_id',
    ];
}
