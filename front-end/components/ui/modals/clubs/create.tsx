import { clubSchema, clubType } from "@/lib/validators/clubs";
import { VilleSchema } from "@/lib/validators/villes";
import { clubsService } from "@/services/clubs.Service";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Loader from "../../loader";
type props = {
    onClose: () => void;
    villes: VilleSchema[]
}
export default function Create({ onClose, villes }: props) {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<clubType>({ resolver: zodResolver(clubSchema) })
    const onSubmit = async (club: clubType) => {
        try {
            const res=await clubsService.create(club)
            toast.success(res.message)
            reset()
            onClose()
        } catch (err:any) {
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
                    {isSubmitting&&(<Loader/>)}
                    <h2 className="text-lg font-bold mb-4 px-4 pt-4 flex justify-between items-center">
                        Ajouter un Club

                        <X className="cursor-pointer" onClick={()=>onClose()}/>
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto px-6 pb-6 pr-4">
                        <div className="mb-3">
                            <label className="block font-semibold mb-1">Nom de Club</label>
                            <input type="text" {...register("name")} className="focus:bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5 pr-10 " placeholder="Nom de club ..." />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                        </div>
                        <div className="mb-3">
                            <label className="block font-semibold mb-1">Adresse de club</label>
                            <input type="text"  {...register("adresse")} className="focus:bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5 pr-10 " placeholder="Nom de club ..." />
                            {errors.adresse && <p className="text-red-500 text-sm">{errors.adresse.message}</p>}
                        </div>
                        <div className="mb-3">
                            <label className="block font-semibold mb-1">Telephone de club</label>
                            <input type="text"  {...register("phone")} className="focus:bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5 pr-10 " placeholder="Telephone de club ..." />
                            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                        </div>
                        <div className="mb-3">
                            <label className="block font-semibold mb-1">E-mail de club</label>
                            <input type="text" {...register("email")} className="focus:bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5 pr-10 " placeholder="E-mail de club ..." />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>
                        <div className="mb-3">
                            <label className="block font-semibold mb-1">Ville de club</label>
                            <select
                                {...register("villeId", { valueAsNumber: true })}
                                defaultValue=""
                                className="focus:bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg
             focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none
             block w-full p-2.5 pr-10"
                            >
                                <option value="" disabled>
                                    Choisir une ville
                                </option>

                                {villes.length > 0 ? (
                                    villes.map((ville) => (
                                        <option key={ville.id} value={ville.id}>
                                            {ville.name.toUpperCase()}
                                        </option>
                                    ))
                                ) : (
                                    <option value="">Aucune ville trouvée</option>
                                )}
                            </select>

                            {errors.villeId && (
                                <p className="text-red-500 text-sm">{errors.villeId.message}</p>
                            )}

                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 cursor-pointer bg-gray-300 rounded disabled:opacity-50"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`cursor-pointer px-4 py-2 bg-red-600 text-white rounded ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"}`}>
                                {isSubmitting ? "En cours..." : "Ajouter"}
                            </button>
                        </div>
                    </form>

                </div>
            </div>

        </>
    )
}