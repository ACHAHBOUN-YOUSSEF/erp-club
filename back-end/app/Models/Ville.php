<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ville extends Model
{
     protected $fillable = ["name","region","codePostal"];
    public function branches(){
        return $this->hasMany(Branche::class);
    }
}
