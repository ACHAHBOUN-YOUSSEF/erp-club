<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Resources\BrancheResource;
use App\Models\Branche;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class BrancheController extends Controller
{
    public function index()
    {
        try {
            $branches = Branche::with("ville")->get();

            if ($branches->isEmpty()) {
                return ApiResponse::success([], 'Aucune club trouvée');
            }

            return ApiResponse::success(
                BrancheResource::collection($branches),
                'Liste des clubs'
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
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:branches',
                'adresse' => 'nullable|string|max:255',
                'phone' => 'nullable|string|max:20',
                'email' => 'nullable|email|max:255',
                'villeId' => 'required|exists:villes,id',
            ], [
                'name.required' => 'Le nom de club est obligatoire.',
                'name.max' => 'Le nom de la branche ne doit pas dépasser 255 caractères.',
                'name.unique' => 'Le nom de club existe déjà.',
                'email.email' => 'Veuillez saisir une adresse e-mail valide.',
                'villeId.required' => 'La ville est obligatoire.',
                'villeId.exists' => 'La ville sélectionnée est invalide.',
            ]);

            $branche = Branche::create($validated);
            $branche->load('ville');

            return ApiResponse::success(
                new BrancheResource($branche),
                'club créée avec succès'
            );
        } catch (ValidationException $e) {
            return ApiResponse::error('Erreur de validation', 422, $e->errors());
        } catch (\Exception $e) {
            return ApiResponse::error('Erreur serveur: ' . $e->getMessage(), 500);
        }
    }

    public function show($id)
    {
        try {
            $branche = Branche::with('ville')->find($id);
            if (!$branche) {
                return ApiResponse::error('club introuvable', 404);
            }

            return ApiResponse::success(
                new BrancheResource($branche),
                'Détails de la branche'
            );
        } catch (\Exception $e) {
            return ApiResponse::error('Erreur serveur: ' . $e->getMessage(), 500);
        }
    }
    public function getClubsByVilleId($villeId)
    {
        try {
            $branches = Branche::with("ville")->where("villeId", "=", $villeId)->get();

            if ($branches->isEmpty()) {
                return ApiResponse::success([], 'Aucune club trouvée');
            }

            return ApiResponse::success(
                BrancheResource::collection($branches),
                'Liste des clubs'
            );
        } catch (\Exception $e) {
            return ApiResponse::error(
                'Erreur serveur: ' . $e->getMessage(),
                500
            );
        }
    }
    public function update(Request $request, $id)
    {
        try {
            $branche = Branche::find($id);
            if (!$branche) {
                return ApiResponse::error('Branche introuvable', 404);
            }

            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:branches,name,'.$id,
                'adresse' => 'nullable|string|max:255',
                'phone' => 'nullable|string|max:20',
                'email' => 'nullable|email|max:255',
                'villeId' => 'required|exists:villes,id',
            ], [
                'name.unique' => 'Le nom de club existe déjà.',
                'name.required' => 'Le nom de la branche est obligatoire.',
                'name.max' => 'Le nom de la branche ne doit pas dépasser 255 caractères.',
                'email.email' => 'Veuillez saisir une adresse e-mail valide.',
                'villeId.required' => 'La ville est obligatoire.',
                'villeId.exists' => 'La ville sélectionnée est invalide.',
            ]);

            $branche->update($validated);
            $branche->load('ville');

            return ApiResponse::success(
                new BrancheResource($branche),
                'Branche mise à jour avec succès'
            );
        } catch (ValidationException $e) {
            return ApiResponse::error('Erreur de validation', 422, $e->errors());
        } catch (\Exception $e) {
            return ApiResponse::error('Erreur serveur: ' . $e->getMessage(), 500);
        }
    }

    public function destroy($id)
    {
        try {
            $branche = Branche::find($id);
            if (!$branche) {
                return ApiResponse::error('Impossible de supprimer cette branche : elle n’existe pas.', 404);
            }
            $branche->delete();
            return ApiResponse::success(null, 'Branche supprimée avec succès');
        } catch (\Exception $e) {
            return ApiResponse::error('Erreur serveur: ' . $e->getMessage(), 500);
        }
    }
}
