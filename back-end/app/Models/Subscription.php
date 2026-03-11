<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    protected $table = "subscriptions";
    protected $fillable = ["startDate", "endDate", "remainingAmount", "paymentDate", "imagePath", "adherentId", "abonnementId"];
    public function adherent()
    {
        return $this->belongsTo(Adherent::class, "adherentId");
    }
    public function abonnement()
    {
        return $this->belongsTo(Abonnement::class, "abonnementId");
    }
}
