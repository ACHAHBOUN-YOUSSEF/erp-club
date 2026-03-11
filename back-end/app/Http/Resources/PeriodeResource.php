<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PeriodeResource extends JsonResource
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
            "price"=>$this->price,
            "durationDays"=>$this->durationDays,
            "remainingAmount" => $this->remainingAmount,
            "adherentId" => $this->adherentId,
        ];
    }
}
