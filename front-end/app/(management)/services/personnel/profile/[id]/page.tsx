"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Spinner from "@/components/ui/spinner"
import { userService } from "@/services/usersService"
import { toast } from "react-toastify"
import { userType } from "@/lib/validators/users"
import { Mail, Phone, MapPin, Calendar, User, Building2, Key } from "lucide-react"

export default function Profile() {
    const params = useParams()
    const id = Number(params.id as string)

    const [user, setUser] = useState<userType>()
    const [isBusy, setIsBusy] = useState(true)
    const [showPermissions, setShowPermissions] = useState(false)

    const loadUserInfos = async (id: number) => {
        setIsBusy(true)
        try {
            const res = await userService.getById(id)
            setUser(res.data)
        } catch {
            toast.error("Erreur lors du chargement de l'utilisateur")
        } finally {
            setIsBusy(false)
        }
    }

    useEffect(() => {
        loadUserInfos(id)
    }, [id])

    if (isBusy) return <Spinner />

    if (!user) return <p className="text-center text-red-500 mt-6">Utilisateur introuvable</p>

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="bg-white shadow-xl rounded-3xl p-6 flex flex-col md:flex-row gap-6">
                {/* AVATAR */}
                <div className="flex flex-col items-center md:w-1/3">
                    <img
                        src={user.imagePath ?? "https://via.placeholder.com/300"}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-48 h-48 rounded-full object-cover border-4 border-red-500 shadow-md"
                    />
                    <h2 className="mt-4 text-xl font-bold uppercase text-center">
                        {user.firstName} {user.lastName}
                    </h2>
                    <span className="text-sm text-gray-500">{user.role}</span>
                </div>

                {/* INFOS */}
                <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Info label="CIN" value={user.cin} icon={<User />} />
                    <Info label="Email" value={user.email} icon={<Mail />} />
                    <Info label="Téléphone" value={user.phone} icon={<Phone />} />
                    <Info label="Naissance" value={user.birthDate.split("T")[0]} icon={<Calendar />} />
                    <Info label="Genre" value={user.gender} icon={<User />} />
                    <Info label="Adresse" value={user.adresse} icon={<MapPin />} />
                    <Info label="Ville" value={user.club?.ville?.name ?? "—"} icon={<Building2 />} />
                    <Info label="Club" value={user.club?.name ?? "—"} icon={<Building2 />} />
                </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-xl shadow-inner">
                <button
                    onClick={() => setShowPermissions(!showPermissions)}
                    className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-800 transition"
                >
                    <Key className="w-4 h-4" />
                    {showPermissions ? "Masquer les permissions" : "Voir les permissions"}
                </button>

                {showPermissions && (
                    <ul className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {
                            user.permissions?.length > 0 ? (
                                user.permissions.map((perm: string, index: number) => <li key={index} className="bg-black/10 text-black text-xs px-2 py-1 rounded-full">{perm}</li>)
                            ) : (<li className="text-gray-500 text-sm">Aucune permission</li>)
                        }
                    </ul>
                )}
            </div>
        </div>
    )
}

/* Composant réutilisable pour chaque info */
function Info({ label, value, icon }: { label: string; value?: string | null; icon: React.ReactNode }) {
    return (
        <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
            <div className="text-red-600 mt-1">{icon}</div>
            <div>
                <p className="text-xs text-gray-500 uppercase">{label}</p>
                <p className="font-semibold text-gray-800 break-words">{value ?? "Non disponible"}</p>
            </div>
        </div>
    )
}