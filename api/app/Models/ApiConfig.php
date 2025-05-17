<?php

namespace App\Models;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use AuthorizesRequests;
use DB;

class ApiConfig extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    public $table = "api_configs";
    protected $fillable = ['api_code', 'api_url', 'account', 'api_key'];
}
