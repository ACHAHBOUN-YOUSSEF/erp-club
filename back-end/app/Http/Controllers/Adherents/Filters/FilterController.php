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
    public function getActifsAdherents(Request $request)
    {
        try {
            $adherents = Adherent::where("brancheId", $request->user()->brancheId)
                ->whereHas('abonnements', function ($query) {
                    $query->where('endDate', '>', now());
                })
                ->with(['abonnements' => function ($query) {
                    $query->select("abonnements.id", "abonnements.title");
                }])
                ->select("id", "cin", "firstName", "lastName", "phonePrimary", "registrationDate")
                ->orderBy("id", "desc")
                ->get();
            return ApiResponse::success(AdherentResource::collection($adherents), 'Liste des adherents');
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
    public function getInActifsAdherents(Request $request)
    {
        try {
            $expirés = Adherent::where('brancheId', $request->user()->brancheId)
                ->whereHas('abonnements', function ($query) {
                    $query->where('endDate', '<', now());
                })
                ->whereDoesntHave('abonnements', function ($query) {
                    $query->where('endDate', '>=', now());
                })
                ->with(['abonnements' => function ($query) {
                    $query->select('abonnements.id', 'abonnements.title', 'subscriptions.startDate', 'subscriptions.endDate');
                }])
                ->select(
                    'id',
                    'cin',
                    'firstName',
                    'lastName',
                    'phonePrimary',
                    'registrationDate'
                )
                ->orderBy('id', 'desc')
                ->get();

            $sans = Adherent::where('brancheId', $request->user()->brancheId)
                ->whereDoesntHave('abonnements')
                ->select(
                    'id',
                    'cin',
                    'firstName',
                    'lastName',
                    'phonePrimary',
                    'registrationDate'
                )
                ->orderBy('id', 'desc')
                ->get();

            $adherentsInactifs = $expirés->merge($sans);
            return ApiResponse::success(AdherentResource::collection($sans), 'Liste des adherents');
        } catch (\Exception $e) {
            return ApiResponse::error(
                'Erreur serveur: ' . $e->getMessage(),
                500
            );
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function getAdherentsThatHasRemainingAmount(Request $request)
    {
        try {
            $allAdherents = Adherent::with(['abonnements' => function ($query) {
                $query->select("abonnements.id", "abonnements.title");
            }])
                ->where("brancheId", $request->user()->brancheId)
                ->select(
                    'id',
                    'cin',
                    'firstName',
                    'lastName',
                    'phonePrimary',
                    'registrationDate'
                )->orderBy("id", "desc")
                ->get();
            $adherents = $allAdherents->filter(function ($adherent) {
                foreach ($adherent->abonnements as $abonnement) {
                    if ($abonnement->pivot->remainingAmount > 0) {
                        return true;
                    }
                }
                return false;
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
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
