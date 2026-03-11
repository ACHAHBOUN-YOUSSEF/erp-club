import { TransactionSchema, TransactionType } from "@/lib/validators/transactions";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import Loader from "../../loader";
import { toast } from "react-toastify";
import { transactionService } from "@/services/transactionService";
type props = {
    onClose?: () => void;
    Cancel: () => void;
}
export default function Create({ onClose, Cancel }: props) {
    const { register, handleSubmit, control, formState: { errors, isSubmitting }, reset } = useForm<TransactionType>({ resolver: zodResolver(TransactionSchema) })
    const onSubmit = async (transaction: TransactionType) => {
        try {
            const res = await transactionService.create(transaction)
            toast.success(res.message)
            reset()
            onClose?.()
        } catch (err: any) {
            if (err.response?.status === 422) {
                const backendErrors = err.response.data.errors;
                if (backendErrors) {
                    const firstFieldErrors = Object.values(backendErrors)[0] as string[];
                    if (firstFieldErrors && firstFieldErrors.length > 0) {
                        toast.error(firstFieldErrors[0]);
                    }
                } else {
                    toast.error("Erreur de validation inconnue");
                }
            } else {
                toast.error(err.message || "Erreur serveur");
            }
        }

    }
    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                <div className="bg-white rounded-lg w-96 shadow-lg relative max-h-[97vh] flex flex-col">
                    {isSubmitting && (<Loader />)}
                    <h2 className="text-lg font-bold mb-4 px-4 pt-4 flex justify-between items-center">
                        Crier une Transaction
                        <X className="cursor-pointer" onClick={() => Cancel()} />
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto px-6 pb-6 pr-4">
                        {/* <div className="mb-3">
                            <label className="block font-semibold mb-1">Type de transaction</label>
                            <select defaultValue={"income"} {...register('modePaiement')} className="focus:bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5 pr-10">
                                <option value="income">Revenus</option>
                                <option value="expense ">Dépenses</option>
                            </select>
                            {errors.modePaiement && <p className="text-red-500 text-sm">{errors.modePaiement.message}</p>}
                        </div> */}
                        <div className="mb-3">
                            <label className="block font-semibold mb-1">Montant de transaction</label>
                            <input type="text" {...register("montant")} className="focus:bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5 pr-10 " placeholder="montant..." />
                            {errors.montant && <p className="text-red-500 text-sm">{errors.montant.message}</p>}
                        </div>
                        <div className="mb-3">
                            <label className="block font-semibold mb-1">Mode de paiement</label>
                            <select defaultValue={"ESPECES"}{...register('modePaiement')} className="focus:bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5 pr-10">
                                <option value="ESPECES">ESPECES</option>
                                <option value="VIREMENT">VIREMENT</option>
                                <option value="CHEQUE">CHEQUE</option>
                            </select>
                            {errors.modePaiement && <p className="text-red-500 text-sm">{errors.modePaiement.message}</p>}
                        </div>
                        <div className="mb-3">
                            <label className="block font-semibold mb-1">Date de transaction</label>
                            <input type="datetime-local" {...register("transactionDate")} className="focus:bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5 pr-10 " placeholder="Date de transasction..." />
                            {errors.transactionDate && <p className="text-red-500 text-sm">{errors.transactionDate.message}</p>}
                        </div>
                        <div className="mb-3">
                            <label className="block font-semibold mb-1">Description de transaction</label>
                            <input type="text" {...register("description")} className="focus:bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5 pr-10 " placeholder="Description de transasction..." />
                            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                        </div>
                        <div className="mb-3">
                            <label className="block font-semibold mb-1">ID Adhérent</label>
                            <input type="number" {...register("adherentId")} className="focus:bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5 pr-10 " placeholder="Id Adherent..." />
                            {errors.adherentId && <p className="text-red-500 text-sm">{errors.adherentId.message}</p>}
                        </div>
                        <div className="flex justify-center gap-2 mt-4">
                            <button type="button" onClick={() => Cancel()} className="px-4 py-2 cursor-pointer bg-gray-300 rounded disabled:opacity-50">
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className={`cursor-pointer px-4 py-2 bg-red-600 text-white rounded ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"}`}>
                                {isSubmitting ? "En cours..." : "Crier"}

                            </button>
                        </div>
                    </form>

                </div>
            </div>

        </>
    )
}