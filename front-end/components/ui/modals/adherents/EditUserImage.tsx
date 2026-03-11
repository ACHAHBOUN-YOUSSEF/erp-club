import { useForm } from "react-hook-form"
import { userType } from "@/lib/validators/users"
import { Edit, Trash2 } from "lucide-react"
import { useState } from "react"
import Loader from "../../loader"
import { updateImageSchema } from "@/lib/validators/files/updateImageSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { userService } from "@/services/usersService"
import { toast } from "react-toastify"

type props = {
    imageUser: userType
    onClose: () => void
}
export default function EditUserImage({ imageUser, onClose }: props) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(updateImageSchema) });
    const [image, setImage] = useState<File | string>(imageUser.imagePath!)
    const preview = image instanceof File ? URL.createObjectURL(image) : image;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setImage(file)
    }
    const onSubmit = async () => {
        try {
            const formData = new FormData();

            if (image instanceof File) {
                formData.append("imagePath", image);
            }
            await userService.UpdateImageUser(imageUser.id!, formData);

            toast.success('Image mise à jour avec succès!');
            onClose();

        } catch (error: any) {
            // Vérifier si erreur Laravel validation
            if (error.response?.status === 422 && error.response.data?.errors) {
                const errors = error.response.data.errors;
                // Afficher chaque erreur via toast
                Object.values(errors).forEach((msgs: any) => {
                    msgs.forEach((msg: string) => toast.error(msg));
                });
            } else {
                // Autres erreurs serveur
                toast.error('Une erreur est survenue, réessayez plus tard.');
                console.error(error);
            }
        }
    };


    return (
        <>

            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                <div className="bg-white rounded-lg w-96 shadow-lg relative max-h-[97vh] flex flex-col">
                    {isSubmitting && (<Loader />)}
                    <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto px-6 pb-6 p-4">
                        <h1>{imageUser.firstName.toUpperCase()} {imageUser.lastName.toUpperCase()}</h1>
                        <div className="mb-3 mt-3">
                            <div className="mt-3 space-y-3">
                                <div className="mb-3">
                                    <div className="flex flex-col items-center">
                                        {image && (
                                            <img
                                                src={preview}
                                                alt="preview"
                                                className="mt-2 h-24 w-24 object-cover rounded-full border"
                                            />
                                        )}

                                        {!image && (
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="p-2 rounded-lg text-red-400 bg-red-50 object-cover border"
                                            />
                                        )}
                                    </div>
                                    {errors.imagePath && (<p className="text-red-500 text-sm mt-1">{errors.imagePath?.message as string}</p>)}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center items-center">
                            <Trash2 className="ml-2 hover:text-red-600 cursor-pointer" onClick={() => setImage("")} />
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button type="button" onClick={onClose} className="px-4 py-2 cursor-pointer bg-gray-300 rounded disabled:opacity-50">
                                Annuler
                            </button>
                            <button
                                type="submit"
                                // disabled={isSubmitting}
                                className={`cursor-pointer px-4 py-2 bg-red-600 text-white rounded ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"}`}
                            >
                                {isSubmitting ? "En cours..." : "Modifier"}
                            </button>
                        </div>
                    </form>

                </div>
            </div>

        </>
    )
}