<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Auth;
use Validator;
use Helper;

use App\Models\GameList;
use App\Models\GameCategory;
use App\Models\User;
use Illuminate\Support\Facades\Http; // Add this import
use App\Models\Post;
use Illuminate\Support\Str;
use App\Rules\MatchOldPassword;
use Illuminate\Support\Facades\Hash;
use Session;
use DB;

class TransferController extends Controller
{

    protected $apiurl;
    protected $account;
    protected $api_key;
    protected $api_code;
    protected $api_username;

    public function __construct(Request $request)
    {
        $this->apiurl       = 'https://api.yibo-api.com';
        $this->account      = 'fg88888';
        $this->api_key      = '16c5e06db5eb441d9a205892006b7966';
        $this->api_code     = 'ag';
        $this->api_username = 'bijonahmed';
    }


    function generateTransferNo()
    {

        $timestamp = microtime(true) * 10000; // Get a high precision timestamp
        $randomPart = bin2hex(random_bytes(8)); // Generate a random 16-character hexadecimal string
        $transferNo = $timestamp . $randomPart;
        return substr($transferNo, 0, 32); // Ensure transfer number length is at most 32 characters
    }
    public function sendDepositRequest()
    {
        // Generate the transfer number
        $trnNo = $this->generateTransferNo();
        // Define the amount and format it as BigDecimal with two decimal places
        $amount = 100.50;
        $formattedAmount = number_format($amount, 2, '.', '');
        // Prepare data for the POST request
        $postData = [
            'account'    => $this->account,
            'api_key'    => $this->api_key,
            'api_code'   => $this->api_code,
            'username'   => $this->api_username,
            'amount'     => $formattedAmount,
            'transferno' => $trnNo,
        ];

        // Initialize cURL
        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => $this->apiurl . '/ley/deposit',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => http_build_query($postData), // Properly encode the POST data
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/x-www-form-urlencoded', // Set the Content-Type header
            ],
        ]);

        // Execute cURL request
        $response = curl_exec($curl);
   // dd($response);
        $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE); // Get HTTP status code

        // Check for cURL errors
        if ($response === false) {
            echo 'Curl error: ' . curl_error($curl);
        } else {
            // Decode the JSON response
            $responseData = json_decode($response, true);
            // Check if the response indicates success
            if (isset($responseData['Code']) && $responseData['Code'] == 0) {
                echo '0 Operation successful';
            } else {
                // Print the error message from the API response
                echo 'Response: ' . $responseData['Message'];
            }
        }
        // Close cURL session
        curl_close($curl);

        dd($responseData['Message']);
    }
}
