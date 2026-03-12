import { useState } from "react"
import { Download, Edit, Trash2, X } from "lucide-react"
import DeleteTransaction from "./delete"
import { transactionService } from "@/services/transactionService"
import { toast } from "react-toastify"
import Spinner from "../../spinner"
import { TransactionType } from "@/lib/validators/transactions"
import EditTransaction from "./edit"
import { FilesService } from "@/services/filesServices"
import { downloadBlob } from "@/helpers/helpers"

type Transaction = {
    id: number
    created_at: string
    updated_at: string
    type: string
    description: string
    montant: string
    modePaiement: string
    transactionDate: string
    adherent: string
    executedByUser?: string
}
type props = {
    transactions?: Transaction[];
    reload: () => void
}
export default function TransactionsHistory({ transactions, reload }: props) {
    const [open, setOpen] = useState(false)
    const [transactionId, setTransactionId] = useState<number | null>(null)
    const [ModalDeleteTransaction, openModalDeleteTransaction] = useState<boolean>(false)
    const [ModalEditTransaction, openModalEditTransaction] = useState<boolean>(false)
    const [isDeleting, setIsDeleting] = useState<boolean>(false)
    const [isBusy, setIsBusy] = useState<boolean>(false)
    const [Transaction, setTransaction] = useState<TransactionType | null>(null)
    const hadnleDelete = (id: number) => {
        openModalDeleteTransaction(true)
        setTransactionId(id)
    }
    const handleEdit = async (id: number) => {
        try {
            setIsBusy(true)
            const res = await transactionService.getById(id)
            setTransaction(res.data);
            openModalEditTransaction(true)
            setIsBusy(false)

        } catch (err: any) {
            if (err.response?.status === 422) {
                const backendErrors = err.response.data.errors;
                if (backendErrors) {
                    const firstFieldErrors = Object.values(backendErrors)[0] as string[];
                    if (firstFieldErrors && firstFieldErrors.length > 0) {
                        toast.error(firstFieldErrors[0]);
                    }
                } else {
                    toast.error("Erreur de telecharement ");
                }
            } else {
                toast.error(err.message || "Erreur serveur");
            }
            setIsBusy(false)

        }
    }
    const confirmDelete = async () => {
        setIsDeleting(true)
        try {
            const res = await transactionService.delete(Number(transactionId))
            toast.success(res.message)
            setIsDeleting(false)
            openModalDeleteTransaction(false)
            reload()
        } catch (err: any) {
            const backendErrors = err.response.data.errors;
            if (backendErrors) {
                const firstFieldErrors = Object.values(backendErrors)[0] as string[];
                if (firstFieldErrors && firstFieldErrors.length > 0) {
                    toast.error(firstFieldErrors[0]);
                }
            } else {
                toast.error("Erreur de suppresion inconnue");
            }
            setIsDeleting(false)
        }
    }
    const DownloadRecu = async (transaction:Transaction) => {
        setIsBusy(true);
        try {
            const response = await FilesService.DownloadRecu(transaction.id);
            let filename = `recus--${transaction.adherent.toLowerCase()}--${transaction.id}.docx`
            downloadBlob(response.data, filename);
            toast.success('Reçu téléchargé !');
        } catch (err) {
            toast.error('Erreur téléchargement');
        } finally {
            setIsBusy(false);
        }
    };

    return (
        <>
            <div
                className="flex items-center gap-2 cursor-pointer select-none"
                onClick={() => setOpen(!open)}
            >
                <h1 className="text-xl font-bold text-red-700">
                    Historique des transactions
                </h1>
            </div>
            {/* Modal */}
            {open && (
                <div
                    className="fixed inset-0 z-50 backdrop-blur-sm bg-black/40 flex items-center justify-center"
                    onClick={() => setOpen(false)}
                >
                    {
                        isBusy && <Spinner />
                    }
                    <div
                        className="bg-white w-11/12 md:w-3/4 lg:w-1/2 max-h-[80vh] overflow-y-auto rounded-2xl p-6 shadow-xl relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Bouton fermeture */}
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-3 right-4 text-gray-500 hover:text-red-700"
                        >
                            <X size={24} />
                        </button>

                        {/* Titre */}
                        <h2 className="text-2xl font-bold text-red-600 mb-4">
                            Historique des transactions
                        </h2>

                        {/* Logs uniquement details + summary */}
                        <div className="space-y-4">
                            {transactions && transactions.map((transaction) => (
                                <details key={transaction.id} className="border border-gray-300 rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
                                    <summary className="cursor-pointer flex justify-between items-center text-gray-900 font-semibold select-none">
                                        <div className="flex flex-col space-y-0.5">
                                            <time dateTime={new Date(transaction.created_at).toLocaleString("FR-fr")}>
                                                <span className="text-sm font-medium text-gray-700">{new Date(transaction.created_at).toLocaleString("FR-fr")}</span>
                                            </time>
                                            <span className="text-gray-500 text-sm">{transaction.executedByUser}</span>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <span className="text-lg font-semibold text-red-600">{transaction.montant} DH</span>

                                            {
                                                transaction.created_at &&
                                                transaction.updated_at &&
                                                transaction.created_at !== transaction.updated_at && (
                                                    <span
                                                        className="text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full px-3 py-1 select-none shadow-sm"
                                                    >
                                                        Éditée
                                                    </span>
                                                )
                                            }
                                        </div>
                                    </summary>
                                    <div className="mt-4 border-l-4 border-red-500 pl-4 text-gray-700 space-y-3">
                                        <p><strong>Description :</strong> {transaction.description}</p>
                                        <p><strong>Date de transaction :</strong> {new Date(transaction.transactionDate).toLocaleString("FR-fr")}</p>
                                        <p><strong>Montant :</strong> {transaction.montant} DH</p>
                                        <p><strong>Mode de paiement :</strong> {transaction.modePaiement}</p>
                                        <p><strong>Par :</strong> {transaction.executedByUser ?? 'Système'}</p>
                                        <div className="flex flex-col sm:flex-row justify-end mt-4 gap-3">
                                            <button onClick={() => handleEdit(transaction.id)} className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-600 hover:text-white transition-all duration-200 text-sm sm:text-base">
                                                <Edit />
                                            </button>
                                            <button
                                                onClick={() => hadnleDelete(transaction.id)}
                                                className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-600 hover:text-white transition-all duration-200 text-sm sm:text-base">
                                                <Trash2 />
                                            </button>
                                            <button
                                                onClick={() => DownloadRecu(transaction)}
                                                className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-600 hover:text-white transition-all duration-200 text-sm sm:text-base">
                                                <Download />
                                            </button>
                                        </div>
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {
                ModalDeleteTransaction && <DeleteTransaction onConfirm={confirmDelete} loading={isDeleting} onClose={() => openModalDeleteTransaction(false)} />
            }
            {
                ModalEditTransaction &&Transaction&& <EditTransaction onClose={() => openModalEditTransaction(false)} reload={reload} transaction={Transaction} />
            }
        </>
    )
}