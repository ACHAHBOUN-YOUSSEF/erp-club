"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { villesService } from "@/services/villesService"
import { VilleSchema, VilleSchemaData } from "@/lib/validators/villes"
export default function NewVille({ onSuccess }: { onSuccess?: () => void }) {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<VilleSchema>({ resolver: zodResolver(VilleSchemaData) })

    const onSubmit = async (data: VilleSchema) => {
        try {
            const res=await villesService.create(data)            
            toast.success(res.message)
            reset()
            if (onSuccess) onSuccess()
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
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4 border-2 border-white p-6 rounded-xl shadow-lg mx-auto"
            >
                {/* Nom */}
                <input
                    type="text"
                    placeholder="Nom de la ville"
                    {...register("name")}
                    className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white placeholder-gray-400"
                />
                {errors.name && (
                    <span className="text-red-500 text-sm">{errors.name.message}</span>
                )}
                <input
                    type="text"
                    placeholder="Région"
                    {...register("region")}
                    className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white placeholder-gray-400"
                />
                {errors.region && (
                    <span className="text-red-500 text-sm">{errors.region.message}</span>
                )}
                <input
                    type="number"
                    placeholder="Code postal"
                    {...register("codePostal", { valueAsNumber: true })}
                    className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white placeholder-gray-400"
                />
                {errors.codePostal && (
                    <span className="text-red-500 text-sm">{errors.codePostal.message}</span>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-red-600 text-white p-3 rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50"
                >
                    {isSubmitting ? "Création..." : "Créer"}
                </button>
            </form>
        </>
    )
}
