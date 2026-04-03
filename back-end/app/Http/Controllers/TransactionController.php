<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Resources\TransactionResource;
use App\Models\AdherentLog;
use App\Models\Transaction;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class TransactionController extends Controller
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
                'montant' => ['required', 'numeric', 'min:0'],
                // 'type' => ['required', 'in:income,expense'],
                'modePaiement' => ['required', 'in:ESPECES,VIREMENT,CHEQUE'],
                'transactionDate' => ['required', 'date'],
                'description' => ['required', 'string', 'max:255'],
                "adherentId" => "required|exists:adherents,id"
            ], [
                'montant.required' => 'Le montant est obligatoire',
                'type.required' => 'Le type de transaction est obligatoire',
                'montant.numeric' => 'Le montant doit être un nombre',
                'montant.min' => 'Le montant doit être supérieur ou égal à 0',

                'modePaiement.required' => 'Le mode de paiement est obligatoire',
                'modePaiement.in' => 'Le mode de paiement doit être ESPECES, VIREMENT ou CHEQUE',
                'type.in' => 'Le type de transaction doit être Revenus ou Dépenses',

                'transactionDate.required' => 'La date de transaction est obligatoire',
                'transactionDate.date' => 'La date de transaction doit être une date valide',
                "adherentId.required" => "Id de adherent est obligatoire",
                "adherentId.exists" => "Choissir un adherent",
                'description.required' => 'La description est obligatoire',
                'description.string' => 'La description doit être une chaîne de caractères',
                'description.max' => 'La description ne doit pas dépasser 255 caractères',
            ]);

            $transaction = new Transaction();
            $transaction->montant = $validated["montant"];
            $transaction->modePaiement = $validated["modePaiement"];
            $transaction->transactionDate = $validated["transactionDate"];
            $transaction->type = 'income';
            $transaction->description = $validated["description"];
            $transaction->executedByUserId = $request->user()->id;
            $transaction->targetAdherentId = $validated['adherentId'];
            $transaction->brancheId = $request->user()->brancheId;
            $transaction->save();
            return ApiResponse::success(new TransactionResource($transaction), 'Transaction criée avec succès');
        } catch (ValidationException $e) {
            return ApiResponse::error('Erreur de validation', 422, $e->errors());
        } catch (Exception $e) {
            return ApiResponse::error('Erreur serveur: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $transaction = Transaction::with(["adherent", "user"])->findOrFail($id);
            if (!$transaction) {
                return ApiResponse::error("Transaction non trouvé", 404);
            }
            return ApiResponse::success(new TransactionResource($transaction), "Détails des informations sur la transaction");
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
                'montant' => ['required', 'numeric', 'min:0'],
                'modePaiement' => ['required', 'in:ESPECES,VIREMENT,CHEQUE'],
                'transactionDate' => ['required', 'date'],
                'description' => ['required', 'string', 'max:255'],
            ], [
                'montant.required' => 'Le montant est obligatoire',
                'montant.numeric' => 'Le montant doit être un nombre',
                'montant.min' => 'Le montant doit être supérieur ou égal à 0',

                'modePaiement.required' => 'Le mode de paiement est obligatoire',
                'modePaiement.in' => 'Le mode de paiement doit être ESPECES, VIREMENT ou CHEQUE',

                'transactionDate.required' => 'La date de transaction est obligatoire',
                'transactionDate.date' => 'La date de transaction doit être une date valide',

                'description.required' => 'La description est obligatoire',
                'description.string' => 'La description doit être une chaîne de caractères',
                'description.max' => 'La description ne doit pas dépasser 255 caractères',
            ]);
            $transaction = Transaction::findOrFail($id);
            $transaction->montant = $validated["montant"];
            $transaction->modePaiement = $validated["modePaiement"];
            $transaction->transactionDate = $validated["transactionDate"];
            $transaction->description = $validated["description"];
            $transaction->save();
            return ApiResponse::success(new TransactionResource($transaction), 'Transaction mise à jour avec succès');
        } catch (ValidationException $e) {
            return ApiResponse::error('Erreur de validation', 422, $e->errors());
        } catch (Exception $e) {
            return ApiResponse::error('Erreur serveur: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        try {
            $transaction = Transaction::findOrFail($id);
            if (!$transaction) {
                return ApiResponse::error("Impossible de supprimer cette transaction : elle n’existe pas", 404);
            }
            AdherentLog::create([
                "action" => "Suppression subscription",
                "executedByUserId" => $request->user()->id,
                "targetAdherentId" => $transaction->adherentId,
                'description' => "Suppression de la transaction avec le montant  « " . $transaction->montant . " »",
            ]);
            $transaction->delete();
            return ApiResponse::success(null, 'Transaction supprimé avec succès');
        } catch (\Exception $e) {
            return ApiResponse::error('Erreur serveur: ' . $e->getMessage(), 500);
        }
    }
    public function getDailyTransactionTotal(Request $request, $day)
    {
        try {
            $parsedDate = \Carbon\Carbon::parse($day)->format('Y-m-d');
            $query = DB::table("transactions")
                ->select([
                    "transactions.id",
                    "transactions.montant",
                    "transactions.transactionDate",
                    "transactions.executedByUserId",
                    "transactions.targetAdherentId",
                    "transactions.description",
                    "transactions.modePaiement",
                    "transactions.updated_at",
                    "transactions.created_at",
                    "adherents.firstName",
                    "adherents.lastName",
                    "users.firstName as userFirstName",
                    "users.lastName as userLastName"
                ])
                ->leftJoin("adherents", "transactions.targetAdherentId", "=", "adherents.id")
                ->leftJoin("users", "transactions.executedByUserId", "=", "users.id")
                ->where('transactions.brancheId', $request->user()->brancheId)
                ->where('transactions.type', 'income')
                ->whereDate('transactions.transactionDate', $parsedDate);

            $transactions = $query->get();

            $info = 'Date : ' . \Carbon\Carbon::parse($day)->format('d/m/Y');

            return ApiResponse::success(
                [
                    'transactions' => $transactions,
                    'info' => $info,
                    'total' => $transactions->sum('montant'),
                    'count' => $transactions->count()
                ],
                "Transactions du {$info}",
                200,
            );
        } catch (\Exception $e) {
            return ApiResponse::error("Date invalide: {$day}", 400, $e->getMessage());
        }
    }
    public function getPeriodTransactionTotal(Request $request, $startDate, $endDate)
    {
        try {
            $start = \Carbon\Carbon::parse($startDate)->format('Y-m-d');
            $end = \Carbon\Carbon::parse($endDate)->format('Y-m-d');
            $query = DB::table("transactions")
                ->select([
                    "transactions.id",
                    "transactions.montant",
                    "transactions.transactionDate",
                    "transactions.executedByUserId",
                    "transactions.targetAdherentId",
                    "transactions.description",
                    "transactions.modePaiement",
                    "transactions.updated_at",
                    "transactions.created_at",
                    "adherents.firstName",
                    "adherents.lastName",
                    "users.firstName as userFirstName",
                    "users.lastName as userLastName"
                ])
                ->leftJoin("adherents", "transactions.targetAdherentId", "=", "adherents.id")
                ->leftJoin("users", "transactions.executedByUserId", "=", "users.id")
                ->where('transactions.brancheId', $request->user()->brancheId)
                ->where('transactions.type', 'income')
                ->whereBetween('transactionDate', [$start, $end]);

            $transactions = $query->get();

            $info = 'Période : du ' . $start . ' au ' . $end;
            return ApiResponse::success(
                [
                    'transactions' => $transactions,
                    'info' => $info,
                    'total' => $transactions->sum('montant'),
                    'count' => $transactions->count()
                ],
                "Transactions du {$info}",
                200,
            );
        } catch (\Exception $e) {
            return ApiResponse::error("Periode  invalide ", 400, $e->getMessage());
        }
    }
}
