<?php

namespace App\Http\Controllers\Adherents\Files;

use App\Exports\Adherents\ExportAll;
use App\Exports\Adherents\ExportByFilters;
use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\Adherent;
use App\Models\Contrat;
use App\Models\Facture;
use App\Models\Periode;
use App\Models\Subscription;
use App\Models\Transaction;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use PhpOffice\PhpWord\TemplateProcessor;

class FileController extends Controller
{
    public function DownloadRecuPaiment(Request $request, $transactionId)
    {
        try {
            // 1. Vérifier transaction
            $transaction = Transaction::with("user")->find($transactionId);
            if (!$transaction) {
                return ApiResponse::error('Transaction non trouvée', 404);
            }

            // 2. Récupérer adhérent avec relations
            $adherent = DB::table('adherents')
                ->join('branches', 'adherents.brancheId', '=', 'branches.id')
                ->join('villes', 'branches.villeId', '=', 'villes.id')
                ->select(
                    'adherents.*',
                    'branches.name as branche_nom',
                    'villes.name as ville_nom'
                )
                ->where('adherents.id', $transaction->targetAdherentId)
                ->first();

            if (!$adherent) {
                return ApiResponse::error('Adhérent non trouvé', 404);
            }

            // 3. Vérifier template
            $templatePath = storage_path('app/templates/recu_paiement.docx');
            if (!file_exists($templatePath)) {
                return ApiResponse::error('Template recu_paiement.docx introuvable', 500);
            }

            // 4. Créer dossier generated si inexistant
            $outputDir = storage_path('app/generated');
            if (!file_exists($outputDir)) {
                mkdir($outputDir, 0755, true);
            }

            // 5. PhpWord Template
            $templateProcessor = new TemplateProcessor($templatePath);

            $templateProcessor->setValue('date', now()->format('d/m/Y H:i'));
            $templateProcessor->setValue('date_t', \Carbon\Carbon::parse($transaction->created_at)->format('d/m/Y H:i'));
            $templateProcessor->setValue('id', $transaction->id);
            $templateProcessor->setValue('adherent_id', $adherent->id);
            $templateProcessor->setValue('nom_complet', $adherent->firstName . ' ' . $adherent->lastName);
            $templateProcessor->setValue('ville', $adherent->ville_nom ?? 'N/A');
            $templateProcessor->setValue('tel', $adherent->phonePrimary ?? 'N/A');
            $templateProcessor->setValue('montant', number_format($transaction->montant, 2) . ' DH');
            $templateProcessor->setValue('description', $transaction->description ?? 'Paiement');
            $templateProcessor->setValue('mode', strtoupper($transaction->modePaiement ?? ''));

            $userFullName = $request->user()->firstName . ' ' . $request->user()->lastName;
            $templateProcessor->setValue('staff_nomcomplet', strtoupper($userFullName));
            $templateProcessor->setValue('donne_by', strtoupper($transaction->user->firstName . ' ' . $transaction->user->lastName));
            $filename = "recu_paiement_{$adherent->lastName}_{$adherent->firstName}_{$transaction->id}_" . now()->format('YmdHis') . '.docx';
            $outputPath = storage_path("app/generated/{$filename}");

            $templateProcessor->saveAs($outputPath);
            if (!file_exists($outputPath)) {
                return ApiResponse::error('Erreur génération document', 500);
            }
            return response()
                ->download($outputPath, $filename, [
                    'Content-Type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'Content-Disposition' => "attachment; filename*=UTF-8''" . rawurlencode($filename)
                ])
                ->deleteFileAfterSend(true);
        } catch (\PhpOffice\PhpWord\Exception\Exception $e) {
            return ApiResponse::error('Erreur génération Word: ' . $e->getMessage(), 500);
        } catch (\Exception $e) {
            return ApiResponse::error('Erreur serveur: ' . $e->getMessage(), 500);
        }
    }
    public function DownloadContrat(Request $request, $subscriptionId)
    {

        try {
            $subscription = Subscription::with("abonnement.groupe")->findOrFail($subscriptionId);
            $adherent = Adherent::with("branche.ville")->findOrFail($subscription->adherentId);
            if (empty($adherent)) {
                return ApiResponse::error("Adherent non trouvé", 404);
            }
            if (empty($subscription)) {
                return ApiResponse::error("Subscription non trouvé", 404);
            }
            // if ($subscription->remainingAmount > 0) {
            //     return ApiResponse::error("Impossible de télécharger le contrat : la souscription n'est pas totalement payée.", 404);
            // }
            $contrat = Contrat::create([
                "targetAdherentId" => $subscription->adherentId,
                "executedByUserId" => $request->user()->id,
                "contratDate" => now(),
                "montant" => $subscription->abonnement->price
            ]);
            $contrat->save();
            $templatePath = storage_path('app/templates/contrat.docx');
            $templateProcessor = new TemplateProcessor($templatePath);
            $templateProcessor->setValue('date', now()->toDateString());
            $templateProcessor->setValue('id', $contrat->reference);
            $templateProcessor->setValue("branche_name", strtoupper($adherent->branche->name));
            $templateProcessor->setValue("staff_name", strtoupper($request->user()->firstName . " " . $request->user()->lastName));
            $templateProcessor->setValue('adherent_id', $adherent->id);
            $templateProcessor->setValue('nom', $adherent->firstName);
            $templateProcessor->setValue('prenom', $adherent->lastName);
            $templateProcessor->setValue('ville', strtoupper($adherent->branche->ville->name));
            $templateProcessor->setValue('cin', $adherent->cin ?? "------");
            $templateProcessor->setValue('duree', $subscription->abonnement->durationMonths ?? "------");
            $templateProcessor->setValue('titre', strtolower($subscription->abonnement->title));
            $templateProcessor->setValue('tel', $adherent->phonePrimary);
            $templateProcessor->setValue('date_debut', $subscription->startDate);
            $templateProcessor->setValue('date_fin', $subscription->endDate);
            $templateProcessor->setValue('total', $subscription->abonnement->price);
            $templateProcessor->setValue("type_abn", strtolower($subscription->abonnement->title));
            $refSafe = str_replace('/', '-', $contrat->reference);
            $outputPath = storage_path('app/generated/' . strtolower("contrat-" . $refSafe . "-" . $adherent->firstName . "-" . $adherent->lastName) . '.docx');
            $templateProcessor->saveAs($outputPath);
            if (!file_exists($outputPath)) {
                return ApiResponse::error('Erreur génération document', 500);
            }
            $filename = "contrat--{$adherent->lastName}-{$adherent->firstName}--{$subscription->id}--" . now()->format('YmdHis') . '.docx';

            return response()
                ->download($outputPath, $filename, [
                    'Content-Type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'Content-Disposition' => "attachment; filename*=UTF-8''" . rawurlencode($filename)
                ])
                ->deleteFileAfterSend(true);
            return response()->download($outputPath)->deleteFileAfterSend(true);
        } catch (\PhpOffice\PhpWord\Exception\Exception $e) {
            return ApiResponse::error('Erreur génération Word: ' . $e->getMessage(), 500);
        } catch (\Exception $e) {
            return ApiResponse::error('Erreur serveur: ' . $e->getMessage(), 500);
        }
    }
    public function DownloadFacture(Request $request, $subscriptionId)
    {
        try {
            $subscription = Subscription::with("abonnement.groupe")->findOrFail($subscriptionId);
            $adherent = Adherent::with("branche.ville")->findOrFail($subscription->adherentId);
            if (empty($adherent)) {
                return ApiResponse::error("Adherent non trouvé", 404);
            }
            if (empty($subscription)) {
                return ApiResponse::error("Subscription non trouvé", 404);
            }
            $facture = Facture::create([
                "targetAdherentId" => $subscription->adherentId,
                "executedByUserId" => $request->user()->id,
                "contratDate" => now(),
                "montant" => $subscription->abonnement->price
            ]);
            $facture->save();
            $templatePath = storage_path('app/templates/facture.docx');
            $templateProcessor = new TemplateProcessor($templatePath);
            $templateProcessor->setValue('date', now()->toDateString());
            $templateProcessor->setValue('id', $facture->reference);
            $templateProcessor->setValue('adherent_id', $adherent->id);
            $templateProcessor->setValue('cin', $adherent->cin ?? "Pas disponible");
            $templateProcessor->setValue('nom', $adherent->firstName);
            $templateProcessor->setValue('prenom', $adherent->lastName);
            $templateProcessor->setValue('genre', $adherent->gender);
            $templateProcessor->setValue('tel', $adherent->phonePrimary);
            $templateProcessor->setValue('total', $subscription->abonnement->price);
            $templateProcessor->setValue('duree', $subscription->abonnement->durationMonths);
            $templateProcessor->setValue('title', $subscription->abonnement->groupe->name . " ( " . $subscription->abonnement->title . " )");
            $templateProcessor->setValue('date_inscription', $adherent->registrationDate);
            $templateProcessor->setValue('nom_complet',  strtoupper($request->user()->firstName . " " . $request->user()->lastName));
            $refSafe = str_replace('/', '-', $facture->reference);
            $outputPath = storage_path('app/generated/' . strtolower("facture N " . $refSafe . " " . $adherent->nom . " " . $adherent->prenom) . '.docx');
            $templateProcessor->saveAs($outputPath);
            if (!file_exists($outputPath)) {
                return ApiResponse::error('Erreur génération document', 500);
            }
            $filename = "facture--{$adherent->lastName}-{$adherent->firstName}--{$subscription->id}--" . now()->format('YmdHis') . '.docx';

            return response()
                ->download($outputPath, $filename, [
                    'Content-Type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'Content-Disposition' => "attachment; filename*=UTF-8''" . rawurlencode($filename)
                ])
                ->deleteFileAfterSend(true);
            return response()->download($outputPath)->deleteFileAfterSend(true);
        } catch (\PhpOffice\PhpWord\Exception\Exception $e) {
            return ApiResponse::error('Erreur génération Word: ' . $e->getMessage(), 500);
        } catch (\Exception $e) {
            return ApiResponse::error('Erreur serveur: ' . $e->getMessage(), 500);
        }
    }
    public function DownloadRecuSubscription(Request $request, $subscriptionId)
    {
        try {
            $subscription = Subscription::with("abonnement.groupe")->findOrFail($subscriptionId);
            $adherent = Adherent::with("branche.ville")->findOrFail($subscription->adherentId);
            if (empty($adherent)) {
                return ApiResponse::error("Adherent non trouvé", 404);
            }
            if (empty($subscription)) {
                return ApiResponse::error("Subscription non trouvé", 404);
            }
            $templatePath = storage_path('app/templates/recusSubscription.docx');
            $templateProcessor = new TemplateProcessor($templatePath);
            $templateProcessor->setValue('date', now()->toDateString());
            $templateProcessor->setValue('ref', $adherent->id . "RS" . $subscription->id);
            $templateProcessor->setValue('nom_complet', $adherent->lastName . " " . $adherent->firstName);
            $templateProcessor->setValue('startDate', $subscription->startDate);
            $templateProcessor->setValue('endDate', $subscription->endDate);
            $templateProcessor->setValue('phone', $adherent->phonePrimary);
            $templateProcessor->setValue('price', $subscription->abonnement->price);
            $templateProcessor->setValue('duration', $subscription->abonnement->durationMonths);
            $templateProcessor->setValue('title', $subscription->abonnement->groupe->type . " " . $subscription->abonnement->groupe->name . " ( " . $subscription->abonnement->title . " )");
            $templateProcessor->setValue('staff_nomcomplet',  strtoupper($request->user()->firstName . " " . $request->user()->lastName));
            $refSafe = str_replace('/', '-', $subscription->id);
            $outputPath = storage_path('app/generated/' . strtolower("facture N " . $refSafe . " " . $adherent->nom . " " . $adherent->prenom) . '.docx');
            $templateProcessor->saveAs($outputPath);
            if (!file_exists($outputPath)) {
                return ApiResponse::error('Erreur génération document', 500);
            }
            $filename = "recus--{$adherent->lastName}-{$adherent->firstName}--{$subscription->id}--" . now()->format('YmdHis') . '.docx';

            return response()
                ->download($outputPath, $filename, [
                    'Content-Type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'Content-Disposition' => "attachment; filename*=UTF-8''" . rawurlencode($filename)
                ])
                ->deleteFileAfterSend(true);
            return response()->download($outputPath)->deleteFileAfterSend(true);
        } catch (\PhpOffice\PhpWord\Exception\Exception $e) {
            return ApiResponse::error('Erreur génération Word: ' . $e->getMessage(), 500);
        } catch (\Exception $e) {
            return ApiResponse::error('Erreur serveur: ' . $e->getMessage(), 500);
        }
    }
    public function DownloadRecuPeriode(Request $request, $periodeId)
    {
        try {
            $periode = Periode::findOrFail($periodeId);
            $adherent = Adherent::with("branche.ville")->findOrFail($periode->adherentId);
            if (empty($adherent)) {
                return ApiResponse::error("Adherent non trouvé", 404);
            }
            if (empty($periode)) {
                return ApiResponse::error("Periode non trouvé", 404);
            }

            $templatePath = storage_path('app/templates/recuPeriode.docx');
            $templateProcessor = new TemplateProcessor($templatePath);
            $templateProcessor->setValue('date', now()->toDateString());
            $templateProcessor->setValue('adherent_id', $adherent->id . "RP" . $periode->id);
            $templateProcessor->setValue('cin', $adherent->cin ?? "Pas disponible");
            $templateProcessor->setValue('adherent_nom_complet', $adherent->firstName . " " . $adherent->lastName);
            $templateProcessor->setValue('tel', $adherent->phonePrimary);
            $templateProcessor->setValue('price', $periode->price);
            $templateProcessor->setValue('duree', $periode->durationDays);
            $templateProcessor->setValue('startDate', $periode->startDate);
            $templateProcessor->setValue('endDate', $periode->endDate);
            $templateProcessor->setValue('staff_nom_complet',  strtoupper($request->user()->firstName . " " . $request->user()->lastName));
            $refSafe = str_replace('/', '-', $periode->id);
            $outputPath = storage_path('app/generated/' . strtolower("recus N " . $refSafe . " " . $adherent->nom . " " . $adherent->prenom) . '.docx');
            $templateProcessor->saveAs($outputPath);
            if (!file_exists($outputPath)) {
                return ApiResponse::error('Erreur génération document', 500);
            }
            $filename = "recus--{$adherent->lastName}-{$adherent->firstName}--{$periode->id}--" . now()->format('YmdHis') . '.docx';

            return response()
                ->download($outputPath, $filename, [
                    'Content-Type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'Content-Disposition' => "attachment; filename*=UTF-8''" . rawurlencode($filename)
                ])
                ->deleteFileAfterSend(true);
            return response()->download($outputPath)->deleteFileAfterSend(true);
        } catch (\PhpOffice\PhpWord\Exception\Exception $e) {
            return ApiResponse::error('Erreur génération Word: ' . $e->getMessage(), 500);
        } catch (\Exception $e) {
            return ApiResponse::error('Erreur serveur: ' . $e->getMessage(), 500);
        }
    }
    public function DownloadAllUsersAsExcelFile(Request $request)
    {
        try {
            return Excel::download(new ExportAll(), 'All_Adherents.xlsx');
        } catch (\Exception $e) {
            return ApiResponse::error('Erreur serveur: ' . $e->getMessage(), 500);
        }
    }
    public function DownloadUsersByFilters(Request $request)
    {
        try {
            $query = DB::table("adherents")->select("id", "cin", "firstName", "lastName", "phonePrimary", "registrationDate", "gender");
            if ($request->gender != "all") {
                $query->where("gender", "=", $request->gender);
            }
            if ($request->dateType != "none") {

                if ($request->dateType == "specific") {
                    $query->whereDate("registrationDate", $request->specificDate);
                } else if ($request->dateType == "period") {
                    $query->whereBetween("registrationDate", [
                        $request->dateFrom,
                        $request->dateTo
                    ]);
                }
            }
            $adherents = $query->get();
            return Excel::download(new ExportByFilters($adherents), "adherents.xlsx");
        } catch (Exception $e) {
            return ApiResponse::error('Erreur serveur: ' . $e->getMessage(), 500);
        }
        // return response()->json($request->dateType);
    }
}
