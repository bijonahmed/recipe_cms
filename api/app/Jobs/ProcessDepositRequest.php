<?php

namespace App\Jobs;


use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\Deposit;
use App\Models\BulkAddress;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class ProcessDepositRequest implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;


    public $deposit;
    public $cryptoWalletAddress;
    public $created_at;
    public $id;
    public function __construct(Deposit $deposit)
    {
        $this->deposit              = $deposit;
        $this->cryptoWalletAddress  = $deposit->to_crypto_wallet_address;
        $this->created_at           = $deposit->created_at;
        $this->id                   = $deposit->id;
        Log::info("construct cryptoWalletAddress: {$this->cryptoWalletAddress}");
        //  dd($deposit);
    }


    /**
     * Execute the job.
     */
    public function handle()
    {
        // $property = "to crypto address: {$this->cryptoWalletAddress}, created at : {$this->created_at}, deposit id: {$this->id}";
        try {
            Log::info("Processing job for Deposit ID: {$this->id} and cryptoWalletAddress: {$this->cryptoWalletAddress}");

            // Your processing logic...
            $contractAddress = $this->cryptoWalletAddress; //$v->to_crypto_wallet_address;
            $db_datetime = date('Y-m-d', strtotime($this->created_at));
            $apiUrl = "https://api.trongrid.io/v1/accounts/{$contractAddress}/transactions/trc20?limit=1&only_confirmed=true";
            //Log::info("Processing deposit for wallet: " . $this->deposit->to_crypto_wallet_address);

            try {
                $response = Http::get($apiUrl);
                if ($response->successful() && isset($response['data'][0])) {
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

                    if ($contractAddress === $to && $dateTime === $db_datetime) {

                        $chkAdd     = BulkAddress::where('walletAddress', $to)->first();
                        $chkdeposit = Deposit::where('id', $this->id)->first();
                        if ($chkAdd) {

                            $chkAdd->block_status = 0; // Update status to the desired value
                            $chkAdd->save(); // Save the changes to the database
                            //Log::info("bulk address update block status: 0");
                        }

                        if ($chkdeposit) {
                            $chkdeposit->status = 1; // Update status to the desired value
                            $chkdeposit->save(); // Save the changes to the database
                           // Log::info("deposit update status: 1");
                        }
                        //echo "Deposit request id: {$this->id}, Wallet Address: {$contractAddress}---DB add: $contractAddress<br>";
                        //echo "To: {$to}<br>";
                        //echo "Date and Time: {$dateTime}----------DB date: $db_datetime<br><hr/>";
                    }
                } else {
                    echo "No transactions found for Wallet Address: {$contractAddress}<br><br>";
                }
            } catch (\Exception $e) {
                echo "Error processing Wallet Address: {$contractAddress} - " . $e->getMessage() . "<br>";
            }
            //END

        } catch (\Exception $e) {
            Log::error("Error processing job for Deposit ID: {$this->id} - " . $e->getMessage());
        }
        //Log::info("handle insie cryptoWalletAddress: {$this->cryptoWalletAddress}");

        /*
        $contractAddress = $this->cryptoWalletAddress; //$v->to_crypto_wallet_address;
        $db_datetime = date('Y-m-d', strtotime($this->created_at));
        $apiUrl = "https://api.trongrid.io/v1/accounts/{$contractAddress}/transactions/trc20?limit=1&only_confirmed=true";
        //Log::info("Processing deposit for wallet: " . $this->deposit->to_crypto_wallet_address);
        
        try {
            $response = Http::get($apiUrl);

            if ($response->successful() && isset($response['data'][0])) {
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

                if ($contractAddress === $to && $dateTime === $db_datetime) {

                    $chkAdd     = BulkAddress::where('walletAddress', $to)->first();
                    $chkdeposit = Deposit::where('id', $this->id)->first();
                    if ($chkAdd) {

                        $chkAdd->block_status = 0; // Update status to the desired value
                        $chkAdd->save(); // Save the changes to the database

                        Log::info("bulk address update block status: 0");

                    }

                    if ($chkdeposit) {
                        $chkdeposit->status = 1; // Update status to the desired value
                        $chkdeposit->save(); // Save the changes to the database
                        Log::info("deposit update status: 1");
                    }
                    echo "Deposit request id: {$this->id}, Wallet Address: {$contractAddress}---DB add: $contractAddress<br>";
                    echo "To: {$to}<br>";
                    echo "Date and Time: {$dateTime}----------DB date: $db_datetime<br><hr/>";
                }
            } else {
                echo "No transactions found for Wallet Address: {$contractAddress}<br><br>";
            }
        } catch (\Exception $e) {
            echo "Error processing Wallet Address: {$contractAddress} - " . $e->getMessage() . "<br>";
        }
          */
    }
}
