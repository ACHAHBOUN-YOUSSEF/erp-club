"use client"
import { X } from "lucide-react";
import { toast } from "react-toastify";
import Loader from "../../loader";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionSchema, TransactionType } from "@/lib/validators/transactions";
import { transactionService } from "@/services/transactionService";
type props = {
    onClose: () => void;
    transaction: TransactionType;
    reload:()=>void
}
export default function EditTransaction({ onClose, transaction ,reload}: props) {
    const { register, handleSubmit,  formState: { errors, isSubmitting }, reset } =useForm<TransactionType>({resolver: zodResolver(TransactionSchema),defaultValues: transaction});
    const onSubmit: SubmitHandler<TransactionType> = async (transaction: TransactionType) => {
        try {
            const res = await transactionService.update(transaction,Number(transaction.id))
            toast.success(res.message)                        
            reset()
            reload()
            onClose()
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
                        Modifier une transaction
                        <X className="cursor-pointer" onClick={() => onClose()} />
                    </h2>
                    <hr />
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="overflow-y-auto px-6 pb-6 p-4">
                        <div className="mb-3 mt-3">
                            <div className="mt-3 space-y-3">
                                <div >
                                    <label className="block mb-2 text-sm font-medium text-black">Montant payée</label>
                                    <input type="number"
                                        {...register("montant")}
                                        placeholder="montant payé..."
                                        className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5" />
                                    {errors.montant && (<p className="text-red-500 text-sm mt-1">{errors.montant.message}</p>)}
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-black">Mode de paiement</label>
                                    <select {...register('modePaiement')} className="focus:bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5 pr-10">
                                        <option value="ESPECES">ESPECES</option>
                                        <option value="VIREMENT">VIREMENT</option>
                                        <option value="CHEQUE">CHEQUE</option>
                                    </select>
                                    {errors.modePaiement && (<p className="text-red-500 text-sm mt-1">{errors.modePaiement.message}</p>)}
                                </div>
                                <div >
                                    <label className="block mb-2 text-sm font-medium text-black">Date de transaction</label>
                                    <input type="text"
                                        {...register("transactionDate")}
                                        placeholder="Date de transaction..."
                                        className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5" />
                                    {errors.transactionDate && (<p className="text-red-500 text-sm mt-1">{errors.transactionDate.message}</p>)}
                                </div>
                                <div>
                                    <input type="text" className="hidden" {...register("adherentId")} name="" id="" />
                                </div>
                                <div >
                                    <label className="block mb-2 text-sm font-medium text-black">Date de description</label>
                                    <input type="text"
                                        {...register("description")}
                                        placeholder="Description de transaction..."
                                        className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5" />
                                    {errors.description && (<p className="text-red-500 text-sm mt-1">{errors.description.message}</p>)}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <button type="button" onClick={onClose} className="px-4 py-2 cursor-pointer bg-gray-300 rounded disabled:opacity-50">
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className={`cursor-pointer px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"`}>
                                Modifier
                            </button>
                        </div>
                    </form>

                </div >
            </div >

        </>
    )
}