import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Mail, Phone, MapPin, Building2, Edit, Trash } from "lucide-react"
import { clubType } from "@/lib/validators/clubs"
import { useState } from "react";
import EditClub from "../modals/clubs/edit";
import { VilleSchema } from "@/lib/validators/villes";
import { clubsService } from "@/services/clubs.Service";
import { toast } from "react-toastify";
import DeleteClub from "../modals/clubs/delete";
interface ClubInfoCardsProps {
    clubs: clubType[];
    villes: VilleSchema[];
    isBusy: (value: boolean) => void
}
export default function ClubInfoCards({ clubs, villes, isBusy }: ClubInfoCardsProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [clubOnEditing, setClubOnEditing] = useState()
    const [isDeleting, setIsDeleting] = useState(false)
    const [modalDeleteOpen, setModalDeleteOpen] = useState(false)
    const [deletedClubId, setDeletedClubId] = useState<number | null>(null)
    const handleEdit = async (id: number) => {
        try {
            isBusy(true)
            const club = await clubsService.getById(id)
            setClubOnEditing(club)
            setIsEditing(true)
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
    const handleDelete = (id: number) => {
        setDeletedClubId(id)
        setModalDeleteOpen(true)
    }
    const confirmDelete = async () => {
        if (!deletedClubId) return;
        setIsDeleting(true)
        try {
            const res = await clubsService.delete(deletedClubId)
            toast.success(res.message)
            setIsDeleting(false)
            setModalDeleteOpen(false)

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
    return (
        <>
            <div className="flex justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-7xl">
                    {clubs.length > 0 ? (
                        clubs.map((club, i) => {
                            return (
                                <Card key={i} className="rounded-xl shadow-md">
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center justify-between gap-2">
                                            <div className="flex items-center">
                                                <Building2 className="w-5 h-5 text-red-500 text-primary mr-2" />
                                                {club.name}
                                            </div>

                                            <div className="flex items-center">
                                                <button className="m-1 cursor-pointer hover:text-red-500" onClick={() => handleEdit(club.id!)}><Edit /></button>
                                                <button className="m-1 cursor-pointer hover:text-red-500 mb-1.5" onClick={() => handleDelete(Number(club.id))}><Trash /></button>
                                            </div>
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent className="space-y-2 text-sm text-gray-700">
                                        <p><b>Nom :</b> {club.name.toUpperCase()}</p>
                                        <p><b>Ville :</b> {club.ville!.name?.toUpperCase()!}</p>

                                        <p className="flex items-center      gap-2">
                                            <Mail className="w-4 h-4 text-primary" />
                                            <span>{club.email}</span>
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-primary" />
                                            <span>{club.phone}</span>
                                        </p>

                                        <p className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 mt-1 text-primary" />
                                            <span>{club.adresse.toUpperCase()}</span>
                                        </p>
                                    </CardContent>
                                </Card>
                            )
                        })
                    ) : ""}
                </div>
            </div>
            {isEditing && (<EditClub villes={villes} club={clubOnEditing!} onClose={() => setIsEditing(false)} />)}
            {modalDeleteOpen && (<DeleteClub loading={isDeleting} onClose={() => setModalDeleteOpen(false)} onConfirm={confirmDelete} />)}
        </>
    )
}
