import { clubType } from "@/lib/validators/clubs";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Loader from "../../loader";
import { GroupeAbonnements, GroupeAbonnementType } from "@/lib/validators/groupeAbonnements";
import { groupeAbonnementsService } from "@/services/groupeAbonnementsService";
type props = {
    onClose: () => void;
    clubs: clubType[],
    groupe: GroupeAbonnementType
}
export default function EditGroupe({ onClose, clubs, groupe }: props) {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<GroupeAbonnementType>({ resolver: zodResolver(GroupeAbonnements)as any, defaultValues: groupe })
    const onSubmit = async (groupe: GroupeAbonnementType) => {
        try {
            const res = await groupeAbonnementsService.update(groupe, Number(groupe.id))
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
                        Modifier un groupe
                        <X className="cursor-pointer" onClick={() => onClose()} />
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto px-6 pb-6 pr-4">
                        <div className="mb-3">
                            <label className="block font-semibold mb-1">Nom de groupe</label>
                            <input type="text" {...register("name")} className="focus:bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5 pr-10 " placeholder="Nom de groupe..." />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name?.message}</p>}
                        </div>

                        <div className="mb-3">
                            <label className="block font-semibold mb-1">Type de groupe</label>
                            <input type="text" {...register("type")} className="focus:bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5 pr-10 " placeholder="Type de groupe ..." />
                            {errors.type && <p className="text-red-500 text-sm">{errors.type?.message}</p>}
                        </div>
                        <div className="mb-3">
                            <label className="block font-semibold mb-1">Description de groupe</label>
                            <input type="text" {...register("description")} className="focus:bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5 pr-10 " placeholder="Description de groupe..." />
                            {errors.description && <p className="text-red-500 text-sm">{errors.description?.message}</p>}
                        </div>
                        <div className="mb-3 flex items-center gap-2">
                            <input
                                type="checkbox"
                                {...register("isArchived")}
                                defaultChecked={!!groupe?.isArchived}
                                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                            />


                            <label className="font-semibold">Groupe dans archive</label>
                            {errors.isArchived && (
                                <p className="text-red-500 text-sm">{errors.isArchived.message}</p>
                            )}
                        </div>
                        <div className="mb-3">
                            <label className="block font-semibold mb-1">club du groupe</label>
                            <select {...register("brancheId")} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5">
                                <option value="">-- Choisir un club --</option>
                                {clubs.length > 0 ? (
                                    clubs.map((club) => (
                                        <option key={club.id} value={club.id}>
                                            {club.name.toUpperCase()}
                                        </option>
                                    ))
                                ) : (
                                    <option value="">Aucune club trouvée</option>
                                )}
                            </select>
                            {errors.brancheId && (
                                <p className="text-red-500 text-sm">{errors.brancheId.message}</p>
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
                                {isSubmitting ? "En cours..." : "Modifier"}

                            </button>
                        </div>
                    </form>

                </div>
            </div>

        </>
    )
}