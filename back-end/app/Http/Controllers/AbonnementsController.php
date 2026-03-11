<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Resources\AbonnementResource;
use App\Models\Abonnement;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AbonnementsController extends Controller
{
    public function index()
    {
        try {
            $abonnements = Abonnement::with(["groupe"])->get();
            if ($abonnements->isEmpty()) {
                return ApiResponse::success([], "Aucune abonement trouvée");
            }
            return ApiResponse::success(
                AbonnementResource::collection($abonnements),
                "Liste des'abonnements"
            );
        } catch (\Exception $e) {
            return ApiResponse::error(
                'Erreur serveur: ' . $e->getMessage(),
                500
            );
        }
    }
    public function store(Request $request)
    {
        try {
            $validated = $request->validate(
                [
                    'title'          => 'required|string|max:255',
                    'durationMonths' => 'required|integer|min:1|max:60',
                    'price'          => 'required|numeric|min:0.01',
                    'isArchived'     => 'boolean',
                    'groupeId'       => 'required|integer|exists:groupe_abonnements,id',
                ],
                [
                    'title.required'          => "Le titre de l'abonnement est obligatoire.",
                    'title.string'            => "Le titre doit être une chaîne de caractères.",
                    'title.max'               => "Le titre ne doit pas dépasser 255 caractères.",

                    'durationMonths.required' => "La durée est obligatoire.",
                    'durationMonths.integer'  => "La durée doit être un nombre entier.",
                    'durationMonths.min'      => "La durée doit être au minimum 1 mois.",
                    'durationMonths.max'      => "La durée ne peut pas dépasser 60 mois.",

                    'price.required'          => "Le prix est obligatoire.",
                    'price.numeric'           => "Le prix doit être un nombre.",
                    'price.min'               => "Le prix doit être supérieur à 0.",

                    'isArchived.boolean'      => "Le statut doit être vrai ou faux.",

                    'groupeId.required'       => "Veuillez choisir un groupe.",
                    'groupeId.integer'        => "Le groupe sélectionné est invalide.",
                    'groupeId.exists'         => "Le groupe sélectionné n'existe pas.",
                ]
            );
            $groupe = Abonnement::create($validated);
            $groupe->load("groupe");
            return ApiResponse::success(
                new AbonnementResource($groupe),
                "abonnement créée avec succès"
            );
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
            $abonnement = Abonnement::find($id);
            if (!$abonnement) {
                return ApiResponse::error("abonnement non trouvé", 404);
            }
            return ApiResponse::success(new AbonnementResource($abonnement), "Détails des informations sur l'abonnement");
        } catch (\Exception $e) {
            return ApiResponse::error('Erreur serveur: ' . $e->getMessage(), 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate(
                [
                    'title'          => 'required|string|max:255',
                    'durationMonths' => 'required|integer|min:1|max:60',
                    'price'          => 'required|numeric|min:0.01',
                    'isArchived'     => 'boolean',
                    'groupeId'       => 'required|integer|exists:groupe_abonnements,id',
                ],
                [
                    'title.required'          => "Le titre de l'abonnement est obligatoire.",
                    'title.string'            => "Le titre doit être une chaîne de caractères.",
                    'title.max'               => "Le titre ne doit pas dépasser 255 caractères.",

                    'durationMonths.required' => "La durée est obligatoire.",
                    'durationMonths.integer'  => "La durée doit être un nombre entier.",
                    'durationMonths.min'      => "La durée doit être au minimum 1 mois.",
                    'durationMonths.max'      => "La durée ne peut pas dépasser 60 mois.",

                    'price.required'          => "Le prix est obligatoire.",
                    'price.numeric'           => "Le prix doit être un nombre.",
                    'price.min'               => "Le prix doit être supérieur à 0.",

                    'isArchived.boolean'      => "Le statut doit être vrai ou faux.",

                    'groupeId.required'       => "Veuillez choisir un groupe.",
                    'groupeId.integer'        => "Le groupe sélectionné est invalide.",
                    'groupeId.exists'         => "Le groupe sélectionné n'existe pas.",
                ]
            );
            $abonnement = Abonnement::findOrFail($id);
            $abonnement->update($validated);
            $abonnement->load('groupe');

            return ApiResponse::success(
                new AbonnementResource($abonnement),
                "Abonnement mis à jour avec succès"
            );
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
            $abonnement = Abonnement::findOrFail($id);
            if (!$abonnement) {
                return ApiResponse::error("Impossible de supprimer ce abonnement : elle n’existe pas", 404);
            }
            $abonnement->isArchived = 1;
            $abonnement->save();
            return ApiResponse::success(null, 'Abonnement supprimé avec succès');
        } catch (\Exception $e) {
            return ApiResponse::error('Erreur serveur: ' . $e->getMessage(), 500);
        }
    }
    public function getByGroupe($GroupeId)
    {
        try {
            $abonnements = Abonnement::all()->where("groupeId", "=", $GroupeId)->where("isArchived", "=", "0");
            if ($abonnements->isEmpty()) {
                return ApiResponse::success([], "Aucune abonement trouvée");
            }
            return ApiResponse::success(
                AbonnementResource::collection($abonnements),
                "Liste des'abonnements"
            );
        } catch (\Exception $e) {
            return ApiResponse::error(
                'Erreur serveur: ' . $e->getMessage(),
                500
            );
        }
    }
}
