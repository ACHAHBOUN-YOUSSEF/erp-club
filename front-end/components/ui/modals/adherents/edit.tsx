"use client"
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import Loader from "../../loader";
import { adherentSchema, adherentType } from "@/lib/validators/adherents";
import { ServiceAdherent } from "@/services/adherentsService";
type props = {
    onClose: () => void;
    Cancel: () => void;
    adherent: adherentType;
}
export default function EditAdherent({ onClose, Cancel, adherent }: props) {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, } = useForm<adherentType>({ resolver: zodResolver(adherentSchema)as any, defaultValues: adherent })    
    const onSubmit = async (adherent: adherentType) => {
        try {
            const res = await ServiceAdherent.update(adherent.id!, adherent)
            toast.success(res.message)
            reset()
            onClose()
        } catch (err: any) {
            toast.error(err.message || "Erreur serveur")
        }
    }
    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                <div className="bg-white rounded-lg w-96 shadow-lg relative max-h-[97vh] flex flex-col">
                    {isSubmitting && (<Loader />)}
                    <h2 className="text-lg font-bold mb-4 px-4 pt-4 flex justify-between items-center">
                        Modfier un adherent
                        <X className="cursor-pointer" onClick={() => Cancel()} />
                    </h2>
                    <hr />
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="overflow-y-auto px-6 pb-6 p-4">
                        <div className="mb-3 mt-3">
                            <div className="mt-3 space-y-3">
                                <div className="mb-3">
                                    <label className="block font-semibold mb-1">CIN</label>
                                    <input type="text"
                                        {...register("cin")}
                                        className="focus:bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5 pr-10 " placeholder="CIN ..." />
                                    {errors.cin && <p className="text-red-500 text-sm">{errors.cin.message}</p>}
                                </div>
                                <div className="mb-3">
                                    <label className="block font-semibold mb-1">Nom</label>
                                    <input type="text"
                                        {...register("firstName")}
                                        className="focus:bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5 pr-10 " placeholder="Nom ..." />
                                    {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
                                </div>
                                <div className="mb-3">
                                    <label className="block font-semibold mb-1">Prenom</label>
                                    <input type="text"
                                        {...register("lastName")}
                                        className="focus:bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5 pr-10 " placeholder="Prenom ..." />
                                    {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
                                </div>
                                <div className="mb-3">
                                    <label className="block font-semibold mb-1">Telephone</label>
                                    <input type="text"
                                        {...register("phonePrimary")}
                                        className="focus:bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5 pr-10 " placeholder="Telephone ..." />
                                    {errors.phonePrimary && <p className="text-red-500 text-sm">{errors.phonePrimary.message}</p>}
                                </div>
                                <div className="mb-3">
                                    <label className="block font-semibold mb-1">Telephone secondaire </label>
                                    <input type="text"
                                        {...register("phoneSecondary")}
                                        className="focus:bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5 pr-10 " placeholder="Telephone ..." />
                                    {errors.phoneSecondary && <p className="text-red-500 text-sm">{errors.phoneSecondary.message}</p>}
                                </div>
                                <div className="mb-3">
                                    <label className="block font-semibold mb-1">Date Naissance</label>
                                    <input type="date"
                                        {...register("birthDate")}
                                        className="focus:bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5 pr-10 " placeholder="Date Naissance ..." />
                                    {errors.birthDate && <p className="text-red-500 text-sm">{errors.birthDate.message}</p>}
                                </div>
                                <div className="mb-3">
                                    <label className="block font-semibold mb-2">Genre</label>

                                    <div className="flex gap-6">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                value="HOMME"
                                                {...register("gender")}
                                                className="accent-red-600"
                                            />
                                            <span>Homme</span>
                                        </label>

                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                value="FEMME"
                                                {...register("gender")}
                                                className="accent-red-600"
                                            />
                                            <span>Femme</span>
                                        </label>
                                    </div>

                                    {errors.gender && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.gender.message}
                                        </p>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label className="block font-semibold mb-1">Date d'inscription</label>
                                    <input type="date"
                                        {...register("registrationDate")}
                                        className="focus:bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5 pr-10 " placeholder="Date Naissance ..." />
                                    {errors.registrationDate && <p className="text-red-500 text-sm">{errors.registrationDate.message}</p>}
                                </div>
                                <div className="mb-3">
                                    <label className="block font-semibold mb-1">Date fin d'inscription</label>
                                    <input type="date"
                                        {...register("insuranceEndDate")}
                                        className="focus:bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5 pr-10 " placeholder="Date Naissance ..." />
                                    {errors.insuranceEndDate && <p className="text-red-500 text-sm">{errors.insuranceEndDate.message}</p>}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button type="button" onClick={Cancel} className="px-4 py-2 cursor-pointer bg-gray-300 rounded disabled:opacity-50">
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