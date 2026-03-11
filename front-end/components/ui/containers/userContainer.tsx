"use client"
import { Edit, MoreVertical, Trash2, UserCircle } from "lucide-react"
import { useState } from "react"
import { userType } from "@/lib/validators/users"
import Link from "next/link"
import DeleteUser from "../modals/personnel/delete"
import { userService } from "@/services/usersService"
import { toast } from "react-toastify"
import EditUser from "../modals/personnel/edit"
import { clubType } from "@/lib/validators/clubs"
import EditUserImage from "../modals/personnel/EditUserImage"

type Props = {
    users: userType[],
    loading: (value: boolean) => void;
    clubs: clubType[];
    isBusy: (value: boolean) => void
}

export default function UserContainer({ users, loading, clubs, isBusy }: Props) {
    const [modelOpenDelete, setModelOpenDelete] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [deletedUserId, setDeletedUserId] = useState<number | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [userOnEdit, setUserOnEdit] = useState<userType>()
    const [userImageOnEdit, setUserImageOnEdit] = useState<userType|null>()

    const handleDelete = (id: number) => {
        setModelOpenDelete(true)
        setDeletedUserId(id)
    }
    const handleEdit = async (userId: number) => {
        try {
            isBusy(true)
            const res = await userService.getById(userId)
            setUserOnEdit(res.data);
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
    const handleEditImageUser = async (userId: number) => {
        try {
            isBusy(true)
            const res = await userService.getById(userId)
            setUserImageOnEdit(res.data);
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
    const confirmDelete = async () => {
        setIsDeleting(true)
        try {
            const res = await userService.delete(Number(deletedUserId))
            toast.success(res.message)
            setIsDeleting(false)
            setModelOpenDelete(false)
            loading(true)
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
                    {users.length > 0 &&
                        users.map((user, i) => (
                            <div
                                key={i}
                                className="relative bg-white shadow-lg rounded-2xl p-4 w-full hover:shadow-xl transition-shadow duration-300"
                            >
                                {/* USER HEADER */}
                                <div className=" flex items-center gap-3">
                                    <div className="relative group w-20 h-20">
                                        <img alt="user" src={user.imagePath} className="w-20 h-20 rounded-full object-cover border-2 border-red-500" />
                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <button title="Modifier l'image" className="cursor-pointer bg-white text-red-600 text-xs px-3 py-1 rounded-full hover:bg-red-600 hover:text-white transition"
                                                onClick={() => handleEditImageUser(user.id!)}>
                                                <Edit />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col min-w-0">
                                        <p className="text-lg font-semibold uppercase truncate">
                                            {user.firstName.toLowerCase()} {user.lastName.toLowerCase()}
                                        </p>
                                        <p className="text-sm text-gray-600 truncate">{user.email}</p>
                                        <p className="text-sm text-gray-500 truncate">{user.role}</p>
                                    </div>
                                </div>

                                {/* FOOTER */}
                                <div className="flex justify-between items-center mt-3">
                                    <p className="text-red-600 font-semibold uppercase gap-2 text-sm truncate">
                                        <span className="text-sm text-black" > {user.club?.name}</span>
                                    </p>

                                    {/* 3 DOTS MENU */}
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/services/personnel/profile/${user.id}`}
                                            className="cursor-pointer flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                                        >
                                            <UserCircle className="w-4 h-4" />
                                        </Link>

                                        <button
                                            onClick={() => handleEdit(user.id!)}
                                            className="cursor-pointer flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                                        >
                                            <Edit className="w-4 h-4" />

                                        </button>

                                        <button
                                            onClick={() => handleDelete(user.id!)}
                                            className="cursor-pointer flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                </div>
                            </div>
                        ))}
                </div>
            </div>
            {isEditing && <EditUser clubs={clubs} onClose={() => {
                setIsEditing(false)
                loading(true)
            }} user={userOnEdit!} />}
            {userImageOnEdit && <EditUserImage onClose={()=>{
                setUserImageOnEdit(null)
                loading(true)
                }} imageUser={userImageOnEdit} />}
            {modelOpenDelete && (<DeleteUser loading={isDeleting} onClose={() => setModelOpenDelete(false)} onConfirm={confirmDelete} />)}
        </>
    )

}
