import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Mail, Phone, MapPin, Building2, Edit, Trash } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { clubType } from "@/lib/validators/clubs"
interface ClubInfoCardsProps {
    clubs: clubType[];
}
export default function ClubInfoCards({ clubs }: ClubInfoCardsProps) {
    const [editClubId, setEditClubId] = useState<number | null>(null);
    const [deleteClubId, setDeleteClubId] = useState<number | null>(null);

    return (
        <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-7xl">
                {clubs.map((club) => (
                    <Card key={club.id} className="rounded-xl shadow-md"> {/* key={club.id} */}
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center justify-between gap-2">
                                <div className="flex items-center">
                                    <Building2 className="w-5 h-5 text-primary mr-2" />
                                    {club.name}
                                </div>

                                <div className="flex items-center">
                                    {/* EDIT DIALOG */}
                                    <Dialog open={editClubId === club.id} onOpenChange={() => setEditClubId(null)}>
                                        <DialogTrigger asChild>
                                            <Edit className="mr-4 cursor-pointer hover:text-blue-500" />
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Modifier le club</DialogTitle>
                                                <DialogDescription>Mettez à jour les informations.</DialogDescription>
                                            </DialogHeader>
                                            <div className="flex flex-col gap-4">
                                                <input defaultValue={club.name} className="border p-2 rounded" />
                                                <input defaultValue={club.villeId} className="border p-2 rounded" />
                                                <input defaultValue={club.email} className="border p-2 rounded" />
                                                <input defaultValue={club.phone} className="border p-2 rounded" />
                                            </div>
                                            <DialogFooter>
                                                <Button variant="outline" onClick={() => setEditClubId(null)}>
                                                    Annuler
                                                </Button>
                                                <Button>Enregistrer</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>

                                    {/* DELETE DIALOG */}
                                    <Dialog open={deleteClubId === club.id} onOpenChange={() => setDeleteClubId(null)}>
                                        <DialogTrigger asChild>
                                            <Trash className="cursor-pointer hover:text-red-500" />
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Supprimer le club</DialogTitle>
                                                <DialogDescription>
                                                    Voulez-vous vraiment supprimer <b>{club.name}</b> ?
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                                <Button variant="outline" onClick={() => setDeleteClubId(null)}>
                                                    Annuler
                                                </Button>
                                                <Button variant="destructive">Supprimer</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-2 text-sm text-gray-700">
                            <p><b>Nom du club :</b> {club.name}</p>
                            <p><b>Ville :</b> {club.ville?.name || 'Non définie'}</p> {/* Safe */}
                            <p className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-primary" />
                                <span>{club.email}</span>
                            </p>
                            <p className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-primary" />
                                <span>{club.phone}</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 mt-1 text-primary" />
                                <span>{club.adresse}</span>
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

