<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\MiningCategory;
use App\Models\MiningHistory;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class StartCommand extends Command
{
    protected $signature = 'app:start-command';
    protected $description = 'Display time every second between start and end times';


    public function handle()
    {

        date_default_timezone_set('Asia/Dhaka');
        //php artisan schedule:run  working
        $userid = Cache::get('current_userid');
        $mining_category_id = Cache::get('current_mining_category_id');
        \Log::info('StartCommand is executed with UserID: (' . $userid . ') and mining category id: (' . $mining_category_id . ')');
        $miningHistoryRecords = MiningHistory::orderBy('id', 'DESC')
            ->where('mining_category_id', $mining_category_id)
            ->get();

        if ($miningHistoryRecords->isNotEmpty()) {
            $this->info("TestCommand executed for Mining Category ID: $mining_category_id.");

            $customTimeZone = 'Asia/Dhaka';
            $currentTime    = Carbon::now($customTimeZone);
            // Array to hold total assets for each user
            $userAssets = [];
            // Group mining history records by user_id and accumulate assets
            foreach ($miningHistoryRecords as $record) {
                $userId = $record->user_id;
                $mining_id = $record->mining_category_id;
                $getminCategory = MiningCategory::where('id', $mining_id)->first();
                $end_time = $record->end_time;
                // Check if the current time is less than the end time
                if ($currentTime->lessThan($end_time)) {
                    $differenceInSeconds = $currentTime->diffInSeconds($end_time);
                    $minutes = intdiv($differenceInSeconds, 60);
                    $seconds = $differenceInSeconds % 60;
                    // For Assets Calculation 
                    $miningAmount = (float) $getminCategory->minining_amount_per_secnd;  // Convert to float first
                    $miningAmount = number_format($miningAmount, 10); // Format for display (optional)
                    $miningAmount = strval($miningAmount); // Convert back to string before bcmul

                    $startCatTime = $record->start_time;
                    $getSeconds   = $currentTime->diffInSeconds($startCatTime);

                    $assets = $getSeconds * $miningAmount;

                    // Accumulate the assets for each user
                    if (!isset($userAssets[$userId])) {
                        $userAssets[$userId] = 0;
                    }
                    $userAssets[$userId] += $assets;
                } else {
                    echo "Current time is not small for record ID: {$record->id}<br>";
                }
            }

            // Update all users' balances
            foreach ($userAssets as $userId => $totalAssets) {
                $user = User::find($userId);
                if ($user) {
                    //$user->available_balance += number_format($totalAssets, 8);
                    $user->mining_amount += number_format($totalAssets, 8);
                    $user->save(); // Save the changes to the database
                    echo "Updated User ID: $userId with new balance: {$user->mining_amount}<br>";
                } else {
                    echo "User not found for ID: $userId<br>";
                }
            }
        } else {
            echo "No mining history records found for Mining Category ID: $mining_category_id!";
            // $data['status']   = 0; 
            // $data['messages'] = "No mining history records found!"; 
            // return response()->json($data, 200);
        }
    }
}
