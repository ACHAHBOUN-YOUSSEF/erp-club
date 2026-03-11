"use client"
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, } from "@/components/ui/dropdown-menu"
import { Filter, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { clubsService } from "@/services/clubs.Service";
import { clubType } from "@/lib/validators/clubs";
import Create from "@/components/ui/modals/personnel/create";
import UserContainer from "@/components/ui/containers/userContainer";
import Spinner from "@/components/ui/spinner";
import { userService } from "@/services/usersService";
export default function Personnel() {
    const [clubs, setClubs] = useState([])
    const [users, setUsers] = useState([])
    const [isOpneModalCreatePersonnel, setIsOpneModalCreatePersonnel] = useState(false)
    const [isBusy, setIsBusy] = useState(false)
    const loadUsersByClubId = async (brancheId: number) => {
        setIsBusy(true)
        try {
            const res = await userService.getUsersByClubsId(brancheId)
            setUsers(res.data)
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
    const loadAllUsers = async () => {
        setIsBusy(true)
        try {
            const res = await userService.getAll()
            setUsers(res.data)
        } catch (error) {
            toast.error("Erreur lors de la suppresion de Ville")
        }
        setIsBusy(false)
    }
    useEffect(() => {
        loadClubs()
        loadAllUsers()
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
                                                key={index} onClick={() => loadUsersByClubId(club.id!)}
                                                className="whitespace-nowrap overflow-hidden text-ellipsis"
                                            >
                                                {club.name.toUpperCase()}
                                            </DropdownMenuItem>


                                        ))
                                    ) : (
                                        <DropdownMenuItem disabled>Aucune club trouvé</DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>

                            </DropdownMenu>
                            <div>
                                <button className="cursor-pointer flex items-centery" onClick={() => setIsOpneModalCreatePersonnel(true)}>
                                    <Plus />
                                </button>
                            </div>
                        </div>

                        <div className="relative overflow-x-auto shadow-xs rounded-base border border-default rounded-lg">
                            <UserContainer clubs={clubs} loading={() => loadAllUsers()} isBusy={(value) => setIsBusy(value)} users={users} />
                        </div>
                    </div>                </div>

            </div>
            {isOpneModalCreatePersonnel && (<Create clubs={clubs} onClose={() => {
                setIsOpneModalCreatePersonnel(false)
                loadAllUsers()
            }} />)}

        </>
    )
}