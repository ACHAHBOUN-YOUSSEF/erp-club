<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Abonnement extends Model
{
    protected $table = 'abonnements';
    protected $fillable = ['title', 'durationMonths', 'price', 'isArchived', 'groupeId'];
    public function groupe()
    {
        return $this->belongsTo(GroupeAbonnement::class, "groupeId");
    }
    public function subscriptions()
    {
        return $this->hasMany(Subscription::class, "abonnementId");
    }
    public function adherents()
    {
        return  $this->belongsToMany(Adherent::class, "subscriptions", "adherentId", "abonnementId")
            ->withPivot("startDate", "endDate", "remainingAmount", "paymentDate")
            ->withTimestamps();
    }
}
