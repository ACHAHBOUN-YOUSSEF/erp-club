import Loader from "../../loader";
type props={
    onClose:()=>void;
    onConfirm: () => Promise<void> | void;
    loading?:boolean
}
export default function DeleteClub({onClose,onConfirm,loading=false}:props) {
    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                <div className="bg-white rounded-lg p-6 w-80 shadow-lg text-center relative overflow-hidden">
                    {loading && (<Loader />)}

                    <h2 className="text-lg font-bold mb-4">
                        Confirmer la suppression
                    </h2>

                    <p className="mb-6">
                        Voulez-vous vraiment supprimer ce club ?
                    </p>

                    <div className="flex justify-between">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 disabled:opacity-50"
                        >
                            Annuler
                        </button>

                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                        >
                            Supprimer
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}