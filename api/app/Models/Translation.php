<?php

namespace App\Models;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use AuthorizesRequests;
use DB;

class Translation extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    public $table = "translations";
    protected $fillable = [
        'language_code',
        'translation_key',
        'translated_value',
    ];



    public static function getTranslationsByLanguage($languageCode)
    {
        return self::where('language_code', $languageCode)
            ->pluck('translated_value', 'translation_key')
            ->toArray();
    }
}
