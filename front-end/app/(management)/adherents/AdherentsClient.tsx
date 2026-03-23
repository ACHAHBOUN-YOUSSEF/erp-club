"use client";
import { Plus, Trash2, Filter, FilePlus, Edit, UserCircle, Download, Slash, XCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { clubsService } from "@/services/clubs.Service"
import { Suspense, useEffect, useState } from "react"
import { toast } from "react-toastify"
import { clubType } from "@/lib/validators/clubs"

import Spinner from "@/components/ui/spinner"
import { adherentType } from "@/lib/validators/adherents"
import { ServiceAdherent } from "@/services/adherentsService"
import Link from "next/link"
import Create from "@/components/ui/modals/adherents/create"
import DeleteAdherent from "@/components/ui/modals/adherents/delete"
import NewSubscription from "@/components/ui/modals/subscriptions/create";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/components/ui/components/Pagination";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import EditAdherent from "@/components/ui/modals/adherents/edit";
import { downloadBlob } from "@/helpers/helpers";
import { FilesService } from "@/services/filesServices";

export default function AdherentsClient() {
    const [clubs, setClubs] = useState([])
    const [adherents, setAdherents] = useState<adherentType[]>()
    const [isBusy, setIsBusy] = useState(false)
    const [isOpneModalAddAdherent, setIsOpneModalAddAdherent] = useState(false)
    const [isOpneModalEditAdherent, setIsOpneModalEditAdherent] = useState(false)
    const [isOpneModalDeleteAdherent, setIsOpneModalDeleteAdherent] = useState(false)
    const [isOpneModalNewSubscription, setisOpneModalNewSubscription] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [AherentIdToDelete, setAherentIdToDelete] = useState<number | null>(null)
    const [adherentId, setAdherentId] = useState<number>()
    const [adherentToEdit, setAdherentToEdit] = useState<adherentType | null>(null)
    const [selectedClubId, setSelectedClubId] = useState<number | null>(null);
    useEffect(() => {
        const clubParam = searchParams.get('club');
        if (clubParam) {
            setSelectedClubId(Number(clubParam));
        }
    }, []);
    const router = useRouter()
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 15,
        has_next: false,
        has_prev: false
    })
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const currentPage = Number(searchParams.get('page')) || 1;
    const handleEdit = async (id: number) => {
        try {
            setIsBusy(true)
            const res = await ServiceAdherent.get(id)
            setAdherentToEdit(res.data)
            setIsOpneModalEditAdherent(true)
            setIsBusy(false)
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
            setIsBusy(false)
        }
    }

    const loadClubs = async () => {
        try {
            const res = await clubsService.getAll()
            setClubs(res.data)

        } catch (err: any) {
            toast.error("Erreur lors de telechargement de clubs")
        }
    }
    const handleDelete = (id: number) => {
        setAherentIdToDelete(id)
        setIsOpneModalDeleteAdherent(true)
    }
    const loadAllAdherents = async () => {
        setIsBusy(true);
        try {
            const params = new URLSearchParams({ page: currentPage.toString() });
            const res = await ServiceAdherent.getAll(`?${params}`);

            setAdherents(res.data.data || []);           // ✅ Tableau paginé
            setPagination(res.data.pagination || {});    // ✅ Meta pagination
        } catch (error) {
            toast.error("Erreur lors du téléchargement des adhérents");
            setAdherents([]);
        }
        setIsBusy(false);
    };
    const confirmDelete = async () => {
        setIsDeleting(true)
        try {
            const res = await ServiceAdherent.delete(Number(AherentIdToDelete))
            toast.success(res.message)
            setIsDeleting(false)
            setIsOpneModalDeleteAdherent(false)
            setAdherents(adherents?.filter((adherent) => adherent.id != AherentIdToDelete))

        } catch (err: any) {
            const backendErrors = err.response.data.errors;
            if (backendErrors) {
                const firstFieldErrors = Object.values(backendErrors)[0] as string[];
                if (firstFieldErrors && firstFieldErrors.length > 0) {
                    toast.error(firstFieldErrors[0]);
                }
            } else {
                toast.error("Erreur de suppresion inconnue");
            }
            setIsDeleting(false)
        }
    }
    useEffect(() => {
        loadClubs()
        if (isBusy) return;
        loadAllAdherents()
    }, [currentPage, selectedClubId])
    const DownloadAllUsersAsExcelFile = async () => {
        setIsBusy(true);
        try {
            const response = await FilesService.DownloadAllUsersAsExcelFile();
            let filename = `All_Adherents.xlsx`
            downloadBlob(response.data, filename);
            toast.success('Ficher téléchargé !');
        } catch (err) {
            toast.error('Probléme téléchargement');
        } finally {
            setIsBusy(false);
        }
    }

    return (
        <>
            <div className="bg-red-100 dark:bg-black m-2 p-2 rounded-lg">
                {isBusy && <Spinner />}
                <div className="mt-3">
                    <div className="relative overflow-x-auto shadow rounded-lg border">
                        <div className="p-2 flex items-center justify-start gap-4">
                            {/* --- Dropdown --- */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="cursor-pointer gap-2">
                                        <Filter size={16} />
                                        Clubs ({selectedClubId ? 'Filtré' : 'Tous'})
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="start" className="w-56 max-h-60 overflow-auto">
                                    <DropdownMenuItem
                                        // onClick={() => {
                                        //     setSelectedClubId(null);
                                        //     router.push(`?page=1`);
                                        // }}
                                        className={`cursor-pointer ${!selectedClubId ? 'bg-red-100 text-red-800 font-semibold' : ''}`}
                                    >
                                        🎯 Tous les clubs
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />
                                    {clubs.length > 0 ? (
                                        clubs.map((club: clubType) => (
                                            <DropdownMenuItem
                                                key={club.id!}
                                                className={`... ${selectedClubId === club.id ? 'bg-red-100 text-red-800' : ''}`}
                                            >
                                                {club.name.toUpperCase()}
                                            </DropdownMenuItem>

                                        ))
                                    ) : (
                                        <DropdownMenuItem disabled className="text-gray-400">
                                            Aucun club trouvé
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <div>
                                <button className="cursor-pointer flex items-centery"
                                    onClick={() => setIsOpneModalAddAdherent(true)}
                                >
                                    <Plus />
                                </button>
                            </div>
                            <div>
                                <button className="cursor-pointer flex items-centery"
                                    onClick={() => DownloadAllUsersAsExcelFile()}
                                >
                                    <Download />
                                </button>
                            </div>
                        </div>
                        <div className="relative overflow-x-auto shadow-xs rounded-base border border-default rounded-lg">

                            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className=" bg-gradient-to-r from-red-600 via-red-700 to-red-900 text-white">
                                            <tr>
                                                <th className="px-1.5 py-2 text-center font-bold uppercase text-xs tracking-wider">ID</th>
                                                <th className="px-1.5 py-2 text-center font-bold uppercase text-xs tracking-wider">CIN</th>
                                                <th className="px-1.5 py-2 text-center font-bold uppercase text-xs tracking-wider">Nom Complet</th>
                                                <th className="px-1.5 py-2 text-center font-bold uppercase text-xs tracking-wider">Téléphone</th>
                                                <th className="px-1.5 py-2 text-center font-bold uppercase text-xs tracking-wider">Date d'inscription</th>
                                                <th className="px-1.5 py-2 text-center font-bold uppercase text-xs tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {adherents && adherents.length > 0 ? (
                                                adherents.map((adherent) => (
                                                    <tr
                                                        key={adherent.id}
                                                        className="hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 transition-all duration-200 border-b border-gray-100"
                                                    >
                                                        <td className="px-1  text-center whitespace-nowrap">
                                                            <span className="font-mono bg-gray-100 px-1 py-1 rounded-full text-sm font-semibold">
                                                                {adherent.id}
                                                            </span>
                                                        </td>
                                                        <td className="px-1  text-center whitespace-nowrap">
                                                            <span className="font-mono bg-gray-100 px-1 py-1 rounded-full text-sm font-semibold">
                                                                {adherent.cin?adherent.cin:'--'}
                                                            </span>
                                                        </td>
                                                        <td className="px-1  text-center hover:underline hover:cursor-pointer text-sm text-gray-900">
                                                            <Link
                                                                href={`/adherents/${adherent.id}/fiche`}
                                                                title="Fiche adhérent">
                                                                {adherent.firstName} {adherent.lastName}

                                                            </Link>
                                                        </td>

                                                        <td className="px-1  text-center whitespace-nowrap">
                                                            <span className="text-sm font-mono bg-blue-50 text-blue-800 px-1 py-1 rounded-full">
                                                                {adherent.phonePrimary}
                                                            </span>
                                                        </td>

                                                        <td className="px-1  text-center whitespace-nowrap">
                                                            <span className="text-sm text-gray-600 font-medium">
                                                                {adherent.registrationDate}
                                                            </span>
                                                        </td>

                                                        <td className="px-6 py-2 whitespace-nowrap text-sm">
                                                            <div className="flex space-x-2 justify-center">
                                                                <button
                                                                    onClick={() => { setisOpneModalNewSubscription(true); setAdherentId(adherent.id) }}
                                                                    className="p-1 cursor-pointer text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                                                                    title="Nouvelle souscription"
                                                                >
                                                                    <FilePlus size={20} />
                                                                </button>

                                                                <Link
                                                                    href={`/adherents/${adherent.id}/fiche`}
                                                                    className="p-1 cursor-pointer text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                                                                    title="Fiche adhérent"
                                                                >
                                                                    <UserCircle size={20} />
                                                                </Link>

                                                                <button
                                                                    className="p-1 cursor-pointer text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                                                                    title="Modifier"
                                                                    onClick={() => handleEdit(Number(adherent.id))}
                                                                >
                                                                    <Edit size={20} />
                                                                </button>

                                                                <button
                                                                    onClick={() => handleDelete(Number(adherent.id))}
                                                                    className="p-1 cursor-pointer text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                                                                    title="Supprimer"
                                                                >
                                                                    <Trash2 size={20} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className="text-center py-2 text-gray-500 font-semibold">
                                                        Aucun adhérent trouvé
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* ✅ PAGINATION DEHORS table */}
                                {!isBusy && pagination.last_page > 1 && (
                                    <Suspense fallback={<div>Chargement pagination...</div>}>
                                        <div className="mt-8 w-full flex justify-center px-4 overflow-x-auto">
                                            <Pagination
                                                totalPages={pagination.last_page}
                                                currentPage={pagination.current_page}
                                                pathname={pathname}
                                                searchParams={searchParams}
                                            />
                                        </div>
                                    </Suspense>
                                )}

                            </div>

                        </div>
                    </div>
                </div>
            </div>
            {
                isOpneModalAddAdherent && <Create Cancel={() => setIsOpneModalAddAdherent(false)} onClose={() => loadAllAdherents()} />
            }
            {
                isOpneModalEditAdherent && adherentToEdit && <EditAdherent onClose={() => setIsOpneModalEditAdherent(false)} Cancel={() => setIsOpneModalEditAdherent(false)} adherent={adherentToEdit} />
            }
            {
                isOpneModalDeleteAdherent && <DeleteAdherent loading={isDeleting} onConfirm={confirmDelete} onClose={() => setIsOpneModalDeleteAdherent(false)} />
            }
            {
                isOpneModalNewSubscription && <NewSubscription Cancel={() => setisOpneModalNewSubscription(false)} adherentId={Number(adherentId)} clubs={clubs} onClose={() => { setisOpneModalNewSubscription(false); router.push(`/adherents/${adherentId}/fiche`) }} />
            }
        </>
    )
}
