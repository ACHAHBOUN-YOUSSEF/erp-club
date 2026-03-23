<?php

namespace App\Http\Controllers\Adherents\Subscriptions;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\SubscriptionResource;
use App\Models\Abonnement;
use App\Models\Adherent;
use App\Models\AdherentLog;
use App\Models\Subscription;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SubscriptionsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                "abonnementId" => ["required", "integer", "exists:abonnements,id"],
                "adherentId" => ["required", "integer", "exists:adherents,id"],
                "remainingAmount" => ["nullable", "numeric", "min:0"],
                "montant" => ["nullable", "numeric", "min:0"],
                "startDate" => ["nullable", "date", "after_or_equal:today"],
                "paymentDate" => ["nullable", "date"],
                "modePaiement" => [
                    "nullable",
                    "string",
                    "max:50",
                    function ($attribute, $value, $fail) use ($request) {
                        if ((!is_null($request->montant) || !is_null($request->remainingAmount)) && empty($value)) {
                            $fail("Le mode de paiement est obligatoire si un montant est saisi");
                        }
                    }
                ],
            ], [
                // Abonnement
                "abonnementId.required" => "Veuillez sélectionner un abonnement",
                "abonnementId.integer" => "L'abonnement doit être un nombre valide",
                "abonnementId.exists" => "L'abonnement sélectionné n'existe pas",

                // Adhérent
                "adherentId.required" => "Veuillez sélectionner un adhérent",
                "adherentId.integer" => "L'adhérent doit être un nombre valide",
                "adherentId.exists" => "L'adhérent sélectionné n'existe pas",

                // Montants
                "remainingAmount.numeric" => "Le montant restant doit être un nombre valide",
                "remainingAmount.min" => "Le montant restant ne peut pas être négatif",
                "montant.numeric" => "Le montant doit être un nombre valide",
                "montant.min" => "Le montant ne peut pas être négatif",

                // Dates
                "startDate.date" => "La date de début doit être une date valide",
                "startDate.after_or_equal" => "La date de début doit être aujourd'hui ou ultérieure",
                "paymentDate.date" => "La date de paiement doit être une date valide",

                // Mode paiement
                "modePaiement.string" => "Le mode de paiement doit être une chaîne valide",
                "modePaiement.max" => "Le mode de paiement ne peut pas dépasser 50 caractères",
            ]);

            $abonnement = Abonnement::findOrFail($validated['abonnementId']);
            $adherent = Adherent::findOrFail($validated['adherentId']);
            try {
                DB::beginTransaction();
                $abonnement = Abonnement::findOrFail($validated['abonnementId']);
                $adherent = Adherent::findOrFail($validated['adherentId']);
                $startDate = $validated['startDate'] ? \Carbon\Carbon::parse($validated['startDate']) : now();
                $subscriptionData = [
                    "startDate" => $startDate->format('Y-m-d'),
                    "endDate" => $startDate->copy()->addMonths($abonnement->durationMonths)->format('Y-m-d'),
                    "paymentDate" => $validated['paymentDate'] ?? now()->format('Y-m-d'),
                    "remainingAmount" => $request->noRemainingAmount ? 0 : ($validated['remainingAmount'] ?? 0),
                ];
                $adherent->abonnements()->attach($abonnement->id, $subscriptionData);
                $subscription = Subscription::where('adherentId', $adherent->id)
                    ->where('abonnementId', $abonnement->id)
                    ->where('startDate', $subscriptionData['startDate'])
                    ->orderBy('created_at', 'desc')
                    ->first();
                AdherentLog::create([
                    "action" => "Nouveau subscription",
                    "executedByUserId" => $request->user()->id,
                    "targetAdherentId" => $adherent->id,
                    'description' => "Ajout d'une nouvelle souscription avec l'abonnement « " . $abonnement->title . " »",
                ]);
                if ($request->filled('montant')) {
                    $amount = (float) $request->montant;
                    if ($amount >= 0) {
                        $description = "Nouvelle souscription enregistrée ! Paiement reçu : {$request->montant} DH. Reste à payer : {$request->remainingAmount} DH. Continuez vos efforts !";
                        Transaction::create([
                            "type" => "income",
                            "montant" => $request->montant,
                            "transactionDate" => Carbon::now()->format('Y-m-d H:i'),
                            "description" => $description,
                            "executedByUserId" => $request->user()->id,
                            "targetAdherentId" => $subscription->adherentId,
                            "brancheId" => $request->user()->brancheId,
                            "modePaiement" => $request->modePaiement,
                            "subscriptionsId" => $subscription->id
                        ]);
                    }
                }
                DB::commit();
                return ApiResponse::success(
                    new SubscriptionResource($subscription),
                    "Abonnement ajouté avec succès"
                );
            } catch (\Exception  $e) {
                DB::rollBack();
                return ApiResponse::error('Erreur serveur : ' . $e->getMessage(), 500);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return ApiResponse::error('Erreur de validation', 422, $e->errors());
        } catch (\Exception $e) {
            if (DB::transactionLevel() > 0) {
                DB::rollBack();
            }
            return ApiResponse::error('Erreur serveur : ' . $e->getMessage(), 500);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $subscription = Subscription::find($id);
            if (!$subscription) {
                return ApiResponse::error("Subscription non trouvé", 404);
            }
            return ApiResponse::success(new SubscriptionResource($subscription), "Détails des informations sur la subscription");
        } catch (\Exception $e) {
            return ApiResponse::error('Erreur serveur: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $request->validate([
                "NewRemainingAmount" => ["nullable", "numeric", "min:0"],
                "montant" => ["nullable", "numeric", "min:0"],
                "startDate" => ["required", "date"],
                "endDate" => ["required", "date", "after_or_equal:startDate"],
                "modePaiement" => [
                    "nullable",
                    "string",
                    "max:50",
                    "required_with:montant"
                ],

            ], [

                // Montants
                "NewRemainingAmount.numeric" => "Le montant restant doit être un nombre valide",
                "NewRemainingAmount.min" => "Le montant restant ne peut pas être négatif",

                "montant.numeric" => "Le montant doit être un nombre valide",
                "montant.min" => "Le montant ne peut pas être négatif",

                // Dates
                "startDate.required" => "La date de début est obligatoire",
                "startDate.date" => "La date de début doit être une date valide",

                "endDate.required" => "La date de fin est obligatoire",
                "endDate.date" => "La date de fin doit être une date valide",
                "endDate.after_or_equal" => "La date de fin doit être supérieure ou égale à la date de début",

                // Mode paiement
                "modePaiement.required_with" => "Le mode de paiement est obligatoire si un montant est saisi",
                "modePaiement.string" => "Le mode de paiement doit être une chaîne valide",
                "modePaiement.max" => "Le mode de paiement ne peut pas dépasser 50 caractères",

            ]);
            $subscription = Subscription::findOrFail($id);

            /* 1️⃣ On remplit les champs */
            $subscription->startDate = $request->startDate;
            $subscription->endDate = $request->endDate;
            if ($request->noRemainingAmount) {
                $subscription->remainingAmount = 0;
            } else {
                if ($request->filled('NewRemainingAmount')) {
                    $newReste = (float) $request->NewRemainingAmount;
                    if ($newReste >= 0) {
                        $subscription->remainingAmount = $newReste;
                    }
                }
            }

            /* 2️⃣ On récupère original + dirty AVANT save */
            $original = $subscription->getOriginal();
            $dirtyFields = $subscription->getDirty();

            /* 3️⃣ On sauvegarde */
            $subscription->save();

            /* 4️⃣ On crée les logs */
            $abonnement = Abonnement::findOrFail($subscription->abonnementId);

            foreach ($dirtyFields as $champ => $newValue) {

                $oldValue = $original[$champ] ?? null;

                if ($oldValue instanceof \DateTimeInterface) {
                    $oldValue = $oldValue->format('Y-m-d H:i:s');
                }

                if ($newValue instanceof \DateTimeInterface) {
                    $newValue = $newValue->format('Y-m-d H:i:s');
                }

                $champLisible = preg_replace('/(?<!^)[A-Z]/', ' $0', $champ);
                $champLisible = ucfirst($champLisible);

                AdherentLog::create([
                    'targetAdherentId' => $subscription->adherentId,
                    'action' => 'Modification subscription',
                    'fieldName' => $champLisible,
                    'oldValue' => $oldValue,
                    'newValue' => $newValue,
                    'executedByUserId' => $request->user()->id,
                    'description' => "Modification sur $champLisible pour l'abonnement « "
                        . $abonnement->title . " »",
                ]);
            }
            if ($request->filled('montant')) {
                $amount = (float) $request->montant;
                if ($amount >= 0) {
                    $description = "Paiement mis à jour : {$request->montant} DH ajoutés. Restez motivé et dépassez vos limites !";
                    Transaction::create([
                        "type" => "income",
                        "montant" => $request->montant,
                        "transactionDate" => Carbon::now()->format('Y-m-d H:i'),
                        "description" => $description,
                        "executedByUserId" => $request->user()->id,
                        "targetAdherentId" => $subscription->adherentId,
                        "brancheId" => $request->user()->brancheId,
                        "modePaiement" => $request->modePaiement,
                        "subscriptionsId" => $subscription->id
                    ]);
                }
            }
            $subscription->save();

            return ApiResponse::success(
                new SubscriptionResource($subscription),
                "Abonnement mis à jour avec succès"
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return ApiResponse::error('Erreur de validation', 422, $e->errors());
        } catch (\Exception $e) {
            return ApiResponse::error('Erreur serveur : ' . $e->getMessage(), 200);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        try {
            $subscription = Subscription::findOrFail($id);
            $abonnement = Abonnement::findOrFail($subscription->abonnementId);
            if (!$subscription) {
                return ApiResponse::error("Impossible de supprimer cette subscription : elle n’existe pas", 404);
            }
            $subscription->delete();
            AdherentLog::create([
                "action" => "Suppression subscription",
                "executedByUserId" => $request->user()->id,
                "targetAdherentId" => $subscription->adherentId,
                'description' => "Suppression de la souscription pour l'abonnement « " . $abonnement->title . " »",
            ]);
            return ApiResponse::success(null, 'Subscription supprimé avec succès');
        } catch (\Exception $e) {
            return ApiResponse::error('Erreur serveur: ' . $e->getMessage(), 500);
        }
    }
}
