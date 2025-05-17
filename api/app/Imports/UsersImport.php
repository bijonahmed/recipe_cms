<?php

namespace App\Imports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\ToModel;

class UsersImport implements ToModel
{
    
    public function model(array $row)
    {
        return new User([
            'name'  => $row[0], // Assuming name is in the first column
            'email' => $row[1], // Assuming email is in the second column
        ]);
    }
}
