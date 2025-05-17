<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Jobs\ProcessDepositRequest;
use App\Models\ApiKey;
use App\Models\Deposit;
use App\Models\BulkAddress;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class ProcessDepositRequestCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:deposit-requests';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Dispatch jobs to process pending deposit requests';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //$this->info('Fetching pending deposit requests...');
        //Log::channel('apilog')->info('This is testing for ItSolutionStuff.com!');
        $rows = Deposit::where('status', 0)->get();
        foreach ($rows as $deposit) {
            // ProcessDepositRequest::dispatch($deposit);
            // $this->info("Job dispatched for Deposit ID: {$deposit->id}");
            //Log::channel('apilog')->info('This is testing for ItSolutionStuff.com!');
            $cryptoWalletAddress  = $deposit->to_crypto_wallet_address;
            $created_at           = $deposit->created_at;
            $id                   = $deposit->id;
            $merchant_id          = $deposit->merchant_id;
            $depositID            = $deposit->depositID;
            /// Log::info("Processing deposit id {$id} and crypto wall add." . $cryptoWalletAddress);

            $contractAddress = $cryptoWalletAddress; //$v->to_crypto_wallet_address;
            $db_datetime = date('Y-m-d', strtotime($created_at));
            $apiUrl = "https://api.trongrid.io/v1/accounts/{$contractAddress}/transactions/trc20?limit=1&only_confirmed=true";

            $response = Http::get($apiUrl);
            if ($response->successful() && isset($response['data'][0])) {

                $checkMerchant       = ApiKey::where('merchant_id', $deposit->merchant_id)->first();

                $lastTransaction = $response['data'][0];
                $transactionId = $lastTransaction['transaction_id'] ?? 'N/A';
                $from = $lastTransaction['from'] ?? 'N/A';
                $to = $lastTransaction['to'] ?? 'N/A';
                $amount = isset($lastTransaction['value'], $lastTransaction['token_info']['decimals'])
                    ? $lastTransaction['value'] / pow(10, $lastTransaction['token_info']['decimals'])
                    : 'N/A';
                $timestamp = $lastTransaction['block_timestamp'] ?? 'N/A';
                $amountInUsdt = is_numeric($amount) ? number_format($amount, 2) . ' USDT' : 'N/A';
                $dateTime = $timestamp !== 'N/A' ? date('Y-m-d', $timestamp / 1000) : 'N/A';


                // if ($contractAddress === $to && $dateTime === $db_datetime) {
                if ($contractAddress == $to) {

                    Deposit::where('id', $id)->update(['status' => 1]);
                    BulkAddress::where('walletAddress', $to)->update(['block_status' => 0]);

                    if (!empty($checkMerchant)) {
                        $callbackUrl = rtrim($checkMerchant->callback_domain, '/') . '/api/public/callbackStatus';
                        //echo $callbackUrl;
                        $postData = [
                            'depositID' => $depositID,
                            'status' => 1,
                        ];
                        // Initialize cURL session
                        $ch = curl_init($callbackUrl);
                        // Configure cURL options
                        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                        curl_setopt($ch, CURLOPT_POST, true);
                        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData)); // Use http_build_query for form data
                        curl_setopt($ch, CURLOPT_HTTPHEADER, [
                            'Content-Type: application/x-www-form-urlencoded', // Set appropriate content type
                            'Accept: application/json', // Optional, if the external API requires JSON responses
                        ]);
                        // Execute the cURL request
                        $response = curl_exec($ch);
                    }
                   

                    //echo "Deposit request id: {$id}, API Wallet To Address: {$to}---DB add: $contractAddress<br>";
                    //echo "Date and Time: {$dateTime}----------DB date: $db_datetime<br><hr/>";
                    //Log::info("Deposit id: {$id}, API Wallet To Address: {$to}---DB add: $contractAddress, Date and Time: {$dateTime}----------DB date: $db_datetime");
                    //Log::channel('apilog')->info("Deposit id: {$id}, API Wallet To Address: {$to}---DB add: $contractAddress, Date and Time: {$dateTime}----------DB date: $db_datetime");
                    Log::channel('apilog')->info(
                        <<<LOG
                    Deposit id: {$id}, 
                    API Respone Wallet Address: {$to}
                    AOU Resoibse Date and Time: {$dateTime}
                    DB add: {$contractAddress}
                    DB date: {$db_datetime}
                    _____________________________________________________________________________________________________________
                    LOG
                    );
                } else {

					Deposit::where('id', $id)->update(['status' => 2]);

                    //echo "Deposit request id: {$id}, API Wallet To Address: {$to}---DB add: $contractAddress<br>";
                    //echo "Date and Time: {$dateTime}----------DB date: $db_datetime<br><hr/>";
                    //Log::channel('apilog')->info("Failed, Deposit id: {$id}, API Wallet To Address: {$to}---DB add: $contractAddress, Date and Time: {$dateTime}----------DB date: $db_datetime");
                    Log::channel('apilog')->info(
                        <<<LOG
                    Failed
                    Deposit id: {$id}, 
                    API Respone Wallet Address: {$to}
                    API Respone Date and Time: {$dateTime}
                    DB add: {$contractAddress}
                    DB date: {$db_datetime}
                    _____________________________________________________________________________________________________________
                    LOG
                    );
                }
            }
            // Deposit::where('id', $id)->update(['status' => 1]);
            // BulkAddress::where('walletAddress', $to)->update(['block_status' => 0]);
        }
    }
}
