<?php
// app/Http/Controllers/ChartController.php
namespace App\Http\Controllers;
use App\Models\MiningGraph;
use Illuminate\Http\Request;
use Carbon\Carbon;
use DB;
class ChartController extends Controller
{

    public function getData()
    {
        // Get the start and end of the current month
    $startOfMonth = Carbon::now()->startOfMonth();
    $endOfMonth = Carbon::now()->endOfMonth();

    // Query data from MiningGraph table for the current month
    $miningData = MiningGraph::select(
            DB::raw('DATE(mining_date) as date'),
            DB::raw('SUM(mining_amount) as total_amount')
        )
        ->whereBetween('mining_date', [$startOfMonth, $endOfMonth])
        ->groupBy('date')
        ->orderBy('date')
        ->get();

    // Initialize an empty array to store the formatted data
    $data = [];

    // Format the data as required
    foreach ($miningData as $item) {
        // Assign total_amount to the specific date key
        $data[$item->date] = (float) number_format($item->total_amount,8);
    }
    return response()->json($data);
    }
    /*
    public function getData()
    {
        $data = [
            "2023-06-03" => 150,
            "2023-06-04" => 10,
            "2023-06-05" => 15,
            "2023-06-06" => 20,
            "2023-06-07" => 25,
            "2023-06-08" => 30,
            "2023-06-09" => 35,
            "2023-06-10" => 40,
            "2023-06-11" => 45,
            "2023-06-12" => 50,
            "2023-06-13" => 55,
            "2023-06-14" => 60,
            "2023-06-15" => 65,
            "2023-06-16" => 70,
            "2023-06-17" => 75,
            "2023-06-18" => 80,
            "2023-06-19" => 85,
            "2023-06-20" => 90,
        ];

        return response()->json($data);
    }
        */
}
