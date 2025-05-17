<?php

namespace App\Http\Controllers\Affiliate;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Auth;
use Validator;
use Helper;
use App\Models\Holiday;
use App\Models\User;
use App\Models\Manufactures;
use App\Models\Brands;
use App\Models\Community;
use Illuminate\Support\Str;
use App\Rules\MatchOldPassword;
use Illuminate\Support\Facades\Hash;
use Session;
use DB;

class AffiliateController extends Controller
{
    protected $userid;
    public function __construct()
    {

        $id = auth('api')->user();

        $this->middleware('auth:api');
        $id = auth('api')->user();
        if (!empty($id->id)) {
            $user = User::find($id->id);
            $this->userid = $user->id;
        }
    }

    public function getLevelOneDetails(Request $request)
    {

        $userId           = $this->userid;
        $email            = $request->email;
        $frmDate          = $request->frmDate;
        $toDate           = $request->toDate;

        $query = User::where('ref_id', $userId)->select('id', 'ocn_id', 'ocn_address', 'name', 'email', 'created_at', 'ref_id');

        if ($email) {
            $query->where('email', 'like', '%' . $email . '%');
        }

        if ($frmDate && $toDate) {
            $query->whereBetween('created_at', [$frmDate, $toDate]);
        } elseif ($frmDate) {
            $query->where('created_at', '>=', $frmDate);
        } elseif ($toDate) {
            $query->where('created_at', '<=', $toDate);
        }

        $checkL1 = $query->get();
        return response()->json([
            'level_data'  => $checkL1,
            'teamCount'   => count($checkL1),
            'usdt'        => 15400,
        ]);
    }

    public function getLevelTwoDetails(Request $request)
    {
        $userId           = $this->userid;
        $email            = $request->email;
        $frmDate          = $request->frmDate;
        $toDate           = $request->toDate;

        $checkL1          = User::where('ref_id', $userId)->select('id', 'ocn_id', 'ocn_address', 'name', 'email', 'created_at', 'ref_id')->get();
        $level1_ids       = $checkL1->pluck('id')->toArray();

        $query            = User::whereIn('ref_id', $level1_ids)->select('id', 'ocn_id', 'ocn_address', 'name', 'email', 'created_at', 'ref_id');

        if ($email) {
            $query->where('email', 'like', '%' . $email . '%');
        }

        if ($frmDate && $toDate) {
            $query->whereBetween('created_at', [$frmDate, $toDate]);
        } elseif ($frmDate) {
            $query->where('created_at', '>=', $frmDate);
        } elseif ($toDate) {
            $query->where('created_at', '<=', $toDate);
        }

        $checkL1 = $query->get();
        return response()->json([
            'level_data'  => $checkL1,
            'teamCount'   => count($checkL1),
            'usdt'        => 15400,
        ]);
    }

    public function getLevelThreeDetails(Request $request)
    {
        $userId           = $this->userid;
        $email            = $request->email;
        $frmDate          = $request->frmDate;
        $toDate           = $request->toDate;

        $checkL1          = User::where('ref_id', $userId)->select('id', 'ocn_id', 'ocn_address', 'name', 'email', 'created_at', 'ref_id')->get();
        $level1_ids       = $checkL1->pluck('id')->toArray();

        $checkL2          = User::whereIn('ref_id', $level1_ids)->select('id', 'name', 'email', 'created_at', 'ref_id')->get();
        $level2_ids       = $checkL2->pluck('id')->toArray();
        $query            = User::whereIn('ref_id', $level2_ids)->select('id', 'ocn_id', 'ocn_address', 'name', 'email', 'created_at', 'ref_id');

        if ($email) {
            $query->where('email', 'like', '%' . $email . '%');
        }

        if ($frmDate && $toDate) {
            $query->whereBetween('created_at', [$frmDate, $toDate]);
        } elseif ($frmDate) {
            $query->where('created_at', '>=', $frmDate);
        } elseif ($toDate) {
            $query->where('created_at', '<=', $toDate);
        }

        $checkL1 = $query->get();
        return response()->json([
            'level_data'  => $checkL1,
            'teamCount'   => count($checkL1),
            'usdt'        => 15400,
        ]);
    }

    public function getLevelthree(Request $request)
    {
        $userId           = $this->userid;
        $email            = $request->email;
        $frmDate          = $request->frmDate;
        $toDate           = $request->toDate;

        $checkL1          = User::where('ref_id', $userId)->select('id', 'ocn_id', 'ocn_address', 'name', 'email', 'created_at', 'ref_id')->get();
        $level1_ids       = $checkL1->pluck('id')->toArray();

        $checkL2          = User::whereIn('ref_id', $level1_ids)->select('id', 'name', 'email', 'created_at', 'ref_id')->get();
        $level2_ids       = $checkL2->pluck('id')->toArray();

        $checkL3          = User::whereIn('ref_id', $level2_ids)->select('id', 'name', 'email', 'created_at', 'ref_id')->get();
        $level3_ids       = $checkL3->pluck('id')->toArray();

        $combinedUsers = User::select('id', 'ocn_id', 'ocn_address', 'name', 'email', 'created_at', 'ref_id')
            ->where('ref_id', $userId)
            ->orWhereIn('ref_id', $level1_ids)
            ->orWhereIn('ref_id', $level2_ids)
            ->get();

        $query            = User::select('id', 'ocn_id', 'ocn_address', 'name', 'email', 'created_at', 'ref_id')
            ->where('ref_id', $userId)
            ->orWhereIn('ref_id', $level1_ids)
            ->orWhereIn('ref_id', $level2_ids);

        if ($email) {
            $query->where('email', 'like', '%' . $email . '%');
        }

        if ($frmDate && $toDate) {
            $query->whereBetween('created_at', [$frmDate, $toDate]);
        } elseif ($frmDate) {
            $query->where('created_at', '>=', $frmDate);
        } elseif ($toDate) {
            $query->where('created_at', '<=', $toDate);
        }

        $checkL1 = $query->get();
        return response()->json([
            'level_data'  => $checkL1,
            'teamCount'   => count($checkL1),
            'usdt'        => 15400,
        ]);
    }
}
