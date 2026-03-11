"use client";
import { Plus, Trash2, FilePlus, Edit, UserCircle, CheckCircle } from "lucide-react"
import { clubsService } from "@/services/clubs.Service"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import Spinner from "@/components/ui/spinner"
import { adherentType } from "@/lib/validators/adherents"
import { ServiceAdherent } from "@/services/adherentsService"
import Link from "next/link"
import DeleteAdherent from "@/components/ui/modals/adherents/delete"
import NewSubscription from "@/components/ui/modals/subscriptions/create";
import { useRouter } from "next/navigation";
import EditAdherent from "@/components/ui/modals/adherents/edit";

export default function Abonnements() {
    const [clubs, setClubs] = useState([])
    const [adherents, setAdherents] = useState<adherentType[]>()
    const [isBusy, setIsBusy] = useState(false)
    const [isOpneModalEditAdherent, setIsOpneModalEditAdherent] = useState(false)
    const [isOpneModalDeleteAdherent, setIsOpneModalDeleteAdherent] = useState(false)
    const [isOpneModalNewSubscription, setisOpneModalNewSubscription] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [AherentIdToDelete, setAherentIdToDelete] = useState<number | null>(null)
    const [adherentId, setAdherentId] = useState<number>()
    const [adherentToEdit, setAdherentToEdit] = useState<adherentType | null>(null)
    const [serachable, setSearchable] = useState<boolean>(false);
    const router = useRouter()
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
    const confirmDelete = async () => {
        setIsDeleting(true)
        try {
            const res = await ServiceAdherent.delete(Number(AherentIdToDelete))
            toast.success(res.message)
            setAdherents(adherents?.filter((adherent)=>adherent.id!=adherentId))
            setIsDeleting(false)
            setIsOpneModalDeleteAdherent(false)
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
    const search = async (value: string) => {
        setAdherents([])
        if (value.trim().length < 3) {
            setSearchable(false);
        } else {
            setSearchable(true)
            setIsBusy(true)
            try {
                const res = await ServiceAdherent.search(value)
                setAdherents(res.data);                
                setIsBusy(false)
            } catch (err: any) {
                toast.warn("Probleme de telechargement")
                setIsBusy(false)
            }
            setIsBusy(false)
        }
    };

    useEffect(() => {
        loadClubs()
    }, [])


    return (
        <>
            <div className="bg-red-100 dark:bg-black m-2 p-2 rounded-lg">
                {isBusy && <Spinner />}
                <div className="mt-3">
                    <div className="relative overflow-x-auto shadow rounded-lg border">
                        <div className="p-2 flex flex-col sm:flex-row items-start sm:items-center justify-start gap-4">
                            {/* --- Dropdown --- */}
                            {/* <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="cursor-pointer gap-2">
                                        <Filter size={16} />
                                        Clubs ({selectedClubId ? 'Filtré' : 'Tous'})
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="start" className="w-56 max-h-60 overflow-auto">
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setSelectedClubId(null);
                                            router.push(`?page=1`);
                                        }}
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
                            </DropdownMenu> */}

                            <div>
                                <input onChange={(e) => search(e.target.value)}
                                    type="text" className="bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5 pr-10 " placeholder="Id CIn Nom Prenom Tel" />
                            </div>
                            <div>
                                <CheckCircle
                                    className={`text-${serachable ? 'green-500' : 'gray-500'} w-7 h-7`}
                                />
                            </div>
                        </div>
                        <div className="relative overflow-x-auto shadow-xs rounded-base border border-default rounded-lg">

                            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className=" bg-gradient-to-r from-red-600 via-red-700 to-red-900 text-white">
                                            <tr>
                                                <th className="px-2 py-2 text-center font-bold uppercase text-xs tracking-wider">ID</th>
                                                <th className="px-2 py-2 text-center font-bold uppercase text-xs tracking-wider">CIN</th>
                                                <th className="px-2 py-2 text-center font-bold uppercase text-xs tracking-wider">Nom Complet</th>
                                                <th className="px-2 py-2 text-center font-bold uppercase text-xs tracking-wider">Téléphone</th>
                                                <th className="px-2 py-2 text-center font-bold uppercase text-xs tracking-wider">Date d'inscription</th>
                                                <th className="px-2 py-2 text-center font-bold uppercase text-xs tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {
                                                adherents && adherents.length > 0 ? (
                                                    adherents.map((adherent) => (
                                                        <tr
                                                            key={adherent.id}
                                                            className="hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 transition-all duration-200 border-b border-gray-100"
                                                        >
                                                            <td className="px-1 py-2 text-center whitespace-nowrap">
                                                                <span className="font-mono bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold">
                                                                    {adherent.id}
                                                                </span>
                                                            </td>
                                                            <td className="px-1 py-2 text-center whitespace-nowrap">
                                                                <span className="font-mono bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold">
                                                                    {adherent.cin}
                                                                </span>
                                                            </td>
                                                            <td className="px-1 py-2 text-center font-bold text-lg text-gray-900">
                                                                {adherent.firstName} {adherent.lastName}
                                                            </td>

                                                            <td className="px-1 py-2 text-center whitespace-nowrap">
                                                                <span className="text-sm font-mono bg-blue-50 text-blue-800 px-3 py-1 rounded-full">
                                                                    {adherent.phonePrimary}
                                                                </span>
                                                            </td>

                                                            <td className="px-1 py-2 text-center whitespace-nowrap">
                                                                <span className="text-sm text-gray-600 font-medium">
                                                                    {adherent.registrationDate}
                                                                </span>
                                                            </td>

                                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                                <div className="flex space-x-2 justify-center">
                                                                    <button
                                                                        onClick={() => { setisOpneModalNewSubscription(true); setAdherentId(adherent.id) }}
                                                                        className="p-2.5 cursor-pointer text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                                                                        title="Nouvelle souscription"
                                                                    >
                                                                        <FilePlus size={20} />
                                                                    </button>

                                                                    <Link
                                                                        href={`/adherents/${adherent.id}/fiche`}
                                                                        className="p-2.5 cursor-pointer text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                                                                        title="Fiche adhérent"
                                                                    >
                                                                        <UserCircle size={20} />
                                                                    </Link>

                                                                    <button
                                                                        className="p-2.5 cursor-pointer text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                                                                        title="Modifier"
                                                                        onClick={() => handleEdit(Number(adherent.id))}
                                                                    >
                                                                        <Edit size={20} />
                                                                    </button>

                                                                    <button
                                                                        onClick={() => {handleDelete(Number(adherent.id));setAdherentId(adherent.id)}}
                                                                        className="p-2.5 cursor-pointer text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
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
                                                        <td colSpan={5} className="text-center py-6 text-gray-500 font-semibold">
                                                            Aucun adhérent trouvé
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            {
                isOpneModalEditAdherent && <EditAdherent onClose={() => { setAdherents([]); setIsOpneModalEditAdherent(false) }} Cancel={() => setIsOpneModalEditAdherent(false)} adherent={adherentToEdit} />
            }
            {
                isOpneModalDeleteAdherent && <DeleteAdherent loading={isDeleting} onConfirm={confirmDelete} onClose={() => {setIsOpneModalDeleteAdherent(false) }} />
            }
            {
                isOpneModalNewSubscription && <NewSubscription Cancel={() => setisOpneModalNewSubscription(false)} adherentId={Number(adherentId)} clubs={clubs} onClose={() => { setisOpneModalNewSubscription(false); router.push(`/adherents/${adherentId}/fiche`) }} />
            }
        </>
    )
}
