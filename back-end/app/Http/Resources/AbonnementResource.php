<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AbonnementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "title" => $this->title,
            "price" => $this->price,
            "durationMonths" => $this->durationMonths,
            "isArchived" => $this->isArchived,
            "groupe" => $this->groupe ? [
                "id" => $this->groupe->id,
                "name" => $this->groupe->name
            ] : null,
        ];
    }
}
