<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Adherent extends Model
{
    use SoftDeletes;
    protected $table = "adherents";
    protected $fillable = ["cin", "firstName", "lastName", "birthDate", "phonePrimary", "phoneSecondary", "gender", "adresse", "email", "password", "registrationDate", "insuranceEndDate", "insuranceRemainingAmount", "profession", "addedByUserId", "imagePath", "brancheId", "added_by"];
    public function branche()
    {
        return $this->belongsTo(Branche::class, "brancheId");
    }
    public function addedBy()
    {
        return $this->belongsTo(User::class, "addedByUserId");
    }
    public function abonnements() {
        return $this->belongsToMany(Abonnement::class,"subscriptions","adherentId","abonnementId")
            ->withPivot("startDate", "endDate", "remainingAmount", "paymentDate")
        ->withTimestamps();
    }
    
}
