<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Resources\GroupeAbonnementResource;
use App\Models\GroupeAbonnement;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class GroupeAbonnementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $groupesAbn = GroupeAbonnement::with(["branche", "abonnements"])->get();
            if ($groupesAbn->isEmpty()) {
                return ApiResponse::success([], "Aucune groupe d'abonnements trouvée");
            }
            return ApiResponse::success(
                GroupeAbonnementResource::collection($groupesAbn),
                "Liste des groupes d'abonnements"
            );
        } catch (\Exception $e) {
            return ApiResponse::error(
                'Erreur serveur: ' . $e->getMessage(),
                500
            );
        }
    }
    public function getGroupesAbonnements(string $brancheId)
    {
        try {
            $groupesAbn = GroupeAbonnement::with('branche')->where("brancheId", "=", $brancheId)->get();

            if ($groupesAbn->isEmpty()) {
                return ApiResponse::success([], 'Aucune utlisateur trouvée');
            }

            return ApiResponse::success(
                GroupeAbonnementResource::collection($groupesAbn),
                "Liste des groupes d'abonnements"
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
                    'name'        => 'required|string|max:255|unique:groupe_abonnements,name',
                    'type'        => 'required|string|max:255',
                    'description' => 'required|string',
                    'isArchived'  => 'boolean',
                    'brancheId'   => 'required|integer|exists:branches,id',
                ],
                [
                    'name.required'        => 'Le nom du groupe est obligatoire.',
                    'name.string'          => 'Le nom du groupe doit être une chaîne de caractères.',
                    'name.unique'          => 'Ce nom de groupe existe déjà.',

                    'type.required'        => 'Le type du groupe est obligatoire.',
                    'type.string'          => 'Le type du groupe doit être une chaîne de caractères.',

                    'description.required' => 'La description du groupe est obligatoire.',
                    'description.string'   => 'La description du groupe doit être une chaîne de caractères.',

                    'isArchived.boolean'   => 'Le statut du groupe doit être vrai ou faux.',

                    'brancheId.required'   => 'Veuillez choisir un club.',
                    'brancheId.integer'    => 'Le club sélectionné est invalide.',
                    'brancheId.exists'     => 'Le club sélectionné n’existe pas.',
                ]
            );
            $groupe = GroupeAbonnement::create($validated);
            $groupe->load("branche");
            return ApiResponse::success(
                new GroupeAbonnementResource($groupe),
                "Groupe créée avec succès"
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
            $user = GroupeAbonnement::with(['branche'])->find($id);
            if (!$user) {
                return ApiResponse::error("Groupe non trouvé", 404);
            }
            return ApiResponse::success(new GroupeAbonnementResource($user), "Détails des informations sur le groupe");
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
            $validated = $request->validate(
                [
                    'name'        => 'required|string|max:255|unique:groupe_abonnements,name,' . $id,
                    'type'        => 'required|string|max:255',
                    'description' => 'required|string',
                    'isArchived'  => 'boolean',
                    'brancheId'   => 'required|integer|exists:branches,id',
                ],
                [
                    'name.required'        => 'Le nom du groupe est obligatoire.',
                    'name.string'          => 'Le nom du groupe doit être une chaîne de caractères.',
                    'name.unique'          => 'Ce nom de groupe existe déjà.',

                    'type.required'        => 'Le type du groupe est obligatoire.',
                    'type.string'          => 'Le type du groupe doit être une chaîne de caractères.',

                    'description.required' => 'La description du groupe est obligatoire.',
                    'description.string'   => 'La description du groupe doit être une chaîne de caractères.',

                    'isArchived.boolean'   => 'Le statut du groupe doit être vrai ou faux.',

                    'brancheId.required'   => 'Veuillez choisir un club.',
                    'brancheId.integer'    => 'Le club sélectionné est invalide.',
                    'brancheId.exists'     => 'Le club sélectionné n’existe pas.',
                ]
            );
            $groupe = GroupeAbonnement::find($id);
            if (!$groupe) {
                return ApiResponse::error('groupe introuvable', 404);
            }
            $groupe->update($validated);
            $groupe->load("branche");
            return ApiResponse::success(
                new GroupeAbonnementResource($groupe),
                "Groupe mise à jour avec succès"
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
            $groupe = GroupeAbonnement::findOrFail($id);
            if (!$groupe) {
                return ApiResponse::error("Impossible de supprimer cegroupe : elle n’existe pas", 404);
            }
            $groupe->isArchived = 1;
            $groupe->save();
            return ApiResponse::success(null, 'Groupe supprimé avec succès');
        } catch (\Exception $e) {
            return ApiResponse::error('Erreur serveur: ' . $e->getMessage(), 500);
        }
    }
}
