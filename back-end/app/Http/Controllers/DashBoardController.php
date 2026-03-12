<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Models\Abonnement;
use App\Models\Adherent;
use App\Models\GroupeAbonnement;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashBoardController extends Controller
{
    public function getStatistique(Request $request)
    {
        try {
            $NbAdherents = Adherent::count();
            $AdherentsThisMonth = Adherent::whereBetween('created_at', [
                now()->startOfMonth(),
                now()->endOfMonth()
            ])->count();
            $adherentsActifs = Adherent::where("brancheId", $request->user()->brancheId)
                ->whereHas('abonnements', function ($query) {
                    $query->where('endDate', '>', now());
                })
                ->with(['abonnements' => function ($query) {
                    $query->select("abonnements.id", "abonnements.title");
                }])
                ->select("id", "gender")
                ->orderBy("id", "desc")
                ->get();
            $adherentsInactifs = Adherent::where("brancheId", $request->user()->brancheId)
                ->whereDoesntHave('abonnements', function ($query) {
                    $query->where('endDate', '>', now());
                })
                ->with(['abonnements' => function ($query) {
                    $query->select("abonnements.id", "abonnements.title");
                }])
                ->select("id", "gender")
                ->orderBy("id", "desc")
                ->get();
            $NbAdherentByGenre = DB::table("adherents")->select("gender", DB::raw("COUNT('id') as nombreTotal"))->where("brancheId", $request->user()->brancheId)->groupBy("gender")->get();
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            $groupes = GroupeAbonnement::with(['abonnements' => function ($query) {
                $query->orderBy('durationMonths', 'asc');
            }])->get();

            foreach ($groupes as $groupe) {
                foreach ($groupe->abonnements as $abonnement) {
                    $abonnement->nb_subscriptions = $abonnement->subscriptions()->count();
                }
            }
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            $transactions = Transaction::with(['user', 'adherent'])->whereDate('transactionDate', now())->latest('transactionDate')->take(5)->get();
            return ApiResponse::success([
                'adherents_inactifs_count' => $adherentsInactifs->count(),
                'adherents_inactifs' => $adherentsInactifs,
                'AdherentsThisMonth' => $AdherentsThisMonth,
                'adherents_actifs_count' => $adherentsActifs->count(),
                'adherents_actifs' => $adherentsActifs,
                'nb_adherents' => $NbAdherents,
                'nb_adherents_by_genre' => $NbAdherentByGenre,
                'groupes' => $groupes,
                'transactions' => $transactions
            ]);
        } catch (\Exception $e) {
            return ApiResponse::error('Erreur serveur: ' . $e->getMessage(), 500);
        }
    }
}
