"use client";
import { Edit, Trash } from "lucide-react";
import { useState } from "react";
import { VilleSchema as Ville } from "@/lib/validators/villes";
import { villesService } from "@/services/villesService";
import { toast } from "react-toastify";
import ModalEditVille from "../modals/villes/edit";
import ModalDeleteVille from "../modals/villes/delete";

type Props = {
    villes: Ville[];
    loading: boolean;
    onDelete: (id: number) => void;
    onUpdate: (updatedVille: Ville) => void;
    isBusy: (value: boolean) => void
};

export default function VillesTables({ villes, loading, onDelete, onUpdate, isBusy }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [editVille, setEditVille] = useState<Ville | null>(null);
    const [modalEditOpen, setModalEditOpen] = useState(false);
    const [editingVille, setIsEditingVille] = useState(false)
    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setModalDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        setIsDeleting(true);
        try {
            await onDelete(deleteId);
            setModalDeleteOpen(false);
            setDeleteId(null);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEditClick = async (id: number) => {
        isBusy(true)
        try {
            const res = await villesService.getById(id);
            const ville = res.data;
            setEditVille(ville);
            setModalEditOpen(true);
        } catch (error) {
            toast.error("Erreur lors de la récupération de la ville :");
        } finally {
            isBusy(false)
        }
    };
    const handleEditSubmit = async (updatedVille: Ville) => {

        setIsEditingVille(true)
        try {
            const res = await villesService.update(updatedVille.id!, updatedVille);
            toast.success(res.message);
            onUpdate(updatedVille);
            setModalEditOpen(false);
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as any;
                const errors = axiosError.response?.data?.errors;

                // ✅ FIX : Typage explicite
                if (errors && typeof errors === 'object' && !Array.isArray(errors)) {
                    const errorObj = errors as Record<string, string[]>;
                    const firstError = Object.values(errorObj)[0]?.[0];
                    if (typeof firstError === 'string') {
                        toast.error(firstError);
                    }
                }
            }
        }


    };


    return (
        <>
            <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-lg border border-default">
                <table className="text-sm w-full text-left rtl:text-right text-body">
                    <thead className="bg-neutral-secondary-soft border-b border-default">
                        <tr className="bg-red-500 text-white">
                            <th className="px-3 py-2 text-center font-bold">Nom</th>
                            <th className="px-3 py-2 text-center font-bold">Region</th>
                            <th className="px-3 py-2 text-center font-bold">Code Postal</th>
                            <th className="px-3 py-2 text-center font-bold">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr key="loader">
                                <td colSpan={4} className="text-center py-2">
                                    <div className="w-8 h-8 border-4 border-t-red-500 border-white rounded-full animate-spin mx-auto"></div>
                                </td>
                            </tr>
                        ) : villes.length > 0 ? (
                            villes.map((v) => (
                                <tr
                                    key={v.id}
                                    className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default hover:bg-red-200 transition duration-75"
                                >
                                    <th className="py-1 font-bold text-center whitespace-nowrap">{v.name}</th>
                                    <td className="py-1 font-bold text-center">{v.region}</td>
                                    <td className="py-1 font-bold text-center">{v.codePostal}</td>
                                    <td className="py-1 flex items-center justify-center">
                                        <button
                                            className="cursor-pointer m-1 hover:text-red-500"
                                            onClick={() => handleEditClick(Number(v.id))}
                                        >
                                            <Edit />
                                        </button>
                                        <button
                                            className="cursor-pointer m-1 hover:text-red-500"
                                            onClick={() => handleDeleteClick(Number(v.id))}
                                        >
                                            <Trash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default hover:bg-red-200 transition duration-75">
                                <th colSpan={4} className="py-1 font-bold text-center whitespace-nowrap">
                                    Aucune ville trouvée
                                </th>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal suppression */}
            {modalDeleteOpen && (
                <ModalDeleteVille
                    open={modalDeleteOpen}
                    onClose={() => setModalDeleteOpen(false)}
                    onConfirm={confirmDelete}
                    loading={isDeleting}
                />

            )}

            {/* Modal édition */}
            {modalEditOpen && editVille && (
                <ModalEditVille
                    ville={editVille}
                    onClose={() => setModalEditOpen(false)}
                    onSubmit={handleEditSubmit}
                    isEditingVille={setIsEditingVille}
                />
            )}


        </>
    );
}
