<?php

namespace App\Imports;

use App\Models\Video;
use Maatwebsite\Excel\Concerns\ToModel;

class LargeHostersmport implements ToModel
{

    public function model(array $row)
    {
        return new Video([

            'video_id'  => $row[0], // Assuming name is in the first column
            'category'  => $row[1], // Assuming email is in the second column
            'api_id'    => $row[2], 
            'title'     => $row[3],
            'url'       => $row[4],
            'slug'      => $row[5],
            'thumb_src' => $row[6],
            'keywords'  => $row[7],
            'thumb_size'=> $row[8],
            'length_sec'=> $row[9],
            'length_min'=> $row[10],
            'embed'     => $row[11],
            'status'    => $row[12],

        ]);
    }
}
