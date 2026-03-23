<?php

namespace App\Http\Controllers\Adherents;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\AdherentResource;
use App\Models\Adherent;
use App\Models\AdherentLog;
use App\Models\Periode;
use App\Models\Subscription;
use App\Models\Transaction;
use DateTime;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class IndexController extends Controller
{

    public function index(Request $request)
    {
        try {
            $adherents = Adherent::orderBy('id', 'desc')->paginate(15);
            if ($adherents->isEmpty()) {
                return ApiResponse::success([], 'Aucune adhérent trouvée');
            }
            $pagination = [
                'current_page' => $adherents->currentPage(),
                'last_page' => $adherents->lastPage(),
                'total' => $adherents->total(),
                'per_page' => $adherents->perPage(),
                'from' => $adherents->firstItem(),
                'to' => $adherents->lastItem(),
                'has_next' => $adherents->hasMorePages(),
                'has_prev' => $adherents->onFirstPage() === false,
            ];
            return response()->json([  // ✅ Bypass ApiResponse pour pagination
                'success' => true,
                'message' => 'Liste des adhérents',
                'data' => AdherentResource::collection($adherents),  // 15 adhérents
                'pagination' => $pagination,  // ✅ Meta séparée
                'timestamp' => now()->toISOString()
            ]);
        } catch (\Exception $e) {
            return ApiResponse::error('Erreur serveur: ' . $e->getMessage(), 200);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate(
                [
                    "cin" => ["nullable", "string", "max:20", Rule::unique('adherents', 'cin'), Rule::unique('users', 'cin')],
                    "firstName" => "required|string|max:100",
                    "lastName" => "required|string|max:100",
                    "birthDate" => "nullable|date|before:today",
                    "phonePrimary" => "required|string|max:20",
                    "phoneSecondary" => "nullable|string|max:20",
                    "gender" => "required|string",
                ],
                [
                    "cin.string" => "Le CIN doit être une chaîne de caractères.",
                    "cin.max" => "Le CIN ne doit pas dépasser 20 caractères.",
                    "cin.unique" => "Ce CIN est déjà utilisé.",
                    "firstName.required" => "Le prénom est obligatoire.",
                    "firstName.string" => "Le prénom doit être une chaîne de caractères.",
                    "firstName.max" => "Le prénom ne doit pas dépasser 100 caractères.",
                    "lastName.required" => "Le nom est obligatoire.",
                    "lastName.string" => "Le nom doit être une chaîne de caractères.",
                    "lastName.max" => "Le nom ne doit pas dépasser 100 caractères.",
                    "birthDate.date" => "La date de naissance doit être une date valide.",
                    "birthDate.before" => "La date de naissance doit être antérieure à aujourd'hui.",
                    "phonePrimary.required" => "Le téléphone principal est obligatoire.",
                    "phonePrimary.string" => "Le téléphone principal doit être une chaîne de caractères.",
                    "phonePrimary.max" => "Le téléphone principal ne doit pas dépasser 20 caractères.",
                    "phoneSecondary.string" => "Le téléphone secondaire doit être une chaîne de caractères.",
                    "phoneSecondary.max" => "Le téléphone secondaire ne doit pas dépasser 20 caractères.",
                    "gender.required" => "Le genre est obligatoire.",
                    "gender.string" => "Le genre doit être HOMME ou FEMME.",
                ]
            );
            $adherent = new Adherent();
            $adherent->cin = $validated['cin'] ? strtoupper($validated['cin']) : null;
            $adherent->firstName = strtoupper($validated['firstName']);
            $adherent->lastName = strtoupper($validated['lastName']);
            $adherent->birthDate = $validated['birthDate'];
            $adherent->phonePrimary = $validated['phonePrimary'];
            $adherent->phoneSecondary = $validated['phoneSecondary'] ?? null;
            $adherent->gender = $validated['gender'];
            $adherent->registrationDate = now()->format("Y-m-d");
            $adherent->insuranceEndDate = now()->addYear()->format("Y-m-d");
            $adherent->addedByUserId = $request->user()->id;
            $adherent->brancheId = $request->user()->brancheId;
            $adherent->save();
            $adherent->load("branche");
            $adherent->load("addedBy");
            // if ($request->hasFile('imagePath')) {
            //     $path = $request->file('imagePath')->store('users', 'public');
            //     $user->imagePath = $path;
            // }
            AdherentLog::create([
                "action" => "Nouvelle inscription",
                "executedByUserId" => $request->user()->id,
                "targetAdherentId" => $adherent->id,
                "description" => "Nouvel adhérent inscrit au club.",
            ]);
            return ApiResponse::success(new AdherentResource($adherent), "Adherent ajouté avec succès");
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
            $adherent = Adherent::with(['branche.ville', 'addedBy.roles'])->find($id);
            if (!$adherent) {
                return ApiResponse::error("Adherent non trouvé", 404);
            }
            if ($adherent->registrationDate && $adherent->insuranceEndDate) {
                $dateFin = new DateTime($adherent->insuranceEndDate);
                $aujourdhui = new DateTime();

                $intervalle = $dateFin->diff($aujourdhui);
                $resteJours = $intervalle->days;

                if ($dateFin < $aujourdhui) {
                    $resteJours = 0;
                }

                $adherent->setAttribute('resteJoursAssurance', $resteJours);
            } else {
                $adherent->setAttribute('resteJoursAssurance', 0);
            }
            $subscriptions = Subscription::with(['abonnement.groupe'])->where('adherentId', $adherent->id)->orderBy('StartDate', 'desc')->get();
            $transactions = Transaction::with(["adherent", "user"])->where("targetAdherentId", "=", $adherent->id)->orderBy('created_at', 'desc')->get();
            $logs = AdherentLog::with("user")->where("targetAdherentId", $adherent->id)->orderBy("created_at", "desc")->get();
            $periodes = Periode::where("adherentId", $id)->get();
            $adherent->setAttribute('subscriptions', $subscriptions);
            $adherent->setAttribute('logs', $logs);
            $adherent->setAttribute('transactions', $transactions);
            $adherent->setAttribute('periodes', $periodes);
            return ApiResponse::success(new AdherentResource($adherent), "Détails des informations sur l'adherent");
        } catch (\Exception $e) {
            return ApiResponse::error('Erreur serveur: ' . $e->getMessage(), 500);
        }
    }
    public function update(Request $request, string $id)
    {
        try {
            $validated = $request->validate(
                [
                    "cin" => ["nullable", "string", "max:20", Rule::unique('adherents', 'cin')->ignore($id), Rule::unique('users', 'cin')->ignore($id)],
                    "firstName" => "required|string|max:100",
                    "lastName" => "required|string|max:100",
                    "birthDate" => "nullable|date|before:today",
                    "phonePrimary" => "required|string|max:20",
                    "phoneSecondary" => "nullable|string|max:20",
                    "gender" => "required|string",
                    "registrationDate" => "required|date|before:insuranceEndDate",
                    "insuranceEndDate" => "required|date|after:registrationDate",

                ],
                [
                    "cin.string" => "Le CIN doit être une chaîne de caractères.",
                    "cin.max" => "Le CIN ne doit pas dépasser 20 caractères.",
                    "cin.unique" => "Ce CIN est déjà utilisé.",
                    "firstName.required" => "Le prénom est obligatoire.",
                    "firstName.string" => "Le prénom doit être une chaîne de caractères.",
                    "firstName.max" => "Le prénom ne doit pas dépasser 100 caractères.",
                    "lastName.required" => "Le nom est obligatoire.",
                    "lastName.string" => "Le nom doit être une chaîne de caractères.",
                    "lastName.max" => "Le nom ne doit pas dépasser 100 caractères.",
                    "birthDate.date" => "La date de naissance doit être une date valide.",
                    "birthDate.before" => "La date de naissance doit être antérieure à aujourd'hui.",
                    "phonePrimary.required" => "Le téléphone principal est obligatoire.",
                    "phonePrimary.string" => "Le téléphone principal doit être une chaîne de caractères.",
                    "phonePrimary.max" => "Le téléphone principal ne doit pas dépasser 20 caractères.",
                    "phoneSecondary.string" => "Le téléphone secondaire doit être une chaîne de caractères.",
                    "phoneSecondary.max" => "Le téléphone secondaire ne doit pas dépasser 20 caractères.",
                    "gender.required" => "Le genre est obligatoire.",
                    "gender.string" => "Le genre doit être HOMME ou FEMME.",
                    "registrationDate.before" => "La date d'inscription doit précéder la fin d'assurance.",
                    "insuranceEndDate.after" => "La date de fin d'assurance doit être future et après l'inscription.",
                    "registrationDate.required" => "La date d'inscription est obligatoire.",
                    "insuranceEndDate.required" => "La date de fin d'assurance est obligatoire.",
                ]
            );
            $adherent = Adherent::find($id);

            if (!$adherent) {
                return ApiResponse::error("Adhérent introuvable", 404);
            }

            // Récupérer l'état original avant modification
            $original = $adherent->getOriginal();

            // Appliquer les changements
            $adherent->fill($validated);

            // Récupérer les champs modifiés (avant save)
            $changes = $adherent->getDirty();

            foreach ($changes as $champ => $nouvelleValeur) {
                if (in_array($champ, ['updated_at', 'created_at'])) {
                    continue;
                }

                $ancienneValeur = $original[$champ] ?? null;

                // Formater les dates
                if ($ancienneValeur instanceof \DateTimeInterface) {
                    $ancienneValeur = $ancienneValeur->format('Y-m-d');
                }
                if (is_string($nouvelleValeur) && strtotime($nouvelleValeur)) {
                    $nouvelleValeur = date('Y-m-d', strtotime($nouvelleValeur));
                }

                // Ignorer si valeur inchangée
                if ((string)$ancienneValeur === (string)$nouvelleValeur) {
                    continue;
                }

                $champLisible = str_replace('_', ' ', $champ);
                $label = $champLisible == 'gender' ? 'genre' : $champLisible;

                AdherentLog::create([
                    'action' => 'modification adherent',
                    'fieldName' => $champ,
                    'oldValue' => $ancienneValeur,
                    'newValue' => $nouvelleValeur,
                    'executedByUserId' => $request->user()->id,
                    'targetAdherentId' => $adherent->id,
                    'description' => "Changement $label : '$ancienneValeur' → '$nouvelleValeur'",
                ]);
            }

            // Sauvegarder enfin
            $adherent->save();

            return ApiResponse::success(new AdherentResource($adherent->load("branche", "addedBy")), "Adherent mis à jour");
        } catch (ValidationException $e) {
            return ApiResponse::error('Erreur de validation', 422, $e->errors());
        } catch (\Exception $e) {
            return ApiResponse::error('Erreur serveur: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        try {
            $adherent = Adherent::findOrFail($id);
            if (!$adherent) {
                return ApiResponse::error("Impossible de supprimer ce adherent : elle n’existe pas", 404);
            }
            $adherent->delete();
            return ApiResponse::success(null, 'Adherent supprimé avec succès');
        } catch (\Exception $e) {
            return ApiResponse::error('Erreur serveur: ' . $e->getMessage(), 500);
        }
    }
    public function getAdherentsByClubId($ClubId)
    {
        try {
            $adherents = Adherent::all()->where("brancheId", "=", $ClubId);
            if ($adherents->isEmpty()) {
                return ApiResponse::success([], 'Aucune adherent trouvée');
            }
            return ApiResponse::success(
                AdherentResource::collection($adherents),
                'Liste des adherents'
            );
        } catch (\Exception $e) {
            return ApiResponse::error(
                'Erreur serveur: ' . $e->getMessage(),
                500
            );
        }
    }
    public function search(Request $request)
    {
        $value = $request->value;
        if (strlen($value) < 3) {
            return ApiResponse::error("Au moins 3 caractères", 400);
        }
        try {
            $adherents = Adherent::with('branche')
                ->where(function ($query) use ($value) {
                    $query->where('id', 'like', "%$value%")
                        ->orWhere('cin', 'like', "%$value%")
                        ->orWhere('firstName', 'like', "%$value%")
                        ->orWhere('lastName', 'like', "%$value%")
                        ->orWhere('phonePrimary', 'like', "%$value%");
                })->orderBy('id', 'desc')
                ->get();
            return ApiResponse::success($adherents, "Liste des aherents avec " . $value . " ", 200);
        } catch (Exception $e) {
            return ApiResponse::error("Erreur De Serveur", 500, $e->getMessage());
        }
    }
}
