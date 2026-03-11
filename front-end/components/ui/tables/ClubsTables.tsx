import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, } from "@/components/ui/dropdown-menu"
import { Filter, Plus } from "lucide-react"
import ClubInfoCards from "./ClubInfoCards";
import { useEffect, useState } from "react";
import { clubsService } from "@/services/clubs.Service";
import { toast } from "react-toastify";
import { villesService } from "@/services/villesService";
import { VilleSchema } from "@/lib/validators/villes";
import Create from "../modals/clubs/create";
type props = {
    isBusy: (value: boolean) => void
}
export default function ClubsTables({ isBusy }: props) {
    const [clubs, setClubs] = useState([])
    const [villes, setVilles] = useState([])
    const [isOpneModalCreateClub, setIsOpneModalCreateClub] = useState(false)
    const loadClubsById = async (villeId: number) => {
        isBusy(true)
        try {
            const data = await clubsService.getClubsByVilleId(villeId)
            setClubs(data.data);
        } catch (error) {
            toast.error("Erreur lors de la suppresion de Ville")
        }
        isBusy(false)
    }
    const loadVilles = async () => {
        const res = await villesService.getAll()
        setVilles(res);
    }
    useEffect(() => {
        loadVilles()
    }, [])
    return (
        <div className="relative overflow-x-auto shadow rounded-lg border">
            <div className="p-2 flex flex-col sm:flex-row items-start sm:items-center justify-start gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="cursor-pointer gap-2">
                            <Filter size={16} />
                            Villes
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="start" className="w-auto">
                        {villes.length > 0 ? (
                            villes.map((ville: VilleSchema, index) => (
                                <DropdownMenuItem key={index} onClick={() => loadClubsById(ville.id!)} >
                                    {ville.name.toUpperCase()}
                                </DropdownMenuItem>
                            ))
                        ) : (
                            <DropdownMenuItem disabled>Aucune ville disponible</DropdownMenuItem>
                        )}
                    </DropdownMenuContent>

                </DropdownMenu>
                <div>
                    <button className="cursor-pointer" onClick={() => setIsOpneModalCreateClub(true)}>
                        <Plus />
                    </button>
                </div>
                {
                    isOpneModalCreateClub && (
                        <Create villes={villes} onClose={() => setIsOpneModalCreateClub(false)} />
                    )
                }
            </div>

            <div className="relative overflow-x-auto shadow-xs rounded-base border border-default rounded-lg">
                <ClubInfoCards villes={villes} isBusy={isBusy} clubs={clubs} />
            </div>
        </div>
    );
}
