<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdherentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "cin" => $this->cin,
            "firstName" => $this->firstName,
            "lastName" => $this->lastName,
            "birthDate" => $this->birthDate,
            "phonePrimary" => $this->phonePrimary,
            "phoneSecondary" => $this->phoneSecondary,
            "gender" => $this->gender,
            "adresse" => $this->adresse,
            "email" => $this->email,
            "registrationDate" => $this->registrationDate,
            "insuranceEndDate" => $this->insuranceEndDate,
            "insuranceRemainingAmount" => $this->insuranceRemainingAmount,
            "profession" => $this->profession,
            "imagePath" => $this->imagePath,
            "brancheId" => $this->brancheId,
            "resteJoursAssurance" => $this->resteJoursAssurance,
            "addedBy" => $this->addedBy ? (($this->addedBy?->firstName . ' ' . $this->addedBy?->lastName)) : $this->added_by,
            "club" => $this->whenLoaded("branche"),
            "subscriptions" => $this->subscriptions
                ? $this->subscriptions->map(function ($sub) {

                    $today = now()->startOfDay();
                    $startDate = \Carbon\Carbon::parse($sub->startDate)->startOfDay();
                    $endDate = \Carbon\Carbon::parse($sub->endDate)->startOfDay();

                    if ($endDate->lt($today)) {
                        $resteJours = 0;
                    } else {
                        $baseDate = $startDate->gte($today) ? $startDate : $today;
                        $resteJours = $baseDate->diffInDays($endDate);
                    }

                    return [
                        "id" => $sub->id,
                        "startDate" => $sub->startDate,
                        "endDate" => $sub->endDate,
                        "remainingAmount" => $sub->remainingAmount,
                        "title" => $sub->abonnement?->title,
                        "price" => $sub->abonnement?->price,
                        "groupe" => $sub->abonnement?->groupe?->name,
                        "resteJours" => $resteJours,
                        "abonnementId" => $sub->abonnement->id
                    ];
                })
                : [],
            "logs" => $this->logs ? $this->logs->map(function ($log) {
                return [
                    "id" => $log->id,
                    "action" => $log->action,
                    "fieldName" => $log->fieldName,
                    "oldValue" => $log->oldValue,
                    "newValue" => $log->newValue,
                    "description" => $log->description,
                    "executedByUser" => ($log->user->roles->first()?->name ? strtoupper($log->user->roles->first()->name) : 'ROLE INCONNU')
                        . " "
                        . ($log->user->firstName ?? '')
                        . " "
                        . ($log->user->lastName ?? ''),
                    "created_at" => $log->created_at,
                    "updated_at" => $log->updated_at
                ];
            }) : [],
            "periodes" => $this->periodes ? $this->periodes->map(function ($periode) {
                $today = now()->startOfDay();
                $startDate = \Carbon\Carbon::parse($periode->startDate)->startOfDay();
                $endDate = \Carbon\Carbon::parse($periode->endDate)->startOfDay();

                if ($endDate->lt($today)) {
                    $resteJours = 0;
                } else {
                    $baseDate = $startDate->gte($today) ? $startDate : $today;
                    $resteJours = $baseDate->diffInDays($endDate);
                }

                return [
                    "id" => $periode->id,
                    "durationDays" => $periode->durationDays,
                    "price" => $periode->price,
                    "remainingAmount" => $periode->remainingAmount,
                    "startDate" => $periode->startDate,
                    "endDate" => $periode->endDate,
                    "adherentId" => $periode->adherentId,
                    "resteJours" => $resteJours
                ];
            }) : [],
            "transactions" => $this->transactions ? $this->transactions->map(function ($transaction) {
                return [
                    "id" => $transaction->id,
                    "type" => $transaction->type,
                    "montant" => $transaction->montant,
                    "description" => $transaction->description,
                    "modePaiement" => $transaction->modePaiement,
                    "transactionDate" => $transaction->transactionDate,
                    "adherent" => $transaction->adherent->firstName . " " . $transaction->adherent->lastName,
                    "executedByUser" => strtoupper($transaction->user->roles->first()->name) . " " . $transaction->user->firstName . " " . $transaction->user->lastName,
                    "created_at" => $transaction->created_at,
                    "updated_at" => $transaction->updated_at,

                ];
            }) : [],
            "pagination" => $this->pagination
        ];
    }
}
