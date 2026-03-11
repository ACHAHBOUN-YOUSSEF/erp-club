<?php

namespace App\Http\Controllers;

use App\Models\Ville;
use Illuminate\Http\Request;
use App\Helpers\ApiResponse;
use App\Http\Resources\VilleResource;
use Illuminate\Validation\ValidationException;

class VilleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $villes = Ville::all();
        if ($villes->isEmpty()) {
            return ApiResponse::success(
                [],
                'Aucune ville trouvée'
            );
        }
        return ApiResponse::success(
            VilleResource::collection($villes),
            'Liste des villes'
        );
    }
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name'       => 'required|string|max:255|unique:villes,name',
                'region'     => 'nullable|string|max:255',
                'codePostal' => 'nullable|numeric',
            ], [
                'name.required'       => 'Le nom de la ville est obligatoire.',
                'name.string'         => 'Le nom de la ville doit être une chaîne de caractères.',
                'name.max'            => 'Le nom de la ville ne peut pas dépasser :max caractères.',
                'name.unique'         => 'Cette ville existe déjà.',

                'region.string'       => 'La région doit être une chaîne de caractères.',
                'region.max'          => 'La région ne peut pas dépasser :max caractères.',

                'codePostal.numeric'  => 'Le code postal doit être un nombre.',
            ]);

            $ville = Ville::create($validated);

            return ApiResponse::success(
                new VilleResource($ville),
                'Ville créée avec succès',
                201
            );
        } catch (ValidationException $e) {
            return ApiResponse::error(
                'Erreur de validation',
                422,
                $e->errors()
            );
        } catch (\Exception $e) {
            return ApiResponse::error(
                'Erreur serveur: ' . $e->getMessage(),
                500
            );
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $ville = Ville::find($id);
        if (!$ville) {
            return ApiResponse::error(
                'Ville non trouvée',
                404
            );
        }
        return ApiResponse::success(
            new VilleResource($ville),
            'Détails de la ville'
        );
    }

    public function update(Request $request, Ville $ville)
    {
        try {
            $validated = $request->validate([
                'name'       => 'required|string|max:255|unique:villes,name,' . $ville->id,
                'region'     => 'nullable|string|max:255',
                'codePostal' => 'nullable|numeric',
            ], [
                'name.required'       => 'Le nom de la ville est obligatoire.',
                'name.string'         => 'Le nom de la ville doit être une chaîne de caractères.',
                'name.max'            => 'Le nom de la ville ne peut pas dépasser :max caractères.',
                'name.unique'         => 'Cette ville existe déjà.',
                'region.string'       => 'La région doit être une chaîne de caractères.',
                'region.max'          => 'La région ne peut pas dépasser :max caractères.',
                'codePostal.numeric'  => 'Le code postal doit être un nombre.',
            ]);
            $ville->update($validated);
            return ApiResponse::success(
                new VilleResource($ville),
                'Ville mise à jour avec succès'
            );
        } catch (ValidationException $e) {
            return ApiResponse::error(
                'Erreur de validation',
                422,
                $e->errors()
            );
        } catch (\Exception $e) {
            return ApiResponse::error(
                'Erreur serveur: ' . $e->getMessage(),
                500
            );
        }
    }

    public function destroy(string $id)
    {
        $ville = Ville::find($id);
        if (!$ville) {
            return ApiResponse::error(
                'Ville non trouvée',
                404
            );
        }

        try {
            $ville->delete();
            return ApiResponse::success(
                null,
                'Ville supprimée avec succès'
            );
        } catch (\Exception $e) {
            return ApiResponse::error(
                'Impossible de supprimer la ville: ' . $e->getMessage(),
                500
            );
        }
    }
}
