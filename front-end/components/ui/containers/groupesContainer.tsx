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
            {groupes.map((groupe: GroupeAbonnementType) => {
                if (Number(groupe.isArchived) == 0) {
                    return (
                        <details
                            key={groupe.id}
                            className={`group bg-white rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 h-[${3+(groupe.abonnements?.filter(a => Number(a.isArchived) == 0).length || 0)}00px] overflow-hidden`}
                        >
                            {/* SUMMARY */}
                            <summary className="list-none cursor-pointer outline-none">
                                <div className="flex flex-wrap justify-between gap-3 items-center pb-4 mb-4 border-b border-gray-200">
                                    <h2 className="text-xl sm:text-2xl font-bold text-red-600">
                                        {groupe.name}
                                    </h2>

                                    <div className="flex gap-2">
                                        <button onClick={(e) => { e.preventDefault(); handleEdit(Number(groupe.id)) }} className="cursor-pointer bg-white/60 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm hover:shadow-md">
                                            <Edit size={16} />
                                        </button>

                                        <button onClick={(e) => { e.preventDefault(); handleDelete(Number(groupe.id)) }} className="cursor-pointer bg-white/60 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm hover:shadow-md">
                                            <Trash2 size={16} />
                                        </button>

                                        <button onClick={(e) => {
                                            e.preventDefault();
                                            setModelCreateAbonnement(true)
                                            setGroupeId(Number(groupe.id))
                                        }} className="cursor-pointer bg-white/60 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm hover:shadow-md">
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-600 mb-2">
                                    Type : <span className="font-semibold">{groupe.type}</span>
                                </p>

                                <p className="text-sm text-gray-800 leading-relaxed mb-4">
                                    {groupe.description}
                                </p>

                                <div className="flex cursor-pointer items-center gap-2 text-red-600 text-sm font-semibold hover:text-red-700 transition-colors">
                                    Voir les abonnements ({groupe.abonnements?.filter(a => Number(a.isArchived) == 0).length || 0})
                                    <ChevronDown size={16} className="transition-transform duration-200 group-open:rotate-180" />
                                </div>
                            </summary>

                            {/* CONTENT SCROLLABLE */}
                            <div className="mt-4 max-h-[260px] overflow-y-auto scrollbar-thin scrollbar-thumb-red-300 scrollbar-track-gray-100 pb-2">
                                <div className="space-y-3 min-h-[200px]">
                                    {groupe.abonnements?.map((abonnement) => {
                                        if (Number(abonnement.isArchived) == 0) {
                                            return (
                                                <div
                                                    key={abonnement.id}
                                                    className="flex justify-between items-center bg-gradient-to-r from-red-50/80 to-red-100/50 backdrop-blur-sm border border-red-200/50 p-4 rounded-xl shadow-sm hover:shadow-md hover:border-red-300 transition-all duration-200 group/abon"
                                                >
                                                    {/* LEFT */}
                                                    <div className="flex flex-col flex-1 min-w-0">
                                                        <span className="font-semibold text-gray-800 text-sm truncate">
                                                            {abonnement.title}
                                                        </span>
                                                        <span className="text-xs text-gray-500 mt-1">
                                                            {abonnement.durationMonths} mois
                                                        </span>
                                                    </div>

                                                    {/* PRICE */}
                                                    <div className="text-sm font-bold text-red-600 px-3 py-1 bg-red-100 rounded-full">
                                                        {abonnement.price} DH
                                                    </div>

                                                    {/* ACTIONS */}
                                                    <div className="flex gap-1.5 ml-3 flex-shrink-0">
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault(); e.stopPropagation();
                                                                handleEditAbonnement(abonnement.id)
                                                                setGroupeId(Number(groupe.id))
                                                            }}
                                                            className="bg-red-500 text-white px-2.5 py-1.5 rounded-lg text-xs hover:bg-red-600 transition-all shadow-sm hover:shadow-md flex items-center gap-1"
                                                        >
                                                            <Edit size={14} />
                                                        </button>

                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault(); e.stopPropagation();
                                                                handleDeleteAbonnement(abonnement.id)
                                                            }}
                                                            className="border border-red-500 text-red-500 px-2.5 py-1.5 rounded-lg text-xs hover:bg-red-500 hover:text-white transition-all shadow-sm hover:shadow-md flex items-center gap-1"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        return null;
                                    })}
                                    {(!groupe.abonnements || groupe.abonnements.filter(a => Number(a.isArchived) == 0).length === 0) && (
                                        <div className="text-center py-8 text-gray-400">
                                            <Plus className="mx-auto h-12 w-12 mb-2 opacity-50" />
                                            <p className="text-sm">Aucun abonnement actif</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </details>
                    )
                }
                return null;
            })}
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