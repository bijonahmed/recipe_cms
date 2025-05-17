<?php
namespace App\Models;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;
use DB;
class User extends Authenticatable implements JWTSubject
{
  use HasApiTokens, HasFactory, Notifiable;

  public $table = "users";
  protected $fillable = [
    'name',
    'username',
    'company',
    'email',
    'level_commission',
    'inviteCode',
    'role_id',
    'show_password',
    'ref_id',
    'doc_file',
    'telegram',
    'whtsapp',
    'nationality_id',
    'register_ip',
    'othersway_connect',
    'password',
    'with_password',
    'with_show_password',
    'real_name',
    'company_name',
    'fg_id',
    'status',
    'phone',
    'fg_wallet_address',

  ];
  protected $hidden = [
    'password',
    'remember_token',
  ];
  protected $casts = [
    'email_verified_at' => 'datetime',
    'password' => 'hashed',
  ];
  public function getJWTIdentifier()
  {
    return $this->getKey();
  }
  public function getJWTCustomClaims()
  {
    return [];
  }
 

  
 
   
 

   
}
