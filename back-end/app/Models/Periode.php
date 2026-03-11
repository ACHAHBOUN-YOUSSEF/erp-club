<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Periode extends Model
{
    protected $table = "periodes";
    protected $fillable = ["durationDays", "price", "remainingAmount", "startDate", "endDate", "adherentId"];
    protected $casts = [
        'remainingAmount' => 'decimal:2',
    ];
    public function adherent()
    {
        return $this->belongsTo(Adherent::class, "adherentId");
    }
}
