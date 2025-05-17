<?php

namespace App\Http\Controllers\Balance;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Trading\TradingController;
use App\Models\BuyToken;
use App\Models\Community;
use App\Models\Deposit;
use App\Models\ExpenseHistory;
use App\Models\ManualAdjustment;
use App\Models\ManualAdjustmentDelete;
use App\Models\MiningServicesBuyHistory;
use App\Models\MystoreHistory;
use App\Models\Order;
use Illuminate\Http\Request;
use Auth;
use Validator;
use Helper;
use App\Models\User;
use App\Models\Profile;
use App\Models\RuleModel;
use App\Models\SendReceived;
use App\Models\TransactionHistory;
use App\Models\WalletAddress;
use App\Models\kyc;
use App\Models\LoanPayHistory;
use App\Models\MiningBalanceSum;
use App\Models\Notification;
use App\Models\Setting;
use App\Models\SwapHistory;
use App\Models\Trade;
use App\Models\UserBotHistory;
use App\Models\UserMiningHistory;
use App\Models\UserPaymentAddress;
use App\Models\Withdraw;
use Illuminate\Support\Str;
use App\Rules\MatchOldPassword;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use DB;
use File;
use PhpParser\Node\Stmt\TryCatch;
use function Ramsey\Uuid\v1;
use Illuminate\Http\JsonResponse;
use PDO;

class BalanceController extends Controller
{
    protected $frontend_url;
    protected $userid;
    protected $email;
    public function __construct(Request $request)
    {
        $this->middleware('auth:api');
        $id = auth('api')->user();
        if (!empty($id)) {
            $user = User::find($id->id);
            $this->userid = $user->id;
            $this->email = $user->email;
        }
    }
 

    public function getBalance()
    {
        //For Users
        $setting                       = Setting::find(1)->first();
        $today_date                    = date("Y-m-d");
        $active_matching               = MiningServicesBuyHistory::where('user_id', $this->userid)->get();

        $chkloanAmt  = LoanPayHistory::where('type', 1)->where('user_id', $this->userid)->where('status', 0)->sum('amount');
        $loanAmount = abs($chkloanAmt);

        $s_price = 0;
        foreach ($active_matching as $matching) {
            if ($matching->end_date >= $today_date) {
                $s_price += !empty($matching->service_price) ? $matching->service_price : 0;
            }
        }
        $mining_packages_fee           = $s_price;
        
        $row                           = User::find($this->userid);
        $deposit                       = Deposit::where('user_id', $this->userid)->where('status', 1)->sum('deposit_amount');
        $bot_bost                      = UserBotHistory::where('user_id', $this->userid)->sum('level_cost');
        $mining_bost                   = UserMiningHistory::where('user_id', $this->userid)->sum('level_cost');
        $trading                       = Trade::where('user_id', $this->userid)->where('status', 0)->sum('tradeAmount');
        $tradingComplete               = Trade::where('user_id', $this->userid)->where('status', 1)->sum('return_amount');
        $buyToken                      = BuyToken::where('user_id', $this->userid)->sum('usdt_amount'); 
        $withdrawal                    = Withdraw::where('user_id', $this->userid)->sum('receivable_amount'); ; 

        $usdt_balance                  = $deposit - $mining_packages_fee - $bot_bost - $mining_bost - $trading - $buyToken - $withdrawal + $tradingComplete + $loanAmount;
        //ocn wallet 
        $miningBalanceSum              = MiningBalanceSum::where('user_id', $this->userid)
                                         ->whereNotNull('ocn_balance')
                                         ->sum('ocn_balance');

        $tokenBalance                  = BuyToken::where('user_id', $this->userid)
                                         ->sum('get_token');
        $ocn_balance                   = $miningBalanceSum  + $tokenBalance;
        //dd($miningBalanceSum);


        $data['available_balance']     = !empty($row->available_balance) ? $row->available_balance : 0;
        $data['usdt_amount']           = number_format($usdt_balance, 2); //USDT Amount formatted
        $data['usdtamount']            = $usdt_balance; //USDT Amount

        $data['ocn_token']             = $ocn_balance; //OCN Token formatted
        $data['ocntoken']              = $ocn_balance; //OCN Token
     
        return response()->json($data);
    }


    
    public function getBalances($userid)
    {
        //For Admin
        $user_id = $userid;
        $row                    = User::find($user_id);
        $deposit                = Deposit::where('user_id', $user_id)->where('status', 1)->sum('deposit_amount');
        $withdraw_usdt          = Withdraw::where('user_id', $user_id)->where('status', 1)->sum('usd_amount');
        $withdraw_uic           = Withdraw::where('user_id', $user_id)->where('status', 1)->sum('uic_amount');
        $reciv_usdt_amount      = SendReceived::where('receiver_user_id', $user_id)->where('wallet_type', 2)->sum('amount');
        $usdtAmount             = SendReceived::where('user_id', $user_id)->where('wallet_type', 2)->sum('amount');

        $row                    = User::where('id', $user_id)->first();
        $setting                = Setting::find(1)->first();
        $mining_amount          = User::where('status', 1)->sum('mining_amount');

        $circulatingSupply      = User::where('status', 1)->sum('mining_amount');
        $beganing_price         = $setting->beganing_price;
        $register_bonus         = $setting->register_bonus;
        $marketCap              = $setting->liquidity_total_supply * $beganing_price;

        $data['available_balance']        = !empty($row->available_balance) ? $row->available_balance : 0;
        return response()->json($data);
    }
     

}
