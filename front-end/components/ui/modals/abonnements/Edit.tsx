import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Loader from "../../loader";
import { AbonnementSchema, AbonnementType } from "@/lib/validators/abonnements";
import { AbonnementsService } from "@/services/abonnementService";
import { GroupeAbonnementType } from "@/lib/validators/groupeAbonnements";
type props = {
    onClose: () => void;
    groupes: GroupeAbonnementType[];
    abonnement: AbonnementType
}
export default function EditAbonnement({ onClose, groupes, abonnement }: props) {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<AbonnementType>({ resolver: zodResolver(AbonnementSchema), defaultValues: abonnement })
    const onSubmit = async (abonnement: AbonnementType) => {

        try {
            const res = await AbonnementsService.update(abonnement,Number(abonnement.id))
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
                        Modifier un abonnement
                        <X className="cursor-pointer" onClick={() => onClose()} />
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto px-6 pb-6 pr-4">
                        <div className="mb-3">
                            <label className="block font-semibold mb-1">Nom d'abonnement</label>
                            <input type="text" {...register("title")} className="focus:bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5 pr-10 " placeholder="Nom d'abonnement..." />
                            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                        </div>

                        <div className="mb-3">
                            <label className="block font-semibold mb-1">La durée en mois </label>
                            <input type="number" min={1}{...register("durationMonths")} className="focus:bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5 pr-10 " placeholder="La durée en mois ..." />
                            {errors.durationMonths && <p className="text-red-500 text-sm">{errors.durationMonths.message}</p>}
                        </div>
                        <div className="mb-3">
                            <label className="block font-semibold mb-1">Prix d'abonnement</label>
                            <input type="number" min={1} {...register("price")} className="focus:bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5 pr-10 " placeholder="Prix d'abonnement..." />
                            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
                        </div>
                        <div className="mb-3">
                            <label className="block font-semibold mb-1">Groupe d'abonnement</label>
                            <select
                                  defaultValue={abonnement.groupe.id?? ""}
                                {...register("groupeId")} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5">
                                <option value="">-- Choisir un club --</option>
                                {groupes.length > 0 ? (
                                    groupes.map((groupe) => (
                                        <option key={groupe.id} value={groupe.id}>
                                            {groupe.name.toUpperCase()}
                                        </option>
                                    ))
                                ) : (
                                    <option value="">Aucune club trouvée</option>
                                )}
                            </select>
                            {errors.groupeId && (
                                <p className="text-red-500 text-sm">{errors.groupeId.message}</p>
                            )}
                        </div>
                        <div className="flex justify-center gap-2 mt-4">
                            <button type="button" onClick={onClose} className="px-4 py-2 cursor-pointer bg-gray-300 rounded disabled:opacity-50">
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
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