"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VilleSchemaData, VilleSchema } from "@/lib/validators/villes";
import { toast } from "react-toastify";
import Loader from "@/components/ui/loader";

type Props = {
    ville: VilleSchema;
    onClose: () => void;
    onSubmit: (updatedVille: VilleSchema) => void;
    isEditingVille: (value: boolean) => void
};

export default function ModalEditVille({ ville, onClose, onSubmit, isEditingVille }: Props) {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<VilleSchema>({
        resolver: zodResolver(VilleSchemaData),
        defaultValues: ville,
    });
    useEffect(() => {
        reset(ville);
    }, [ville, reset]);

    const onFormSubmit = async (data: VilleSchema) => {
        await onSubmit(data);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg relative overflow-hidden">
                {isSubmitting && (<Loader/>)}

                <h2 className="text-lg font-bold mb-4">Modifier la ville</h2>

                <form onSubmit={handleSubmit(onFormSubmit)}>
                    <div className="mb-3">
                        <label className="block font-semibold mb-1">Nom</label>
                        <input {...register("name")} className="w-full border rounded px-3 py-2" />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>

                    <div className="mb-3">
                        <label className="block font-semibold mb-1">Région</label>
                        <input {...register("region")} className="w-full border rounded px-3 py-2" />
                        {errors.region && <p className="text-red-500 text-sm">{errors.region.message}</p>}
                    </div>

                    <div className="mb-3">
                        <label className="block font-semibold mb-1">Code postal</label>
                        <input {...register("codePostal")} className="w-full border rounded px-3 py-2" />
                        {errors.codePostal && <p className="text-red-500 text-sm">{errors.codePostal.message}</p>}
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
                        >
                            Modifier
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );


}
