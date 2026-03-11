"use client";
import Spinner from "@/components/ui/spinner";
import { DashboardService } from "@/services/dashboardService";
import { useEffect, useState } from "react"
import { toast } from "react-toastify";

export default function Page() {
    const [isBusy, setIsbusy] = useState<boolean>(false)
    const [nbAdherents, setNbAdherents] = useState<number>(0)
    const [AdherentsThisMonth, setAdherentsThisMonth] = useState<number>(0)
    const [nbAdherentsByGenre, setNbAdherentsByGenre] = useState<any>({})
    const [adherentsActifsCount, setAdherentsActifsCount] = useState<number>(0)
    const [adherentsActifs, setAdherentsActifs] = useState<any[]>([])
    const [adherentsInactifsCount, setAdherentsInactifsCount] = useState<number>(0)
    const [adherentsInactifs, setAdherentsInactifs] = useState<any[]>([])
    const [femmesActives, setFemmesActives] = useState<number>(0)
    const [hommesActifs, setHommesActifs] = useState<number>(0)
    const [groupes, setGroupes] = useState<any[]>([])
    const [transactions, setTransactions] = useState<any[]>([])
    const hoverColors = [
        "hover:bg-red-500/10",
        "hover:bg-orange-500/10",
        "hover:bg-amber-500/10",
        "hover:bg-yellow-500/10",
        "hover:bg-lime-500/10",
        "hover:bg-green-500/10",
        "hover:bg-emerald-500/10",
        "hover:bg-teal-500/10",
        "hover:bg-cyan-500/10",
        "hover:bg-sky-500/10",

        "hover:bg-blue-500/10",
        "hover:bg-indigo-500/10",
        "hover:bg-violet-500/10",
        "hover:bg-purple-500/10",
        "hover:bg-fuchsia-500/10",
        "hover:bg-pink-500/10",
        "hover:bg-rose-500/10",
        "hover:bg-red-400/10",
        "hover:bg-orange-400/10",
        "hover:bg-yellow-400/10",

        "hover:bg-green-400/10",
        "hover:bg-teal-400/10",
        "hover:bg-cyan-400/10",
        "hover:bg-blue-400/10",
        "hover:bg-indigo-400/10",
        "hover:bg-purple-400/10",
        "hover:bg-pink-400/10",
        "hover:bg-rose-400/10",
        "hover:bg-red-300/10",
        "hover:bg-orange-300/10",

        "hover:bg-yellow-300/10",
        "hover:bg-green-300/10",
        "hover:bg-teal-300/10",
        "hover:bg-cyan-300/10",
        "hover:bg-blue-300/10",
        "hover:bg-indigo-300/10",
        "hover:bg-purple-300/10",
        "hover:bg-pink-300/10",
        "hover:bg-rose-300/10",
        "hover:bg-slate-500/10",

        "hover:bg-gray-500/10",
        "hover:bg-zinc-500/10",
        "hover:bg-neutral-500/10",
        "hover:bg-stone-500/10",
        "hover:bg-red-600/10",
        "hover:bg-orange-600/10",
        "hover:bg-green-600/10",
        "hover:bg-blue-600/10",
        "hover:bg-purple-600/10",
        "hover:bg-pink-600/10"
    ];
    const loadStats = async () => {
        setIsbusy(true)
        try {
            const res = await DashboardService.getDashboardStats()
            setGroupes(res.data.groupes);
            setTransactions(res.data.transactions)
            setNbAdherents(res.data.nb_adherents)
            setNbAdherentsByGenre(res.data.nb_adherents_by_genre)
            setAdherentsActifsCount(res.data.adherents_actifs_count)
            setAdherentsActifs(res.data.adherents_actifs)
            setAdherentsThisMonth(res.data.AdherentsThisMonth)
            setAdherentsInactifsCount(res.data.adherents_inactifs_count)
            setAdherentsInactifs(res.data.adherents_inactifs)
            setFemmesActives(res.data.adherents_actifs.filter((a: any) => a.gender === "FEMME").length)
            setHommesActifs(res.data.adherents_actifs.filter((a: any) => a.gender === "HOMME").length)
            setIsbusy(false)
        } catch (err: any) {
            const backendErrors = err.response.data.errors;
            if (backendErrors) {
                const firstFieldErrors = Object.values(backendErrors)[0] as string[];
                if (firstFieldErrors && firstFieldErrors.length > 0) {
                    toast.error(firstFieldErrors[0]);
                }
            } else {
                toast.error("Erreur de chargement des données");
            }
            setIsbusy(false)
        }
    }
    useEffect(() => {
        loadStats()
    }, [])
    return (
        <div className="min-h-screen bg-red-700 m-2 rounded-2xl p-3">
            {isBusy && <Spinner />}
            <div className="space-y-8">
                {/* Cards Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    <div className="bg-gradient-to-r from-red-600 to-red-950 p-8 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-between">
                        <div>
                            <p className="text-red-100 text-sm font-medium text-center uppercase tracking-wide">Total Adhérents</p>
                            <p className="text-4xl font-bold text-white mt-2">{nbAdherents}</p>
                            <p className="text-green-200 text-sm mt-1">+{AdherentsThisMonth} ce mois</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-red-600 to-red-950 p-8 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-between">
                        <div>
                            <p className="text-red-100 text-sm font-medium text-center uppercase tracking-wide">Actifs</p>
                            <p className="text-4xl font-bold text-white mt-2">{adherentsActifsCount}</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-red-600 to-red-950 p-8 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-between">
                        <div>
                            <p className="text-red-100 text-sm font-medium text-center uppercase tracking-wide">Inactifs</p>
                            <p className="text-4xl font-bold text-white mt-2">{adherentsInactifsCount}</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-red-600 to-red-950 p-8 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-between">
                        <div>
                            <p className="text-red-100 text-sm font-medium text-center uppercase tracking-wide">Hommes Actifs</p>
                            <p className="text-4xl font-bold text-white mt-2">{hommesActifs}</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-red-600 to-red-950 p-8 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-between">
                        <div>
                            <p className="text-red-100 text-sm font-medium text-center uppercase tracking-wide">Femmes Actives</p>
                            <p className="text-4xl font-bold text-white mt-2">{femmesActives}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-red-600/90 to-red-950/90 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-red-500/30">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">Dernières (5 transactions) transactions</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-red-500/50">
                                    <th className=" py-4 text-red-100 font-semibold text-center uppercase tracking-wide">ID</th>
                                    <th className=" py-4 text-red-100 font-semibold text-center uppercase tracking-wide px-4">Adhérent</th>
                                    <th className=" py-4 text-red-100 font-semibold text-center uppercase tracking-wide px-4">Date </th>
                                    <th className=" py-4 text-red-100 font-semibold text-center uppercase tracking-wide px-4">Montant</th>
                                    <th className=" py-4 text-red-100 font-semibold text-center uppercase tracking-wide">Mode de paiment </th>
                                    <th className=" py-4 text-red-100 font-semibold text-center uppercase tracking-wide">Via</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-red-500/30">
                                {transactions && transactions.map((transaction, index) => (
                                    <tr
                                        key={transaction.id}
                                        className={`transition-colors duration-200 ${hoverColors[index % hoverColors.length]}`}
                                    >
                                        <td className="py-4 text-center font-medium text-white">{transaction.id}</td>

                                        <td className="py-4 text-center text-red-100 px-4">
                                            {transaction.adherent.firstName.toUpperCase()} {transaction.adherent.lastName.toUpperCase()}
                                        </td>

                                        <td className="py-4 text-center px-4">
                                            <span className="bg-green-500/20 text-green-200 px-3 py-1 rounded-full text-xs font-medium">
                                                {transaction.transactionDate}
                                            </span>
                                        </td>

                                        <td className="py-4 text-center px-4 text-red-100">
                                            {transaction.montant} DH
                                        </td>

                                        <td className="py-4 text-center px-4 text-red-200">
                                            {transaction.modePaiement}
                                        </td>

                                        <td className="py-4 text-center px-4 text-red-100">
                                            {transaction.user.firstName.toUpperCase()} {transaction.user.lastName.toUpperCase()}
                                        </td>
                                    </tr>
                                ))}

                                {transactions.length === 0 && (
                                    <tr className="hover:bg-white/10 transition-colors duration-200">
                                        <td className="py-4 text-center px-4 text-red-200" colSpan={6}>
                                            Aucune transaction aujourd'hui
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-red-600/90 to-red-950/90 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-red-500/30">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">Statistiques des abonnements</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-red-500/50">
                                    <th className=" py-4 text-red-100 font-semibold text-center uppercase tracking-wide">Groupe</th>
                                    <th className=" py-4 text-red-100 font-semibold text-center uppercase tracking-wide px-4">Titre</th>
                                    <th className=" py-4 text-red-100 font-semibold text-center uppercase tracking-wide px-4">durée</th>
                                    <th className=" py-4 text-red-100 font-semibold text-center uppercase tracking-wide px-4">prix</th>
                                    <th className=" py-4 text-red-100 font-semibold text-center uppercase tracking-wide">Subscriptions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-red-500/30">
                                {groupes && groupes.map((groupe) => {
                                    return groupe.abonnements.map((abonnement: any) => {
                                        return (
                                            <tr key={abonnement.id} className={`transition-colors duration-200 ${hoverColors[abonnement.id % hoverColors.length]}`}                                                >
                                                <td className="py-4 text-center font-medium text-white">{groupe.name.toUpperCase()}</td>
                                                <td className="py-4 text-center text-red-100 px-4">{abonnement.title.toUpperCase()}</td>
                                                <td className="py-4 text-center px-4">
                                                    <span className="bg-green-500/20 text-green-200 px-3 py-1 rounded-full text-xs font-medium">
                                                        {abonnement.durationMonths} MOIS
                                                    </span>
                                                </td>
                                                <td className="py-4 text-center px-4 text-red-100">{abonnement.price} DH</td>
                                                <td className="py-4 text-center px-4 text-red-200">{abonnement.nb_subscriptions} Adherent</td>
                                            </tr>
                                        )
                                    })
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

    )
}
