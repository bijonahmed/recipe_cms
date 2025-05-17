<?php

namespace App\Imports;

use App\Models\BulkAddress;
use Maatwebsite\Excel\Concerns\ToModel;

class BulkAddressImport implements ToModel
{
    private $merchant_id;

    public function __construct($merchant_id)
    {
        $this->merchant_id = $merchant_id;
    }

    public function model(array $row)
    {

         
      // Ensure that the row is correctly formatted
    if (!is_array($row) || count($row) < 3) {
        return null; // Skip invalid rows
    }

    // Extract walletAddress from the row
    $chkwalletAddress = $row[1]; // Assuming column 1 is walletAddress

    // Check if walletAddress already exists in the database
    $chk = BulkAddress::where('walletAddress', $chkwalletAddress)->first();

    // If wallet address already exists, return an error with a 422 status code
    if ($chk) {
        return response()->json([
            'error' => 'Duplicate wallet address.',
        ], 422); // 422 Unprocessable Entity
    }


        return new BulkAddress([
            'merchant_id'   => $row[0], //$this->merchant_id,  // Set merchant_id from controller
            'walletAddress' => $row[1], // Assuming column 1 is walletAddress
            'status'        => $row[2], // Assuming column 2 is status
            'entry_by'      => $this->merchant_id
        ]);
    }
}
