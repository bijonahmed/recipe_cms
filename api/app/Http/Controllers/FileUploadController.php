<?php

namespace App\Http\Controllers;

use App\Models\Video;

use App\Models\Videos;
use Illuminate\Http\Request;
use App\Jobs\ProcessSQLImport;
use Illuminate\Support\Facades\Storage;
use App\Jobs\ImportExcelJob;
use App\Jobs\LargeExcelJob;

class FileUploadController extends Controller
{

    public function showForm()
    {

        return view('upload');
    }

    public function uploadFile(Request $request)
    {
        $filePath = $request->file('file')->store('uploads');
        ImportExcelJob::dispatch($filePath);
        return back()->with('success', 'Excel file is be processed.');
    }


    public function largeUploadFile(Request $request)
    {
        $filePath = $request->file('file')->store('huploads');
        LargeExcelJob::dispatch($filePath);
        return back()->with('success', 'Excel file is be processed.');
    }
}
