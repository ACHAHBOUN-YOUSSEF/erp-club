"use client"
import { X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { userSchema, userType } from "@/lib/validators/users";
import { toast } from "react-toastify";
import { userService } from "@/services/usersService";
import { clubType } from "@/lib/validators/clubs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { RolesPermissionsService } from "@/services/roles-PermissionsService";
import Loader from "../../loader";
type props = {
    onClose: () => void;
    clubs: clubType[];
    user: userType;
}
type Role = {
    name: string
}
type Permission = {
    name: string
}
type RolesAndPermissions = {
    roles: Role[];
    permissions: Permission[];
}
export default function EditUser({ onClose, clubs, user }: props) {
    const { register, handleSubmit, control, formState: { errors, isSubmitting }, reset, setValue, watch } = useForm<userType>({ resolver: zodResolver(userSchema), defaultValues: { ...user, imagePath: undefined, password: "", brancheId: user.brancheId, role: user.role } })
    const [rolesAndPermissions, setRolesAndPermissions] = useState<RolesAndPermissions>({ roles: [], permissions: [] })
    const currentRole = watch("role");
    const onSubmit = async (user: userType) => {
        try {
            const res = await userService.update(user.id!, user)
            toast.success(res.message)
            reset()
            onClose()
        } catch (err: any) {
            console.log(err);
            toast.error(err.message || "Erreur serveur")
        }
    }
    const loadRolesAndPermissions = async () => {
        try {
            const res = await RolesPermissionsService.getRolesAndPermissions()
            setRolesAndPermissions(res.data)
        } catch {
            toast.error("Erreur lors du chargement");
        }
    }
    useEffect(() => {
        loadRolesAndPermissions()
    }, [user])
    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                <div className="bg-white rounded-lg w-96 shadow-lg relative max-h-[97vh] flex flex-col">
                    {isSubmitting && (<Loader />)}
                    <h2 className="text-lg font-bold mb-4 px-4 pt-4 flex justify-between items-center">
                        Ajouter un membre
                        <X className="cursor-pointer" onClick={() => onClose()} />
                    </h2>
                    <hr />
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="overflow-y-auto px-6 pb-6 p-4">
                        <div className="mb-3 mt-3">
                            <details className="border rounded p-3">
                                <summary className="cursor-pointer text-center font-semibold">
                                    Informations General
                                </summary>

                                <div className="mt-3 space-y-3">
                                    <div className="mb-3">
                                        <label className="block font-semibold mb-1">CIN</label>
                                        <input type="text"
                                            {...register("cin")}
                                            className="focus:bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5 pr-10 " placeholder="CIN ..." />
                                        {errors.cin && <p className="text-red-500 text-sm">{errors.cin.message}</p>}
                                    </div>
                                    <div className="mb-3">
                                        <label className="block font-semibold mb-1">Nom</label>
                                        <input type="text"
                                            {...register("firstName")}
                                            className="focus:bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5 pr-10 " placeholder="Nom ..." />
                                        {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
                                    </div>
                                    <div className="mb-3">
                                        <label className="block font-semibold mb-1">Prenom</label>
                                        <input type="text"
                                            {...register("lastName")}
                                            className="focus:bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5 pr-10 " placeholder="Prenom ..." />
                                        {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
                                    </div>
                                    <div className="mb-3">
                                        <label className="block font-semibold mb-1">Telephone</label>
                                        <input type="text"
                                            {...register("phone")}
                                            className="focus:bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5 pr-10 " placeholder="Telephone ..." />
                                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                                    </div>
                                    <div className="mb-3">
                                        <label className="block font-semibold mb-1">Date Naissance</label>
                                        <input type="date"
                                            {...register("birthDate")}
                                            className="focus:bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5 pr-10 " placeholder="Date Naissance ..." />
                                        {errors.birthDate && <p className="text-red-500 text-sm">{errors.birthDate.message}</p>}
                                    </div>
                                    <div className="mb-3">
                                        <label className="block font-semibold mb-1">Adresse</label>
                                        <input type="text"
                                            {...register("adresse")}
                                            className="focus:bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5 pr-10 " placeholder="Adresse ..." />
                                        {errors.adresse && <p className="text-red-500 text-sm">{errors.adresse.message}</p>}
                                    </div>
                                    <div className="mb-3">
                                        <label className="block font-semibold mb-2">Genre</label>

                                        <div className="flex gap-6">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    value="homme"
                                                    {...register("gender")}
                                                    className="accent-red-600"
                                                />
                                                <span>Homme</span>
                                            </label>

                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    value="femme"
                                                    {...register("gender")}
                                                    className="accent-red-600"
                                                />
                                                <span>Femme</span>
                                            </label>
                                        </div>

                                        {errors.gender && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.gender.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="block font-semibold mb-1">Choissir un club</label>
                                        <select {...register("brancheId", { valueAsNumber: true })} defaultValue={user.brancheId} className="focus:bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5 pr-10">
                                            {clubs.length > 0 ? (
                                                clubs.map((club) => (
                                                    <option key={club.id} value={club.id}>
                                                        {club.name.toUpperCase()}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="">Aucune club trouvée</option>
                                            )}
                                        </select>
                                        {errors.brancheId && (<p className="text-red-500 text-sm">{errors.brancheId.message}</p>)}

                                    </div>
                                </div>
                            </details>
                        </div>
                        <div className="mb-3">
                            <details className="border rounded p-3">
                                <summary className="cursor-pointer text-center font-semibold">
                                    Authentification
                                </summary>

                                <div className="mt-3 space-y-3">
                                    {/* --- Select Role --- */}

                                    <div className="mb-3">
                                        <label className="block font-semibold mb-1">E-mail</label>
                                        <input type="text"
                                            {...register("email")}
                                            className="focus:bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5 pr-10 " placeholder="E-mail ..." />
                                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                                    </div>
                                    <div className="mb-3">
                                        <label className="block font-semibold mb-1">Mot de passe</label>
                                        <input type="text"
                                            {...register("password")}
                                            className="focus:bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5 pr-10 " placeholder="Mot de passe ..." />
                                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                                    </div>
                                </div>
                            </details>
                        </div>
                        <div className="mb-3">
                            <details className="border rounded p-3">
                                <summary className="cursor-pointer text-center font-semibold">
                                    Rôles et Droits d'accès
                                </summary>

                                <div className="mt-3 space-y-3">
                                    <div>
                                        <label className="block font-medium mb-1">Rôle</label>

                                        <select
                                            value={currentRole || user.role || ""}
                                            onChange={(e) => setValue("role", e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                                        >
                                            <option value="">Choisir un rôle</option>
                                            {rolesAndPermissions.roles.map((role, i) => (
                                                <option key={i} value={role.name}>
                                                    {role.name.toUpperCase()}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.role && (
                                            <p className="text-red-500 text-sm">{errors.role.message}</p>
                                        )}
                                    </div>



                                    <Controller
                                        control={control}
                                        name="permissions"
                                        defaultValue={[]}
                                        render={({ field }) => {
                                            const value = field.value || []

                                            return (
                                                <div className="flex flex-wrap gap-3">
                                                    {rolesAndPermissions.permissions.map((permission, i) => (
                                                        <label key={i} className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                value={permission.name}
                                                                checked={value.includes(permission.name)}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        field.onChange([...value, permission.name]);
                                                                    } else {
                                                                        field.onChange(value.filter((v: string) => v !== permission.name));
                                                                    }
                                                                }}
                                                                className="accent-red-600"
                                                            />
                                                            {permission.name}
                                                        </label>
                                                    ))}
                                                </div>
                                            );
                                        }}
                                    />


                                </div>
                            </details>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button type="button" onClick={onClose} className="px-4 py-2 cursor-pointer bg-gray-300 rounded disabled:opacity-50">
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`cursor-pointer px-4 py-2 bg-red-600 text-white rounded ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"}`}>
                                {isSubmitting ? "En cours..." : "Modifier"}
                            </button>
                        </div>
                    </form>

                </div>
            </div>

        </>
    )
}