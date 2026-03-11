<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Branche extends Model
{
    protected $fillable = ["name", "adresse", "phone", "email", "villeId"];
    public function ville()
    {
        return $this->belongsTo(Ville::class, "villeId");
    }
    public function users()
    {
        return $this->hasMany(User::class);
    }
    public function groupeAbonnements()
    {
        return $this->hasMany(GroupeAbonnement::class);
    }
}
