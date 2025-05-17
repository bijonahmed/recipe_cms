<?php

namespace App\Http\Controllers\Api;

use DB;
use Auth;
use Helper;
use Session;
use Validator;
use App\Models\Post;
use App\Models\User;
use App\Models\Category;
use App\Models\GameList;

use App\Models\ApiConfig;
use App\Models\GameTypes;
use Illuminate\Support\Str;
use App\Models\GameCategory;
use Illuminate\Http\Request;
use App\Models\GamePlatforms;
use App\Rules\MatchOldPassword;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http; // Add this import

class GameApiController extends Controller
{

    protected $apiUrl;
    protected $apiKey;
    protected $apiId;

    public function __construct(Request $request)
    {
        // Fetch configuration from the database
        $apiConfig = ApiConfig::find(1); // You can pass 'AG' dynamically if needed
        if ($apiConfig) {
            $this->apiUrl   = $apiConfig->api_url;
            $this->apiKey   = $apiConfig->api_key;
            $this->apiId    = $apiConfig->app_id;
        } else {
            throw new \Exception('API configuration not found.');
        }
    }

    // Generate a unique trace ID for each request
    function generateTraceId()
    {
        return uniqid('trace_', true); // Generates a unique ID
    }

    public function gameList(Request $request)
    {

        $traceId = $this->generateTraceId();
        // Prepare the request body as JSON
        $requestBody = json_encode([
            "appid" => $this->apiId,
        ]);
        // Create the signature string
        $signatureKey = $this->apiKey;
        $md5String    = "trace_id={$traceId}{$requestBody}{$signatureKey}";
        $signature    = md5($md5String);

        // Initialize cURL session
        $ch = curl_init();
        // Set cURL options
        curl_setopt($ch, CURLOPT_URL, "{$this->apiUrl}?trace_id={$traceId}");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Content-Type: application/json;charset=UTF-8",
            "sign: {$signature}"
        ]);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $requestBody);

        // Execute the cURL request
        $response = curl_exec($ch);

        // Check for errors
        if (curl_errno($ch)) {
            echo 'Curl error: ' . curl_error($ch);
        } else {
            // Decode the JSON response
            $responseData = json_decode($response, true);
            // Check if the response indicates success
            $response = [];
            if ($responseData['code'] === 0) {
                $response['status'] = 'success';
                $response['games'] = [];

                // GameList::truncate();
                foreach ($responseData['data']['glist'] as $game) {
                    $slug = Str::slug($game['name'] . '-' . $game['gameid']);

                    // Check if the game with the same gameid already exists
                    $existingGame = GameList::where('gameid', $game['gameid'])->first();

                    if ($existingGame) {
                        // Update the existing game
                        $existingGame->update([
                            'name'         => $game['name'] ?? $existingGame->name,
                            'images'       => "", // Adjust if you have image handling logic
                            'platform_id'  => $game['platform'] ?? $existingGame->platform_id,
                            'gametype_id'  => $game['gametype'] ?? $existingGame->gametype_id,
                            'status'       => $game['status'],
                            'slug'         => $slug,
                        ]);
                    } else {
                        // Insert a new game
                        GameList::create([
                            'gameid'       => $game['gameid'] ?? null,
                            'name'         => $game['name'] ?? null,
                            'images'       => "",
                            'platform_id'  => $game['platform'] ?? null,
                            'gametype_id'  => $game['gametype'] ?? null,
                            'status'       => $game['status'],
                            'slug'         => $slug,
                        ]);
                    }

                    // Add to response array
                    $response['games'][] = [
                        'gameid'     => $game['gameid'],
                        'name'       => $game['name'],
                        'images'     => 'No Images',
                        'platform'   => $game['platform'],
                        'gametype'   => $game['gametype'],
                        'status'     => $game['status'] == 1 ? 'Open' : 'Closed',
                    ];
                }
            } else {
                $response['status'] = 'error';
                $response['code'] = $responseData['code'];
                $response['msg'] = $responseData['msg'];
            }
            return response()->json($response);
        }
    }


    public function allGamesPltfrmData()
    {
        $result = GamePlatforms::where('status', 1)->get();
        return response()->json($result);
    }
}
