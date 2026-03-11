import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Mail, Phone, MapPin, Building2, Edit, Trash } from "lucide-react"
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription,DialogTrigger,DialogFooter} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { clubType } from "@/lib/validators/clubs"
interface ClubInfoCardsProps {
    clubs: clubType[];
}
export default function ClubInfoCards({clubs}:ClubInfoCardsProps) {
    return (
        <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-7xl">
                {clubs.map((club, i) => {

                    const [openEdit, setOpenEdit] = useState(false);
                    const [openDelete, setOpenDelete] = useState(false);

                    return (
                        <Card key={i} className="rounded-xl shadow-md">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center justify-between gap-2">
                                    <div className="flex items-center">
                                        <Building2 className="w-5 h-5 text-primary mr-2" />
                                        {club.name}
                                    </div>

                                    <div className="flex items-center">

                                        {/* ----------- DIALOG EDIT ----------- */}
                                        <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                                            <DialogTrigger asChild>
                                                <Edit
                                                    onClick={() => setOpenEdit(true)}
                                                    className="mr-4 cursor-pointer hover:text-blue-500"
                                                />
                                            </DialogTrigger>

                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Modifier le club</DialogTitle>
                                                    <DialogDescription>
                                                        Mettez à jour les informations.
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <div className="flex flex-col gap-4">
                                                    <input defaultValue={club.name} className="border p-2 rounded" />
                                                    <input defaultValue={club.villeId} className="border p-2 rounded" />
                                                    <input defaultValue={club.email} className="border p-2 rounded" />
                                                    <input defaultValue={club.phone} className="border p-2 rounded" />
                                                </div>

                                                <DialogFooter>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setOpenEdit(false)}
                                                    >
                                                        Annuler
                                                    </Button>

                                                    <Button>Enregistrer</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>

                                        {/* ----------- DIALOG DELETE ----------- */}
                                        <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                                            <DialogTrigger asChild>
                                                <Trash
                                                    onClick={() => setOpenDelete(true)}
                                                    className="cursor-pointer hover:text-red-500"
                                                />
                                            </DialogTrigger>

                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Supprimer le club</DialogTitle>
                                                    <DialogDescription>
                                                        Voulez-vous vraiment supprimer <b>{club.name}</b> ?
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <DialogFooter>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setOpenDelete(false)}
                                                    >
                                                        Annuler
                                                    </Button>

                                                    <Button variant="destructive">
                                                        Supprimer
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>

                                    </div>
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-2 text-sm text-gray-700">
                                <p><b>Nom du club :</b> {club.name}</p>
                                <p><b>Ville :</b> {club.ville.name}</p>

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
                    )
                })}
            </div>
        </div>
    )
}
