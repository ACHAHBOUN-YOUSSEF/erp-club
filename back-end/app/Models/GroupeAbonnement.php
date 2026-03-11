<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GroupeAbonnement extends Model
{
    protected $table = 'groupe_abonnements';
    protected $fillable = ['name','type','description','isArchived','brancheId'];
    public function branche() {
        return $this->belongsTo(Branche::class,"brancheId");
    }
    public function abonnements(){
        return $this->hasMany(Abonnement::class,"groupeId");
    }
}
