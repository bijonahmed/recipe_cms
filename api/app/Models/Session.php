<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Session extends Model
{
    protected $table = 'sessions'; // Name of your sessions table
    
    protected $fillable = [
        'user_id', 'token', 'expiration'
    ];

    // Define any relationships or additional methods here
}
