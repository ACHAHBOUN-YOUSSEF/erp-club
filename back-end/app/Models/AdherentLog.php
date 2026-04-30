<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdherentLog extends Model
{
    protected $table = "adherents_logs";
    protected $fillable = [
        'action',
        'fieldName',
        'oldValue',
        'newValue',
        'description',
        'executedByUserId',
        'executedByUser',
        'targetAdherentId',
    ];
    public function adherent()
    {
        return $this->belongsTo(Adherent::class, "targetAdherentId");
    }
    public function user()
    {
        return $this->belongsTo(User::class, "executedByUserId");
    }
}
