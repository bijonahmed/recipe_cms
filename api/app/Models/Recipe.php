<?php

namespace App\Models;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use AuthorizesRequests;
use DB;

class Recipe extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    public $table = "recipe";
    protected $fillable = [
        'name',
        'slug',
        'description',
        'ingredients',
        'category_id',
        'difficulty',
        'cuisine',
        'servings',
        'preparation_time',
        'cooking_time',
        'calories',
        'status',
        'entry_by',
        'upateby',
        'thumnail_img'
    ];
}
