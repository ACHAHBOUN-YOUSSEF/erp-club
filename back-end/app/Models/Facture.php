<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Facture extends Model
{
    use HasFactory;
    protected $table = "factures";
    protected $fillable = [
        'reference',
        'targetAdherentId ',
        'executedByUserId',
        'factureDate',
        'montant'
    ];

    // Relation avec l’adhérent
    public function adherent()
    {
        return $this->belongsTo(Adherent::class,"targetAdherentId");
    }

    // Relation avec le staff
    public function user()
    {
        return $this->belongsTo(User::class,"executedByUserId");
    }
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($facture) {
            $year = Carbon::now()->format('Y');
            $lastFacture = self::whereYear('created_at', $year)->latest('id')->first();
            $nextNumber = $lastFacture ? intval(substr($lastFacture->reference, 0, 4)) + 1 : 1;
            $facture->reference = str_pad($nextNumber, 4, '0', STR_PAD_LEFT) . '/' . $year;
        });
    }
}
