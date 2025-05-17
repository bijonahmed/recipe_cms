<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\Cache;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule. php artisan schedule:work
     */
    protected function schedule(Schedule $schedule): void
    {

        //$schedule->command('inspire')->hourly();
        //$schedule->command(command: 'app:start-command')->everySecond();
        //$schedule->command(command: 'app:deposit-requests')->everySecond();
        //$schedule->command('app:deposit-requests')->everyTenMinutes();
        $schedule->command('app:deposit-requests')->everyThreeMinutes();
        //$schedule->command('queue:work app:deposit-requests')->everySecond();
        //$schedule->command('app:start-command')->everySecond();

    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
