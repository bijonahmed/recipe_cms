<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;
use App\Models\GlobalWalletAddress;
use App\Models\UserWalletAddress;
//GlobalWalletAddress

class WalletSetupCommand extends Command
{

    protected $signature = 'app:wallet-setup-command';
    protected $description = 'Display time every minnite check and delete. this command run everyTwoMinutes';

    public function handle()
    {

        date_default_timezone_set('Asia/Dhaka');
        //php artisan schedule:run  working
        $nowTime = Carbon::now();
        \Log::info('WalletSetupCommand is now run. now time is : ' . $nowTime);

        // Fetch rows to be deleted
        $userWallets = UserWalletAddress::where('delete_time', '<=', $nowTime)->get();

        if ($userWallets->isEmpty()) {
            $this->info('No rows found to delete.');
            return;
        }

        foreach ($userWallets as $userWallet) {
            $globalUserWallAddId = $userWallet->global_user_wall_add_id;
            // Delete the row
            $userWallet->delete();
            // Update the status in another table
            GlobalWalletAddress::where('id', $globalUserWallAddId)->update(['lock_unlock' => 0]); // Replace 'new_status' with your desired status
        }

        UserWalletAddress::where('delete_time', '<=', $nowTime)->delete();
        echo "Now time: " . $nowTime;
    }
}
