<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExpenseHistory extends Model
{
    use HasFactory;
   
    public $table = "expense_history";
    protected $fillable = ['user_id', 'business_type', 'operation_type','amount_type','operation_amount','charge_description','operation_date'];
    
}
