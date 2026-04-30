<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $table = "transactions";
    protected $fillable = ["type", "montant", "transactionDate", "description", "executedByUserId","executedByUser", "subscriptionsId","periodeId","targetAdherentId", "brancheId", "modePaiement"];
    public function user()
    {
        return $this->belongsTo(User::class, "executedByUserId");
    }
    public function adherent(){
        return $this->belongsTo(Adherent::class,"targetAdherentId");
    }
    public function scopeIncome($query)
    {
        return $query->where('type', 'income');
    }
    public function scopeExpense($query)
    {
        return $query->where('type', 'expense');
    }
    public function scopeOfDay($query, $date)
    {
        return $query->whereDate('transactionDate', $date);
    }
    public function scopeBetweenDates($query, $start, $end)
    {
        return $query->whereBetween('transactionDate', [$start, $end]);
    }
}
