<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
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
            "type" => $this->type,
            "montant" => $this->montant,
            "modePaiement" => $this->modePaiement,
            "description" => $this->description,
            "transactionDate" => $this->transactionDate,
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at,
            "periodeId" => $this->periodeId,
            "subscriptionsId" => $this->subscriptionsId,
            "adherent" => $this->adherent->firstName . " " . $this->adherent->lastName,
            "adherentId" => $this->adherent->id,
            "executedByUser" => $this->user->firstName . " " . $this->user->lastName,
        ];
    }
}
