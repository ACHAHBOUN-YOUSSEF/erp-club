"use client"
import { X } from "lucide-react";
import { toast } from "react-toastify";
import Loader from "../../loader";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubscriptionService } from "@/services/subscrptionService";
import { SubscriptionSchema, SubscriptionType } from "@/lib/validators/subscriptions";
type props = {
    onClose: () => void;
    Cancel:()=>void
    adherentId: number;
    subscription: SubscriptionType
}
export default function EditSubscription({ onClose, adherentId, subscription,Cancel}: props) {
    const { register, handleSubmit, watch, formState: { errors, isSubmitting }, reset } = useForm<SubscriptionType>({ resolver: zodResolver(SubscriptionSchema) as any, defaultValues: subscription })
    const remainingAmountValue = watch("remainingAmount");
    const onSubmit: SubmitHandler<SubscriptionType> = async (subscription: SubscriptionType) => {
        try {            
            const res = await SubscriptionService.update(subscription,Number(subscription.id))
            toast.success(res.message)                        
            reset()
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
                        Modifier une subscription
                        <X className="cursor-pointer" onClick={() => Cancel()} />
                    </h2>
                    <hr />
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="overflow-y-auto px-6 pb-6 p-4">
                        <div className="mb-3 mt-3">
                            <div className="mt-3 space-y-3">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-black">Date de début</label>
                                    <input
                                        {...register("startDate")}
                                        type="date"
                                        className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5"
                                    />
                                    {errors.startDate && (<p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>)}

                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-black">Date de fin</label>
                                    <input
                                        {...register("endDate")}
                                        type="date"
                                        className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5"
                                    />
                                    {errors.endDate && (<p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>)}

                                </div>
                                <div >
                                    <label className="block mb-2 text-sm font-medium text-black">Montant payée</label>
                                    <input type="number" {...register("montant")}
                                        placeholder="montant payé..."
                                        className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5" />
                                    {errors.montant && (<p className="text-red-500 text-sm mt-1">{errors.montant.message}</p>)}

                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-black">Nouveau Reste de paiement (<span className="text-red-600 text-sm mt-2">R.A : {remainingAmountValue || 0} DH</span>)</label>
                                    <input type="number" {...register('NewRemainingAmount')}
                                        placeholder="Reste de paiement..."
                                        className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5" />
                                    {errors.NewRemainingAmount && (<p className="text-red-500 text-sm mt-1">{errors.NewRemainingAmount.message}</p>)}
                                </div>
                                <div className="containers-assurance">
                                    <label className="block mb-2 text-sm font-medium text-black">Mode de paiement</label>
                                    <select {...register('modePaiement')} className="focus:bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5 pr-10">
                                        <option value="ESPECES">ESPECES</option>
                                        <option value="VIREMENT">VIREMENT</option>
                                        <option value="CHEQUE">CHEQUE</option>
                                    </select>
                                    {errors.modePaiement && (<p className="text-red-500 text-sm mt-1">{errors.modePaiement.message}</p>)}
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        {...register("adherentId")}
                                        value={adherentId || ""}
                                        className="hidden"
                                        readOnly
                                        tabIndex={-1}
                                    />
                                </div>
                                {errors.adherentId && (<p className="text-red-500 text-sm mt-1">{errors.adherentId.message}</p>)}

                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <button type="button" onClick={Cancel} className="px-4 py-2 cursor-pointer bg-gray-300 rounded disabled:opacity-50">
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