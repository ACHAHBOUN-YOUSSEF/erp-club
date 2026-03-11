import { useState } from "react"
import { X } from "lucide-react"

type Log = {
    id: number
    created_at: string
    updated_at: string
    action: string
    description: string
    oldValue?: string
    newValue?: string
    fieldName?: string
    executedByUser?: string
}
type props = {
    logs?: Log[]
}
export default function LogsHistory({ logs }: props) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <div
                className="flex items-center gap-2 cursor-pointer select-none"
                onClick={() => setOpen(!open)}
            >
                <h1 className="text-xl font-bold text-red-700">
                    Historique des operations
                </h1>
            </div>
            {/* Modal */}
            {open && (
                <div
                    className="fixed inset-0 z-50 backdrop-blur-sm bg-black/40 flex items-center justify-center"
                    onClick={() => setOpen(false)}
                >
                    <div
                        className="bg-white w-11/12 md:w-3/4 lg:w-1/2 max-h-[80vh] overflow-y-auto rounded-2xl p-6 shadow-xl relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Bouton fermeture */}
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-3 right-4 text-gray-500 hover:text-red-700"
                        >
                            <X size={24} />
                        </button>

                        {/* Titre */}
                        <h2 className="text-2xl font-bold text-red-600 mb-4">
                            Historique des operations
                        </h2>

                        {/* Logs uniquement details + summary */}
                        <div className="space-y-4">
                            {logs && logs.map((log) => (
                                <details
                                    key={log.id}
                                    className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm hover:shadow-md transition-all"
                                >
                                    <summary className="cursor-pointer font-medium text-gray-800">
                                        {new Date(log.created_at).toLocaleString("fr-FR")} — {log.action}
                                    </summary>
                                    <div className="mt-2 text-sm text-gray-700 space-y-1 pl-2">
                                        <p><strong>Description :</strong> {log.description}</p>
                                        {
                                            log.oldValue && <p><strong>Ancienne valeur :</strong> {log.oldValue ?? "-"}</p>
                                        }
                                        {
                                            log.newValue && <p><strong>Nouvelle valeur :</strong> {log.newValue ?? "-"}</p>

                                        }
                                        <p>
                                            <strong>Par :</strong> {log.executedByUser ?? "Système"}{" "}
                                        </p>
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}