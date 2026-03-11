<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GroupeAbonnementResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "name" => $this->name,
            "type" => $this->type,
            "description" => $this->description,
            "isArchived" => $this->isArchived,
            "brancheId" => $this->brancheId,
            "club" => $this->branche ? [
                "id" => $this->branche->id,
                "name" => $this->branche->name
            ] : null,
            "abonnements" => $this->abonnements->map(function ($abonnement) {
                return [
                    "id" => $abonnement->id,
                    "title" => $abonnement->title,
                    "price" => (float) $abonnement->price,
                    "durationMonths" => $abonnement->durationMonths,
                    "isArchived"=>$abonnement->isArchived,
                ];
            }),
        ];
    }
}
