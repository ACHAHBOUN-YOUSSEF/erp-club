"use client"

import { Edit, Plus, Trash2, ChevronDown, Filter } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { clubsService } from "@/services/clubs.Service"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { clubType } from "@/lib/validators/clubs"
import { groupeAbonnementsService } from "@/services/groupeAbonnementsService"
import Spinner from "@/components/ui/spinner"
import { GroupeAbonnementType } from "@/lib/validators/groupeAbonnements"
import Create from "@/components/ui/modals/groupes/Create"
import GroupeContainer from "@/components/ui/containers/groupesContainer"

export default function Abonnements() {
    const [clubs, setClubs] = useState([])
    const [isBusy, setIsBusy] = useState(false)
    const [groupes, setGroupes] = useState<GroupeAbonnementType[]>([])
    const [isOpneModalCreateGroupe, setIsOpneModalCreateGroupe] = useState(false)
    const loadGroupesByClubId = async (clubId: number) => {
        setIsBusy(true)
        try {
            const res = await groupeAbonnementsService.getGroupesByClubId(clubId)
            setGroupes(res.data)
        } catch (error) {
            toast.error("Erreur lors de la suppresion de Ville")
        }
        setIsBusy(false)
    }
    const loadClubs = async () => {
        try {
            const res = await clubsService.getAll()
            setClubs(res.data)

        } catch (err: any) {
            toast.error("Erreur lors de telechargement de clubs")
        }
    }
    const loadAllGroupes = async () => {
        setIsBusy(true)
        try {
            const res = await groupeAbonnementsService.getAll()
            setGroupes(res.data)
        } catch (error) {
            toast.error("Erreur lors de la telecharegement des clubs")
        }
        setIsBusy(false)
    }
    useEffect(() => {
        loadClubs()
        loadAllGroupes()
    }, [])


    return (
        <>
            <div className="bg-red-100 dark:bg-black m-2 p-2 rounded-lg">
                {isBusy && <Spinner />}
                <div className="mt-3">
                    <div className="relative overflow-x-auto shadow rounded-lg border">
                        <div className="p-2 flex flex-col sm:flex-row items-start sm:items-center justify-start gap-4">
                            {/* --- Dropdown --- */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="cursor-pointer gap-2">
                                        <Filter size={16} />
                                        Clubs
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="start" className="w-40">
                                    {clubs.length > 0 ? (
                                        clubs.map((club: clubType, index) => (
                                            <DropdownMenuItem
                                                key={index} onClick={() => loadGroupesByClubId(club.id!)}
                                                className="whitespace-nowrap overflow-hidden text-ellipsis"
                                            >
                                                {club.name.toUpperCase()}
                                            </DropdownMenuItem>


                                        ))
                                    ) : (
                                        <DropdownMenuItem disabled>Aucune club trouvé</DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem >STARGYM LAAYOUNE</DropdownMenuItem>

                                </DropdownMenuContent>

                            </DropdownMenu>
                            <div>
                                <button className="cursor-pointer flex items-centery"
                                    onClick={() => setIsOpneModalCreateGroupe(true)}
                                >
                                    <Plus />
                                </button>
                            </div>
                        </div>
                        <div className="relative overflow-x-auto shadow-xs rounded-base border border-default rounded-lg">
                            <div className=" p-4 sm:p-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-start">
                                    <GroupeContainer reload={()=>loadAllGroupes()} clubs={clubs} isBusy={(value)=>setIsBusy(value)} groupes={groupes} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isOpneModalCreateGroupe && <Create clubs={clubs} onClose={() => {
                setIsOpneModalCreateGroupe(false)
                loadAllGroupes()
            }} />}
        </>
    )
}
