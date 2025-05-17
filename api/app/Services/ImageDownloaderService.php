<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str; // To use the Str::uuid() helper
use Exception;

class ImageDownloaderService
{
    protected $client;

    public function __construct()
    {
        // Initialize Guzzle client for HTTP requests
        $this->client = new Client();
    }


    public function downloadAndSaveImage($imageUrl, $imageName)
    {
        try {
            $response = $this->client->get($imageUrl);

            if ($response->getStatusCode() === 200) {
                $uniqueImageName = Str::uuid() . '_' . $imageName; // Use UUID to ensure uniqueness

                // Set the absolute path for the new image location
                $imagePath = public_path('backend/files/' . $uniqueImageName); // Using public_path to get absolute path

                // Ensure the directory exists
                if (!file_exists(public_path('backend/files'))) {
                    mkdir(public_path('backend/files'), 0755, true); // Create directory if it doesn't exist
                }
                file_put_contents($imagePath, $response->getBody()->getContents());

                return 'backend/files/' . $uniqueImageName; // Return the saved relative image path
            } else {
                Log::error("Failed to download image from: $imageUrl with status code: " . $response->getStatusCode());
                return null;
            }
        } catch (Exception $e) {
            // Log any errors during the download
            Log::error("Error downloading image from: $imageUrl. Exception: " . $e->getMessage());
            return null;
        }
    }

    // public function downloadAndSaveImage($imageUrl, $imageName)
    // {
    //     try {
    //         $response = $this->client->get($imageUrl);

    //         if ($response->getStatusCode() === 200) {
    //             $uniqueImageName = Str::uuid() . '_' . $imageName; // Use UUID to ensure uniqueness
    //             $imagePath = 'gallery/' . $uniqueImageName;
    //             // Save the image in the 'public' disk (storage/app/public)
    //             Storage::disk('public')->put($imagePath, $response->getBody()->getContents());
    //             return $imagePath; // Return the saved unique image path
    //         } else {
    //             Log::error("Failed to download image from: $imageUrl with status code: " . $response->getStatusCode());
    //             return null;
    //         }
    //     } catch (Exception $e) {
    //         // Log any errors during the download
    //         Log::error("Error downloading image from: $imageUrl. Exception: " . $e->getMessage());
    //         return null;
    //     }
    // }
}
