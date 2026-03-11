<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubscriptionResource extends JsonResource
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
            "startDate" => $this->startDate,
            "endDate" => $this->endDate,
            "remainingAmount"=>$this->remainingAmount,
            "paymentDate"=>$this->paymentDate,
            "adherentId"=>$this->adherentId,
            "abonnementId"=>$this->abonnementId,

        ];
    }
}
