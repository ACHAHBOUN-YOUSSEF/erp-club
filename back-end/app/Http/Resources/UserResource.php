<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            "id"=>$this->id,
            "cin" => $this->cin,
            "firstName" => $this->firstName,
            "lastName" => $this->lastName,
            "gender" => $this->gender,
            "birthDate" => $this->birthDate,
            "phone" => $this->phone,
            "adresse" => $this->adresse,
            "email" => $this->email,
            "imagePath" => $this->image_url,
            "image_url"=>$this->imagePath,
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at,
            "brancheId"=>$this->brancheId,
            "club" => $this->branche ? [
                "id" => $this->branche->id,
                "name" => $this->branche->name,
                "ville" => $this->branche->ville ? [
                    "id" => $this->branche->ville->id,
                    "name" => $this->branche->ville->name,
                ] : null
            ] : null,
            "role"=>optional($this->roles->first())->name,
            "permissions"=>$this->getAllPermissions()->pluck('name'),

        ];
    }
}
