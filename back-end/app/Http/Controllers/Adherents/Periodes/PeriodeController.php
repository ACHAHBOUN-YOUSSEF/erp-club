<?php

namespace App\Http\Controllers\Adherents\Periodes;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\PeriodeResource;
use App\Models\Adherent;
use App\Models\AdherentLog;
use App\Models\Periode;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class PeriodeController extends Controller
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
                "adherentId" => ["required", "integer", "exists:adherents,id"],
                "remainingAmount" => ["nullable", "numeric", "min:0"],
                "montant" => ["nullable", "numeric", "min:0"],
                // "NewRemainingAmount" => ["nullable", "numeric", "min:0"],
                "price" => ["required", "numeric", "min:1"],
                "durationDays" => ["required", "numeric", "min:1"],
                "startDate" => ["required", "date"],
                "endDate" => ["required", "date", "after_or_equal:startDate"],
                "modePaiement" => [
                    "nullable",
                    "string",
                    "max:50",
                    function ($attribute, $value, $fail) use ($request) {
                        if ((!is_null($request->montant) || !is_null($request->remainingAmount)) && empty($value)) {
                            $fail("Le mode de paiement est obligatoire si un montant est saisi.");
                        }
                    }
                ],
            ], [

                // adherent
                "adherentId.required" => "L'adhérent est obligatoire.",
                "adherentId.integer" => "L'identifiant de l'adhérent doit être un nombre.",
                "adherentId.exists" => "L'adhérent sélectionné n'existe pas.",

                // montant
                "montant.numeric" => "Le montant doit être un nombre.",
                "montant.min" => "Le montant doit être supérieur ou égal à 0.",

                // remaining
                "remainingAmount.numeric" => "Le montant restant doit être un nombre.",
                "remainingAmount.min" => "Le montant restant doit être supérieur ou égal à 0.",

                // "NewRemainingAmount.numeric" => "Le nouveau montant restant doit être un nombre.",
                // "NewRemainingAmount.min" => "Le nouveau montant restant doit être supérieur ou égal à 0.",

                // price
                "price.required" => "Le prix est obligatoire.",
                "price.numeric" => "Le prix doit être un nombre.",
                "price.min" => "Le prix doit être supérieur à 0.",

                // duration
                "durationDays.required" => "La durée est obligatoire.",
                "durationDays.numeric" => "La durée doit être un nombre.",
                "durationDays.min" => "La durée doit être au moins de 1 jour.",

                // dates
                "startDate.required" => "La date de début est obligatoire.",
                "startDate.date" => "La date de début doit être une date valide.",

                "endDate.required" => "La date de fin est obligatoire.",
                "endDate.date" => "La date de fin doit être une date valide.",
                "endDate.after_or_equal" => "La date de fin doit être supérieure ou égale à la date de début.",

                // mode paiement
                "modePaiement.string" => "Le mode de paiement doit être un texte.",
                "modePaiement.max" => "Le mode de paiement ne doit pas dépasser 50 caractères.",

            ]);
            try {
                DB::beginTransaction();
                $adherent = Adherent::findOrFail($validated['adherentId']);
                $periode = Periode::create([
                    "startDate" => $validated['startDate'],
                    "endDate" => $validated['endDate'],
                    "price" => $validated['price'],
                    "remainingAmount" => $validated['remainingAmount'],
                    "adherentId" => $validated['adherentId'],
                    "durationDays" => $validated['durationDays']
                ]);
                AdherentLog::create([
                    "action" => "Nouveau periode",
                    "executedByUserId" => $request->user()->id,
                    "targetAdherentId" => $adherent->id,
                    'description' => "Ajout d'une nouvelle periode avec la durée de « " . $periode->durationDays . "Jours »",
                ]);
                if ($request->filled('montant')) {
                    $amount = (float) $request->montant;
                    if ($amount >= 0) {
                        $description = "Nouvelle periode enregistrée ! Paiement reçu : {$request->montant} DH. Reste à payer : {$request->remainingAmount} DH. Continuez vos efforts !";
                        $transaction = Transaction::create([
                            "type" => "income",
                            "montant" => $request->montant,
                            "transactionDate" => Carbon::now()->format('Y-m-d H:i'),
                            "description" => $description,
                            "executedByUserId" => $request->user()->id,
                            "targetAdherentId" => $validated['adherentId'],
                            "brancheId" => $request->user()->brancheId,
                            "modePaiement" => $request->modePaiement,
                            "periodeId" => $periode->id
                        ]);
                        Log::channel("transactions_logs")->info("T" . $transaction->id . "- Création d'une nouvelle transaction avec le montant  « " . $transaction->montant . " » via " . $request->user()->firstName . " " . $request->user()->lastName);
                    }
                }
                DB::commit();

                return ApiResponse::success(
                    new PeriodeResource($periode),
                    "periode ajouté avec succès"
                );
            } catch (\Exception  $e) {
                DB::rollBack();
                return ApiResponse::error('Erreur serveur : ' . $e->getMessage(), 500);
            }
        } catch (ValidationException $e) {
            return ApiResponse::error('Erreur de validation', 422, $e->errors());
        } catch (\Exception $e) {
            return ApiResponse::error('Erreur serveur: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {

        try {
            $periode = Periode::find($id);
            if (!$periode) {
                return ApiResponse::error("Periode non trouvé", 404);
            }
            return ApiResponse::success(new PeriodeResource($periode), "Détails des informations sur cette periode");
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
            $validated = $request->validate([
                "adherentId" => ["required", "integer", "exists:adherents,id"],
                "remainingAmount" => ["nullable", "numeric", "min:0"],
                "montant" => ["nullable", "numeric", "min:0"],
                "NewRemainingAmount" => ["nullable", "numeric", "min:0"],
                "price" => ["required", "numeric", "min:1"],
                "durationDays" => ["required", "numeric", "min:1"],
                "startDate" => ["required", "date"],
                "endDate" => ["required", "date", "after_or_equal:startDate"],
                "modePaiement" => [
                    "nullable",
                    "string",
                    "max:50",
                    function ($attribute, $value, $fail) use ($request) {
                        if ((!is_null($request->montant) || !is_null($request->remainingAmount)) && empty($value)) {
                            $fail("Le mode de paiement est obligatoire si un montant est saisi.");
                        }
                    }
                ],
            ], [

                // adherent
                "adherentId.required" => "L'adhérent est obligatoire.",
                "adherentId.integer" => "L'identifiant de l'adhérent doit être un nombre.",
                "adherentId.exists" => "L'adhérent sélectionné n'existe pas.",

                // montant
                "montant.numeric" => "Le montant doit être un nombre.",
                "montant.min" => "Le montant doit être supérieur ou égal à 0.",

                // remaining
                "remainingAmount.numeric" => "Le montant restant doit être un nombre.",
                "remainingAmount.min" => "Le montant restant doit être supérieur ou égal à 0.",

                "NewRemainingAmount.numeric" => "Le nouveau montant restant doit être un nombre.",
                "NewRemainingAmount.min" => "Le nouveau montant restant doit être supérieur ou égal à 0.",

                // price
                "price.required" => "Le prix est obligatoire.",
                "price.numeric" => "Le prix doit être un nombre.",
                "price.min" => "Le prix doit être supérieur à 0.",

                // duration
                "durationDays.required" => "La durée est obligatoire.",
                "durationDays.numeric" => "La durée doit être un nombre.",
                "durationDays.min" => "La durée doit être au moins de 1 jour.",

                // dates
                "startDate.required" => "La date de début est obligatoire.",
                "startDate.date" => "La date de début doit être une date valide.",

                "endDate.required" => "La date de fin est obligatoire.",
                "endDate.date" => "La date de fin doit être une date valide.",
                "endDate.after_or_equal" => "La date de fin doit être supérieure ou égale à la date de début.",

                // mode paiement
                "modePaiement.string" => "Le mode de paiement doit être un texte.",
                "modePaiement.max" => "Le mode de paiement ne doit pas dépasser 50 caractères.",

            ]);
            try {
                DB::beginTransaction();
                $adherent = Adherent::findOrFail($validated['adherentId']);
                $periode = Periode::find($id);
                $periode->startDate = $validated['startDate'];
                $periode->endDate = $validated['endDate'];
                $price = number_format((float)$validated['price'], 2, '.', '');
                if ((float)$periode->price !== (float)$price) {
                    $periode->price = $price;
                }
                $periode->durationDays = $validated['durationDays'];

                if ($request->filled('NewRemainingAmount')) {
                    $newReste = number_format((float)$request->NewRemainingAmount, 2, '.', '');
                    if ($newReste >= 0) {
                        $periode->remainingAmount = $newReste;
                    }
                }

                /* 2️⃣ On récupère original + dirty AVANT save */
                $original = $periode->getOriginal();
                $dirtyFields = $periode->getDirty();

                /* 3️⃣ On sauvegarde */
                $periode->save();
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
                        'targetAdherentId' => $periode->adherentId,
                        'action' => 'Modification Periode',
                        'fieldName' => $champLisible,
                        'oldValue' => $oldValue,
                        'newValue' => $newValue,
                        'executedByUserId' => $request->user()->id,
                        'description' => "Modification sur $champLisible pour la periode « " . $periode->durationDays . " Jours »",
                    ]);
                }
                if ($request->filled('montant')) {
                    $amount = (float) $request->montant;
                    if ($amount >= 0) {
                        $description = "Mise à jour du paiement réussie ! Paiement reçu : {$request->montant} DH. Reste à payer : {$request->remainingAmount} DH. Continuez vos efforts !";
                        $transaction = Transaction::create([
                            "type" => "income",
                            "montant" => $request->montant,
                            "transactionDate" => Carbon::now()->format('Y-m-d H:i'),
                            "description" => $description,
                            "executedByUserId" => $request->user()->id,
                            "targetAdherentId" => $validated['adherentId'],
                            "brancheId" => $request->user()->brancheId,
                            "modePaiement" => $request->modePaiement,
                            "periodeId" => $periode->id
                        ]);
                        Log::channel("transactions_logs")->info("T" . $transaction->id . "- Création d'une nouvelle transaction avec le montant  « " . $transaction->montant . " » via " . $request->user()->firstName . " " . $request->user()->lastName);
                    }
                }
                DB::commit();

                return ApiResponse::success(
                    new PeriodeResource($periode),
                    "Periode mis à jour avec succès"
                );
            } catch (\Exception  $e) {
                DB::rollBack();
                return ApiResponse::error('Erreur serveur : ' . $e->getMessage(), 500);
            }
        } catch (ValidationException $e) {
            return ApiResponse::error('Erreur de validation', 422, $e->errors());
        } catch (\Exception $e) {
            return ApiResponse::error('Erreur serveur: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $periode = Periode::find($id);
            if (!$periode) {
                return ApiResponse::error('Impossible de supprimer cette periode : elle n’existe pas.', 404);
            }
            $periode->delete();
            return ApiResponse::success(null, 'Periode supprimée avec succès');
        } catch (\Exception $e) {
            return ApiResponse::error('Erreur serveur: ' . $e->getMessage(), 500);
        }
    }
}
