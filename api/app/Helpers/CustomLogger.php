<?php 
namespace App\Helpers;

use Illuminate\Support\Facades\Log;

class CustomLogger
{
    public static function apilog($message, $level = 'info')
    {
        Log::channel('apilog')->$level($message);
    }
}