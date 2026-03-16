"use client";
import { Calendar, Check, Plus, X } from "lucide-react"
import { clubsService } from "@/services/clubs.Service"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import Spinner from "@/components/ui/spinner"
import { transactionService } from "@/services/transactionService";
import { TransactionCards } from "@/components/ui/cards/TransactionCards";
import { TransactionType } from "@/lib/validators/transactions";
import Create from "@/components/ui/modals/transactions/Create";

export default function Transactions() {
    const [clubs, setClubs] = useState([])
    const [isBusy, setIsBusy] = useState(false)
    const [isOpneModalCreateTransaction, setIsOpneModalCreateTransaction] = useState(false)
    const [activeForm, setActiveForm] = useState<'periode' | 'date' | null>(null);
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [dateUnique, setDateUnique] = useState('');
    const [transactionsByDay, setTransactionsByDay] = useState<TransactionType[]>([]);
    const [transactionsByPeriode, setTransactionsByPeriode] = useState<TransactionType[]>([]);
    const [infoByDay, setInfosByDay] = useState()
    const [infoByPeriode, setInfosByPeriode] = useState()
    const loadClubs = async () => {
        try {
            const res = await clubsService.getAll()
            setClubs(res.data)

        } catch (err: any) {
            toast.error("Erreur lors de telechargement des clubs")
        }
    }
    useEffect(() => {
        loadClubs()
    }, [])
    const getDailyTransactionTotal = async () => {
        setIsBusy(true)
        try {
            const res = await transactionService.getDailyTransactionTotal(dateUnique)
            setTransactionsByDay(res.data.transactions);
            setInfosByDay(res.data.info);
        } catch (err: any) {
            toast.warn("Erreur lors de telechargement des transactions")
        }
        setIsBusy(false)
    }
    const getPeriodTransactionTotal = async () => {
        setIsBusy(true)
        try {
            const res = await transactionService.getPeriodTransactionTotal(dateDebut, dateFin)
            setTransactionsByPeriode(res.data.transactions)
            setInfosByPeriode(res.data.info)
        } catch (err: any) {
            toast.warn("Erreur lors de telechargement des transactions")

        }
        setIsBusy(false)

    }
    return (
        <>
            <div className="bg-red-100 dark:bg-black m-2 p-2 rounded-lg">
                {isBusy && <Spinner />}
                <div className="mt-3">
                    <div className="relative overflow-x-auto shadow rounded-lg border">
                        <div className="p-2 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-start gap-3 sm:gap-4">
                            <div>
                                <button
                                    className="cursor-pointer flex items-center p-2 sm:p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-all"
                                    onClick={() => setIsOpneModalCreateTransaction(true)}
                                >
                                    <Plus className="w-5 h-5" />
                                    <span className="ml-2 hidden sm:inline font-medium">Nouvelle transaction</span>
                                </button>
                            </div>
                        </div>

                        <div className="relative overflow-x-auto shadow-xs rounded-base border border-default rounded-lg mx-2 sm:mx-4 mb-4">
                            <div className="p-4 sm:p-6 lg:p-8">
                                <div className="mx-auto max-w-7xl">
                                    {/* Boutons principaux toujours visibles - RESPONSIVE */}
                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 justify-center">
                                        <button
                                            onClick={() => setActiveForm(activeForm === 'date' ? null : 'date')}
                                            className={`px-4 sm:px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 w-full sm:w-auto ${activeForm === 'date'
                                                ? 'bg-red-600 text-white shadow-lg text-sm sm:text-base'
                                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-sm'
                                                }`}
                                        >
                                            <Calendar className="w-4 h-4 flex-shrink-0" />
                                            <span className="whitespace-nowrap">Date Unique</span>
                                        </button>
                                        <button
                                            onClick={() => setActiveForm(activeForm === 'periode' ? null : 'periode')}
                                            className={`px-4 sm:px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 w-full sm:w-auto ${activeForm === 'periode'
                                                ? 'bg-red-600 text-white shadow-lg text-sm sm:text-base'
                                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-sm'
                                                }`}
                                        >
                                            <Calendar className="w-4 h-4 flex-shrink-0" />
                                            <span className="whitespace-nowrap">Période</span>
                                        </button>
                                    </div>

                                    {/* Form Période - RESPONSIVE */}
                                    {activeForm === 'periode' && (
                                        <div className="bg-red-50 p-4 sm:p-6 rounded-xl border-2 border-red-400 mb-6 animate-in slide-in-from-top-4 duration-300">
                                            <h3 className="text-base sm:text-lg font-semibold text-red-600 mb-4 text-center sm:text-left">Recherche par période</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Date début</label>
                                                    <input
                                                        type="date"
                                                        value={dateDebut}
                                                        onChange={(e) => setDateDebut(e.target.value)}
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Date fin</label>
                                                    <input
                                                        type="date"
                                                        value={dateFin}
                                                        onChange={(e) => setDateFin(e.target.value)}
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                                <button
                                                    onClick={() => {
                                                        getPeriodTransactionTotal()
                                                    }}
                                                    disabled={!dateDebut || !dateFin}
                                                    className="px-6 sm:px-8 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all w-full sm:w-auto text-sm sm:text-base"
                                                >
                                                    <Check className="w-4 h-4 flex-shrink-0" />
                                                    Calculer
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setDateDebut('');
                                                        setDateFin('');
                                                    }}
                                                    className="px-6 sm:px-8 py-3 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 flex items-center justify-center gap-2 transition-all w-full sm:w-auto text-sm sm:text-base"
                                                >
                                                    <X className="w-4 h-4 flex-shrink-0" />
                                                    Reset
                                                </button>
                                            </div>
                                            {transactionsByPeriode.length > 0 && (
                                                <div className="mt-6">
                                                    <TransactionCards
                                                        transactions={transactionsByPeriode}
                                                        info={infoByPeriode}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Form Date Unique - RESPONSIVE */}
                                    {activeForm === 'date' && (
                                        <div className="bg-red-50 p-4 sm:p-6 rounded-xl border-2 border-red-400 mb-6 animate-in slide-in-from-top-4 duration-300">
                                            <h3 className="text-base sm:text-lg font-semibold text-red-600 mb-4 text-center sm:text-left">Recherche par date unique</h3>
                                            <div className="mb-6">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                                                <input
                                                    type="date"
                                                    value={dateUnique}
                                                    onChange={(e) => setDateUnique(e.target.value)}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                                                />
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                                <button
                                                    onClick={() => getDailyTransactionTotal()}
                                                    disabled={!dateUnique}
                                                    className="px-6 sm:px-8 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all w-full sm:w-auto text-sm sm:text-base"
                                                >
                                                    <Check className="w-4 h-4 flex-shrink-0" />
                                                    Calculer
                                                </button>
                                                <button
                                                    onClick={() => { setTransactionsByDay([]); setDateUnique('') }}
                                                    className="px-6 sm:px-8 py-3 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 flex items-center justify-center gap-2 transition-all w-full sm:w-auto text-sm sm:text-base"
                                                >
                                                    <X className="w-4 h-4 flex-shrink-0" />
                                                    Reset
                                                </button>
                                            </div>

                                            {/* ✅ TransactionCards avec info */}
                                            {transactionsByDay.length > 0 && (
                                                <div className="mt-6">
                                                    <TransactionCards
                                                        transactions={transactionsByDay}
                                                        info={infoByDay}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isOpneModalCreateTransaction && <Create onClose={()=>setIsOpneModalCreateTransaction(false)} Cancel={() => setIsOpneModalCreateTransaction(false)} />}
        </>
    )
}
