"use client"
import { GroupeAbonnementType } from "@/lib/validators/groupeAbonnements";
import { Edit, Plus, Trash2, ChevronDown } from "lucide-react"
import { useState } from "react";
import DeleteGroupe from "../modals/groupes/delete";
import EditGroupe from "../modals/groupes/Edit"
import { groupeAbonnementsService } from "@/services/groupeAbonnementsService";
import { toast } from "react-toastify";
import { clubType } from "@/lib/validators/clubs";
import Create from "../modals/abonnements/Create";
import DeleteAbonnement from "../modals/abonnements/delete";
import { AbonnementsService } from "@/services/abonnementService";
import { AbonnementType } from "@/lib/validators/abonnements";
import EditAbonnement from "../modals/abonnements/Edit";

type props = {
    groupes: GroupeAbonnementType[],
    isBusy: (value: boolean) => void,
    reload: () => void,
    clubs: clubType[]
}
export default function GroupeContainer({ groupes, isBusy, reload, clubs }: props) {
    const [modelOpenDelete, setModelOpenDelete] = useState(false)
    const [groupeIdToDelete, setGroupeIdToDelete] = useState<number | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isDeletingAbonnement, setIsDeletingAbonnement] = useState(false)
    const [AbonnementIdToDelete, setAbonnementIdToDelete] = useState<number | null>(null)
    const [modelOpenDeleteAbonnement, setModelOpenDeleteAbonnement] = useState(false)
    const [OnEditing, setOnEditing] = useState(false)
    const [groupeOnEdit, setGroupeOnEdit] = useState<GroupeAbonnementType>()
    const [modelCreateAbonnement, setModelCreateAbonnement] = useState(false)
    const [modelEditAbonnement, setModelEditAbonnement] = useState(false)
    const [AbonnementToEdit, setAbonnementToEdit] = useState<AbonnementType | null>(null)
    const [GroupeId, setGroupeId] = useState<number>(0)
    const handleDelete = (id: number) => {
        setModelOpenDelete(true)
        setGroupeIdToDelete(id)
    }
    const confirmDelete = async () => {
        setIsDeleting(true)
        try {
            const res = await groupeAbonnementsService.delete(groupeIdToDelete)
            toast.success(res.message)
            setModelOpenDelete(false)
            setIsDeleting(false)
            reload()
        } catch (err: any) {
            const backendErrors = err.response.data.errors;
            if (backendErrors) {
                const firstFieldErrors = Object.values(backendErrors)[0] as string[];
                if (firstFieldErrors && firstFieldErrors.length > 0) {
                    toast.error(firstFieldErrors[0]);
                }
            } else {
                toast.error("Erreur de validation inconnue");
            }
            setIsDeleting(false)
        }
    }
    const handleEdit = async (id: number) => {
        try {
            isBusy(true)
            const res = await groupeAbonnementsService.getById(id)
            setGroupeOnEdit(res.data);
            setOnEditing(true)
            isBusy(false)
        } catch (err: any) {
            if (err.response?.status === 422) {
                const backendErrors = err.response.data.errors;
                if (backendErrors) {
                    const firstFieldErrors = Object.values(backendErrors)[0] as string[];
                    if (firstFieldErrors && firstFieldErrors.length > 0) {
                        toast.error(firstFieldErrors[0]);
                    }
                } else {
                    toast.error("Erreur de telecharement ");
                }
            } else {
                toast.error(err.message || "Erreur serveur");
            }
            isBusy(false)

        }
    }
    const handleDeleteAbonnement = (id: number) => {
        setAbonnementIdToDelete(id)
        setModelOpenDeleteAbonnement(true)
    }
    const confirmDeeteAbonnement = async () => {
        setIsDeletingAbonnement(true)
        try {
            const res = await AbonnementsService.delete(AbonnementIdToDelete)
            toast.success(res.message)
            setModelOpenDeleteAbonnement(false)
            setIsDeletingAbonnement(false)
            reload()
        } catch (err: any) {
            const backendErrors = err.response.data.errors;
            if (backendErrors) {
                const firstFieldErrors = Object.values(backendErrors)[0] as string[];
                if (firstFieldErrors && firstFieldErrors.length > 0) {
                    toast.error(firstFieldErrors[0]);
                }
            } else {
                toast.error("Erreur de validation inconnue");
            }
            setIsDeletingAbonnement(false)
        }
    }
    const handleEditAbonnement = async (id: number) => {
        try {
            isBusy(true)
            const res = await AbonnementsService.getById(id)
            setAbonnementToEdit(res.data);
            setModelEditAbonnement(true)
            isBusy(false)
        } catch (err: any) {
            if (err.response?.status === 422) {
                const backendErrors = err.response.data.errors;
                if (backendErrors) {
                    const firstFieldErrors = Object.values(backendErrors)[0] as string[];
                    if (firstFieldErrors && firstFieldErrors.length > 0) {
                        toast.error(firstFieldErrors[0]);
                    }
                } else {
                    toast.error("Erreur de telecharement ");
                }
            } else {
                toast.error(err.message || "Erreur serveur");
            }
            isBusy(false)

        }

    }
    return (
        <>
            {
                groupes.map((groupe: GroupeAbonnementType) => {
                    if (Number(groupe.isArchived) == 0) {
                        return (
                            <details
                                key={groupe.id}
                                className="group bg-white rounded-2xl  p-5 sm:p-6 transition">
                                {/* SUMMARY */}
                                <summary className="list-none">
                                    <div className="flex flex-wrap justify-between gap-3 items-center">
                                        <h2 className="text-xl sm:text-2xl font-bold text-red-600">
                                            {groupe.name}
                                        </h2>

                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(Number(groupe.id))} className="cursor-pointer bg-white/60 p-2 rounded-lg hover:bg-red-500 hover:text-white transition">
                                                <Edit size={16} />
                                            </button>

                                            <button onClick={() => handleDelete(Number(groupe.id))} className="cursor-pointer bg-white/60 p-2 rounded-lg hover:bg-red-500 hover:text-white transition">
                                                <Trash2 size={16} />
                                            </button>

                                            <button onClick={() => {
                                                setModelCreateAbonnement(true)
                                                setGroupeId(Number(groupe.id))
                                            }
                                            } className="cursor-pointer bg-white/60 p-2 rounded-lg hover:bg-red-500 hover:text-white transition">
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-600 mt-2">
                                        Type : {groupe.type}
                                    </p>

                                    <p className="text-sm text-gray-800 mt-2 leading-relaxed">
                                        {groupe.description}
                                    </p>

                                    <div className="flex cursor-pointer items-center gap-2 mt-3 text-red-600 text-sm font-semibold">
                                        Voir les abonnements
                                        <ChevronDown
                                            size={16}
                                            className="transition-transform group-open:rotate-180"
                                        />
                                    </div>
                                </summary>

                                <div className="mt-4 space-y-3 overflow-x-auto">
                                    {groupe.abonnements?.map((abonnement) => {
                                        if (Number(abonnement.isArchived) == 0) {
                                            return (
                                                <div
                                                    key={abonnement.id}
                                                    className="
                                            flex justify-between items-center
                                            bg-red-50
                                            border border-red-200
                                            p-4 rounded-xl
                                            shadow-sm
                                            hover:shadow-md
                                            transition
                                        "
                                                >
                                                    {/* LEFT */}
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-gray-800 text-sm">
                                                            {abonnement.title}
                                                        </span>

                                                        <span className="text-xs text-gray-500">
                                                            {abonnement.durationMonths} mois
                                                        </span>
                                                    </div>

                                                    {/* PRICE */}
                                                    <div className="text-sm font-bold text-red-600">
                                                        {abonnement.price} DH
                                                    </div>

                                                    {/* ACTIONS */}
                                                    <div className="flex gap-2">
                                                        <button onClick={() => {
                                                            handleEditAbonnement(abonnement.id)
                                                            setGroupeId(Number(groupe.id))
                                                        }} className="bg-red-500 cursor-pointer text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition">
                                                            <Edit size={14} />
                                                        </button>

                                                        <button onClick={() => handleDeleteAbonnement(abonnement.id)} className="border cursor-pointer border-red-500 text-red-500 px-2 py-1 rounded text-xs hover:bg-red-500 hover:text-white transition">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    })}
                                </div>
                            </details>
                        )
                    }
                })
            }
            {
                modelOpenDelete && <DeleteGroupe onClose={() => setModelOpenDelete(false)} loading={isDeleting} onConfirm={confirmDelete} />
            }
            {
                OnEditing && <EditGroupe groupe={groupeOnEdit!} onClose={() => {
                    setOnEditing(false)
                    reload()
                }} clubs={clubs} />
            }
            {
                modelCreateAbonnement && <Create GroupeId={GroupeId} onClose={() => {
                    reload()
                    setModelCreateAbonnement(false)
                }} />
            }
            {
                modelOpenDeleteAbonnement && <DeleteAbonnement loading={isDeletingAbonnement} onConfirm={confirmDeeteAbonnement} onClose={() => setModelOpenDeleteAbonnement(false)} />
            }
            {
                modelEditAbonnement && <EditAbonnement abonnement={AbonnementToEdit!} groupes={groupes} onClose={() => {
                    setModelEditAbonnement(false)
                    reload()
                }} />
            }
        </>
    )
}