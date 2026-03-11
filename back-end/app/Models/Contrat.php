<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Contrat extends Model
{
    protected $table = "contrats";
    protected $fillable = [
        'reference',
        'targetAdherentId',
        'executedByUserId',
        'contratDate',
        'montant'
    ];
    public function adherent()
    {
        return $this->belongsTo(Adherent::class, "targetAdherentId");
    }

    public function user()
    {
        return $this->belongsTo(User::class, "executedByUserId");
    }
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($contrat) {
            $year = Carbon::now()->format('Y');
            $lastContrat = self::whereYear('created_at', $year)
                ->latest('id')
                ->first();
            $nextNumber = $lastContrat
                ? intval(substr($lastContrat->reference, 0, 4)) + 1
                : 1;

            $contrat->reference = str_pad($nextNumber, 4, '0', STR_PAD_LEFT) . '/' . $year;
        });
    }
}
