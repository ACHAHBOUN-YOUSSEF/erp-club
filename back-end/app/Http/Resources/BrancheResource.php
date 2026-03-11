<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BrancheResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'adresse' => $this->adresse,
            'phone' => $this->phone,
            'email' => $this->email,
            'ville' => $this->ville ? [
                'id' => $this->ville->id,
                'name' => $this->ville->name,
                'region'=>$this->ville->region,
                'codePostal'=>$this->ville->codePostal,
            ] : null,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
