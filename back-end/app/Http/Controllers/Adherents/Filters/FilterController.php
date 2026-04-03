<?php

namespace App\Http\Controllers\Adherents\Filters;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\AdherentResource;
use App\Models\Adherent;
use Illuminate\Http\Request;

class FilterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function getByAbonnementId($abonnementId)
    {
        try {
            $allAdherents = Adherent::with("abonnements")->orderby("id", "desc")->get();
            $adherents = $allAdherents->filter(function ($adherent) use ($abonnementId) {
                if ($adherent->abonnements->isEmpty()) {
                    return false;
                }
                $abonnement = $adherent->abonnements->last();
                return $abonnement->id == $abonnementId;
            })->values();
            return ApiResponse::success(AdherentResource::collection($adherents), 'Liste des adherents');
        } catch (\Exception $e) {
            return ApiResponse::error(
                'Erreur serveur: ' . $e->getMessage(),
                500
            );
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
