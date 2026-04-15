"use client";
import { clubsService } from "@/services/clubs.Service"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import Spinner from "@/components/ui/spinner"
import { clubType } from "@/lib/validators/clubs";
import { GroupeAbonnementType } from "@/lib/validators/groupeAbonnements";
import { AbonnementType } from "@/lib/validators/abonnements";
import { groupeAbonnementsService } from "@/services/groupeAbonnementsService";
import { AbonnementsService } from "@/services/abonnementService";
import Link from "next/link";
import { Download, RefreshCcw, UserCircle } from "lucide-react";
import { adherentType } from "@/lib/validators/adherents";
import { ServiceAdherent } from "@/services/adherentsService";
import LineLoader from "@/components/ui/LineLoader";
import { FilesService } from "@/services/filesServices";
import { downloadBlob } from "@/helpers/helpers";

export default function Transactions() {
    const [clubs, setClubs] = useState<clubType[]>([])
    const [isBusy, setIsBusy] = useState(false)
    const [onLoad, setOnLoad] = useState(false)
    const [activeTab, setActiveTab] = useState("abonnements")
    const [groupes, setGroupes] = useState<GroupeAbonnementType[] | null>(null)
    const [abonnements, setAbonnements] = useState<AbonnementType[] | null>(null)
    const [selectedClub, setSelectedClub] = useState<number | "">("");
    const [selectedGroupe, setSelectedGroupe] = useState<number | "">("");
    const [selectedAbonnement, setSelectedAbonnement] = useState<number | null>(null);
    const [adherents, setAdherents] = useState<adherentType[]>()

    const loadClubs = async () => {
        try {
            setIsBusy(true)
            const res = await clubsService.getAll()
            setClubs(res.data)
        } catch (err: any) {
            toast.error("Erreur lors de telechargement des clubs")
        } finally {
            setIsBusy(false)
        }
    }
    const loadGroupesByClubId = async (clubId: number) => {
        setIsBusy(true);
        setSelectedClub(clubId);
        setSelectedGroupe("");
        setSelectedAbonnement(null);
        setGroupes(null);
        setAbonnements(null);
        try {
            const res = await groupeAbonnementsService.getGroupesByClubId(clubId);
            setGroupes(res.data);
        } catch (error) {
            toast.error("Erreur lors du chargement des groupes");
        }
        setIsBusy(false);
    };
    const loadAbonnementsBuGroupe = async (groupeId: number) => {
        setIsBusy(true);

        setSelectedGroupe(groupeId);
        setSelectedAbonnement(null);
        setAbonnements(null);

        try {
            const res = await AbonnementsService.getByGroupe(groupeId);
            setAbonnements(res.data);
        } catch (error) {
            toast.error("Erreur lors du chargement des abonnements");
        }

        setIsBusy(false);
    };
    const loadAdherentsByAbonnements = async (abonnementId: number) => {
        try {
            setOnLoad(true)
            const res = await ServiceAdherent.getAdherentsByAbonnements(abonnementId)
            setAdherents([])
            setAdherents(res.data)
        } catch (err: any) {
            toast.error("Erreur lors de telechargement des adherents")
        } finally {
            setOnLoad(false)
        }
    }
    const loadAdhrentsActifs = async () => {
        try {
            setOnLoad(true)
            const res = await ServiceAdherent.getAdherentsActifs()
            setAdherents([])
            setAdherents(res.data)
        } catch (err: any) {
            toast.error("Erreur lors de telechargement des adherents")
        } finally {
            setOnLoad(false)
        }
    }
    const loadAdhrentsInActifs = async () => {
        try {
            setOnLoad(true)
            const res = await ServiceAdherent.getAdherentsInActifs()
            setAdherents([])
            setAdherents(res.data)
        } catch (err: any) {
            toast.error("Erreur lors de telechargement des adherents")
        } finally {
            setOnLoad(false)
        }
    }
    const getAdherentsThatHasRemainingAmount = async () => {
        try {
            setOnLoad(true)
            const res = await ServiceAdherent.getAdherentsThatHasRemainingAmount()
            setAdherents([])
            setAdherents(res.data)
        } catch (err: any) {
            toast.error("Erreur lors de telechargement des adherents")
        } finally {
            setOnLoad(false)
        }
    }
    const downloadActiveAdherents = async () => {
        setIsBusy(true);

        try {
            const response = await FilesService.downloadActiveAdherents()
            let filename = `adherentsActifs.xlsx`
            downloadBlob(response.data, filename);
            toast.success('File téléchargé !');
        } catch (err) {
            toast.error('Probléme téléchargement');
        } finally {
            setIsBusy(false);
        }
    }
    const downloadInActiveAdherents = async () => {
        setIsBusy(true);
        try {
            const response = await FilesService.downloadInActiveAdherents()
            let filename = `adherentsInActifs.xlsx`
            downloadBlob(response.data, filename);
            toast.success('File téléchargé !');
        } catch (err) {
            toast.error('Probléme téléchargement');
        } finally {
            setIsBusy(false);
        }
    }
    const downloadAdherentsHasRemainingAmount = async () => {
        setIsBusy(true);
        try {
            const response = await FilesService.downloadAdherentsHasRemainingAmount()
            let filename = `Adhérents-ayant-reste-paiement.xlsx`
            downloadBlob(response.data, filename);
            toast.success('File téléchargé !');
        } catch (err) {
            toast.error('Probléme téléchargement');
        } finally {
            setIsBusy(false);
        }
    }
    const downLoadAdherentsByAbonnements = async (abonnementId: number) => {
        setIsBusy(true);
        try {
            const response = await FilesService.downLoadAdherentsByAbonnements(abonnementId)
            let filename = `Adhérents-by-abonnements.xlsx`
            downloadBlob(response.data, filename);
            toast.success('File téléchargé !');
        } catch (err) {
            toast.error('Probléme téléchargement');
        } finally {
            setIsBusy(false);
        }
    }
    useEffect(() => {
        loadClubs()
    }, [])

    return (
        <>
            <div className="bg-red-100 dark:bg-black m-2 p-2 rounded-lg">
                {isBusy && <Spinner />}
                <div className="flex bg-white/50 dark:bg-black/50 backdrop-blur-sm border-b border-red-200/50 rounded-t-lg mb-4 overflow-x-auto">
                    <button
                        onClick={() => { setAdherents([]); setActiveTab("abonnements") }}
                        className={`px-6 py-3 font-semibold text-sm flex-1 text-center cursor-pointer transition-all duration-200 border-b-2 ${activeTab === "clubs"
                            ? "border-red-500 text-red-700 bg-red-50 shadow-sm"
                            : "border-transparent text-gray-600 hover:text-red-600 hover:bg-red-50/50"
                            }`}
                    >
                        Abonnements
                    </button>
                    <button
                        onClick={() => { setActiveTab("actifs"); setAdherents([]); loadAdhrentsActifs() }}
                        className={`px-6 py-3 font-semibold text-sm flex-1 text-center cursor-pointer transition-all duration-200 border-b-2 ${activeTab === "actifs"
                            ? "border-red-500 text-red-700 bg-red-50 shadow-sm"
                            : "border-transparent text-gray-600 hover:text-red-600 hover:bg-red-50/50"
                            }`}
                    >
                        Actifs
                    </button>
                    <button
                        onClick={() => { setAdherents([]); setActiveTab("inactifs"); loadAdhrentsInActifs() }}
                        className={` px-6 py-3 font-semibold text-sm flex-1 text-center cursor-pointer transition-all duration-200 border-b-2 ${activeTab === "inactifs"
                            ? "border-red-500 text-red-700 bg-red-50 shadow-sm"
                            : "border-transparent text-gray-600 hover:text-red-600 hover:bg-red-50/50"
                            }`}
                    >
                        Inactifs
                    </button>
                    <button
                        onClick={() => { setAdherents([]); setActiveTab("remaininAmount"); getAdherentsThatHasRemainingAmount() }}
                        className={` px-6 py-3 font-semibold text-sm flex-1 text-center cursor-pointer transition-all duration-200 border-b-2 ${activeTab === "remaininAmount"
                            ? "border-red-500 text-red-700 bg-red-50 shadow-sm"
                            : "border-transparent text-gray-600 hover:text-red-600 hover:bg-red-50/50"
                            }`}
                    >
                        Reste de paiement
                    </button>
                </div>

                {/* Contenu des tabs */}
                <div className="mt-3">
                    <div className="relative overflow-x-auto shadow-lg rounded-lg border border-red-200/50 bg-white/70 dark:bg-black/70 backdrop-blur-sm">

                        {activeTab === "abonnements" && (
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-red-800 mb-6">Abonnements</h2>

                                {/* 3 inputs select responsive */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 bg-red-50/50 rounded-xl border-2 border-red-100">
                                    <div>
                                        <label className="block text-sm font-semibold text-red-800 mb-2">Club</label>
                                        <select className="w-full p-3 bg-white border-2 border-red-200 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-transparent shadow-sm hover:shadow-md transition-all"
                                            value={selectedClub || ""}  // Ajout de la value contrôlée
                                            onChange={(e: any) => {
                                                const value = e.target.value;
                                                if (!value) {
                                                    // Si on remet à vide, vider tout
                                                    setGroupes([]);
                                                    setAbonnements([]);
                                                    setAdherents([]);
                                                    setSelectedAbonnement(null);
                                                    setSelectedClub("");
                                                    return;
                                                }

                                                // Nouveau club sélectionné : vider tout et charger
                                                setSelectedClub(value);
                                                setGroupes([]);           // Vider groupes
                                                setAbonnements([]);       // Vider abonnements  
                                                setAdherents([]);         // Vider adherents
                                                setSelectedAbonnement(null);
                                                loadGroupesByClubId(Number(value));  // Charger nouveaux groupes
                                            }}
                                        >
                                            <option value="">Choisir un club</option>
                                            {clubs.length > 0 ? (
                                                clubs.map((club) => (
                                                    <option key={club.id} value={club.id}>
                                                        {club.name.toUpperCase()}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="">Aucun club trouvé</option>
                                            )}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-red-800 mb-2">Groupes</label>
                                        <select className="w-full p-3 bg-white border-2 border-red-200 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-transparent shadow-sm hover:shadow-md transition-all"
                                            value={selectedGroupe || ""}  // Contrôlé
                                            onChange={(e: any) => {
                                                const value = e.target.value;
                                                if (!value) {
                                                    setAbonnements([]);
                                                    setAdherents([]);
                                                    setSelectedAbonnement(null);
                                                    return;
                                                }
                                                setSelectedGroupe(value);
                                                setAbonnements([]);
                                                setAdherents([]);
                                                setSelectedAbonnement(null);
                                                loadAbonnementsBuGroupe(Number(value));
                                            }}
                                        >
                                            <option value="" disabled>
                                                {isBusy
                                                    ? "Chargement..."
                                                    : groupes && groupes.length > 0
                                                        ? "Choisir un groupe"
                                                        : "Aucun groupe disponible"}
                                            </option>
                                            {groupes && groupes.length > 0 &&
                                                groupes.map((groupe) => (
                                                    <option key={groupe.id} value={groupe.id}>
                                                        {groupe.name.toUpperCase()}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-red-800 mb-2">Abonnements</label>
                                        <select className="w-full p-3 bg-white border-2 border-red-200 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-transparent shadow-sm hover:shadow-md transition-all"
                                            value={selectedAbonnement || ""}
                                            disabled={!abonnements || abonnements.length === 0}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (!value) {
                                                    setAdherents([]);
                                                    return;
                                                }
                                                loadAdherentsByAbonnements(Number(value));
                                                setSelectedAbonnement(Number(value));
                                            }}
                                        >
                                            <option value="">
                                                {isBusy
                                                    ? "Chargement..."
                                                    : abonnements && abonnements.length > 0
                                                        ? "Choisir un abonnement"
                                                        : "Aucun abonnement disponible"}
                                            </option>

                                            {abonnements && abonnements.length > 0 &&
                                                abonnements.map((abonnement) => (
                                                    <option key={abonnement.id} value={abonnement.id}>
                                                        {abonnement.title.toUpperCase()}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="flex ">
                                        <button
                                            className="cursor-pointer mr-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                            onClick={(() => setAdherents([]))}>
                                            <RefreshCcw/>
                                        </button>
                                        {
                                            selectedAbonnement && (
                                                <button
                                                    className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                                    onClick={(() => downLoadAdherentsByAbonnements(Number(selectedAbonnement)))}>
                                                    <Download />
                                                </button>
                                            )
                                        }
                                    </div>
                                </div>
                                <div className="relative overflow-x-auto shadow-xs rounded-base border border-default rounded-lg">

                                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className=" bg-gradient-to-r from-red-600 via-red-700 to-red-900 text-white">
                                                    <tr>
                                                        <th className="px-1.5 py-2 text-center font-bold uppercase text-xs tracking-wider">ID</th>
                                                        <th className="px-1.5 py-2 text-center font-bold uppercase text-xs tracking-wider">CIN</th>
                                                        <th className="px-1.5 py-2 text-center font-bold uppercase text-xs tracking-wider">Nom Complet</th>
                                                        <th className="px-1.5 py-2 text-center font-bold uppercase text-xs tracking-wider">Téléphone</th>
                                                        <th className="px-1.5 py-2 text-center font-bold uppercase text-xs tracking-wider">Date d'inscription</th>
                                                        <th className="px-1.5 py-2 text-center font-bold uppercase text-xs tracking-wider">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {onLoad && (
                                                        <tr>
                                                            <td colSpan={6}>
                                                                <LineLoader />
                                                            </td>
                                                        </tr>
                                                    )}
                                                    {
                                                        adherents && adherents.length > 0 ? (
                                                            adherents.map((adherent) => (
                                                                <tr
                                                                    key={adherent.id}
                                                                    className="hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 transition-all duration-200 border-b border-gray-100"
                                                                >
                                                                    <td className="px-1 text-center whitespace-nowrap">
                                                                        <span className="font-mono bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold">
                                                                            {adherent.id}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-1 text-center whitespace-nowrap">
                                                                        <span className="font-mono bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold">
                                                                            {adherent.cin}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-1 hover:underline hover:cursor-pointe text-center text-lg text-gray-900">
                                                                        <Link
                                                                            href={`/adherents/${adherent.id}/fiche`}
                                                                            title="Fiche adhérent">
                                                                            {adherent.firstName} {adherent.lastName}

                                                                        </Link>
                                                                    </td>

                                                                    <td className="px-1 text-center whitespace-nowrap">
                                                                        <span className="text-sm font-mono bg-blue-50 text-blue-800 px-3 py-1 rounded-full">
                                                                            {adherent.phonePrimary}
                                                                        </span>
                                                                    </td>

                                                                    <td className="px-1 text-center whitespace-nowrap">
                                                                        <span className="text-sm text-gray-600 font-medium">
                                                                            {adherent.registrationDate}
                                                                        </span>
                                                                    </td>

                                                                    <td className="px-2 py-2 whitespace-nowrap text-sm">
                                                                        <div className="flex space-x-2 justify-center">
                                                                            <Link
                                                                                href={`/adherents/${adherent.id}/fiche`}
                                                                                className="p-1 cursor-pointer text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                                                                                title="Fiche adhérent"
                                                                            >
                                                                                <UserCircle size={20} />
                                                                            </Link>

                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan={6} className="text-center py-2 text-gray-500 font-semibold">
                                                                    Aucun adhérent trouvé
                                                                </td>
                                                            </tr>
                                                        )
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )}

                        {activeTab === "actifs" && (
                            <div className="p-2">
                                <h2 className="text-2xl font-bold text-red-800 mb-2 flex items-center">Adherents Actifs <Download className="ml-2 mt-0.5 cursor-pointer text-red-500" onClick={() => downloadActiveAdherents()} /></h2>
                                <div className="text-start py-4 text-gray-500 bg-red-50/50 rounded-3xl p-2 border-2 border-dashed border-red-200">
                                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className=" bg-gradient-to-r from-red-600 via-red-700 to-red-900 text-white">
                                                    <tr>
                                                        <th className="px-1.5 py-2 text-center font-bold uppercase text-xs tracking-wider">ID</th>
                                                        <th className="px-1.5 py-2 text-center font-bold uppercase text-xs tracking-wider">CIN</th>
                                                        <th className="px-1.5 py-2 text-center font-bold uppercase text-xs tracking-wider">Nom Complet</th>
                                                        <th className="px-1.5 py-2 text-center font-bold uppercase text-xs tracking-wider">Téléphone</th>
                                                        <th className="px-1.5 py-2 text-center font-bold uppercase text-xs tracking-wider">Date d'inscription</th>
                                                        <th className="px-1.5 py-2 text-center font-bold uppercase text-xs tracking-wider">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {onLoad && (
                                                        <tr>
                                                            <td colSpan={6}>
                                                                <LineLoader />
                                                            </td>
                                                        </tr>
                                                    )}
                                                    {
                                                        adherents && adherents.length > 0 ? (
                                                            adherents.map((adherent) => (
                                                                <tr
                                                                    key={adherent.id}
                                                                    className="hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 transition-all duration-200 border-b border-gray-100"
                                                                >
                                                                    <td className="px-1 text-center whitespace-nowrap">
                                                                        <span className="font-mono bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold">
                                                                            {adherent.id}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-1 text-center whitespace-nowrap">
                                                                        <span className="font-mono bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold">
                                                                            {adherent.cin}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-1 hover:underline hover:cursor-pointe text-center text-lg text-gray-900">
                                                                        <Link
                                                                            href={`/adherents/${adherent.id}/fiche`}
                                                                            title="Fiche adhérent">
                                                                            {adherent.firstName} {adherent.lastName}

                                                                        </Link>
                                                                    </td>

                                                                    <td className="px-1 text-center whitespace-nowrap">
                                                                        <span className="text-sm font-mono bg-blue-50 text-blue-800 px-3 py-1 rounded-full">
                                                                            {adherent.phonePrimary}
                                                                        </span>
                                                                    </td>

                                                                    <td className="px-1 text-center whitespace-nowrap">
                                                                        <span className="text-sm text-gray-600 font-medium">
                                                                            {adherent.registrationDate}
                                                                        </span>
                                                                    </td>

                                                                    <td className="px-2 py-2 whitespace-nowrap text-sm">
                                                                        <div className="flex space-x-2 justify-center">
                                                                            <Link
                                                                                href={`/adherents/${adherent.id}/fiche`}
                                                                                className="p-1 cursor-pointer text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                                                                                title="Fiche adhérent"
                                                                            >
                                                                                <UserCircle size={20} />
                                                                            </Link>

                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan={6} className="text-center py-2 text-gray-500 font-semibold">
                                                                    Aucun adhérent trouvé
                                                                </td>
                                                            </tr>
                                                        )
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "inactifs" && (
                            <div className="p-2">
                                <h2 className="text-2xl font-bold text-red-800 mb-2 flex items-center">Adherents Inactifs <Download className="ml-2 mt-0.5 cursor-pointer text-red-500" onClick={() => downloadInActiveAdherents()} /></h2>
                                <div className="text-start py-4 text-gray-500 bg-red-50/50 rounded-3xl p-2 border-2 border-dashed border-red-200">
                                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className=" bg-gradient-to-r from-red-600 via-red-700 to-red-900 text-white">
                                                    <tr>
                                                        <th className="px-1.5 py-2 text-center font-bold uppercase text-xs tracking-wider">ID</th>
                                                        <th className="px-1.5 py-2 text-center font-bold uppercase text-xs tracking-wider">CIN</th>
                                                        <th className="px-1.5 py-2 text-center font-bold uppercase text-xs tracking-wider">Nom Complet</th>
                                                        <th className="px-1.5 py-2 text-center font-bold uppercase text-xs tracking-wider">Téléphone</th>
                                                        <th className="px-1.5 py-2 text-center font-bold uppercase text-xs tracking-wider">Date d'inscription</th>
                                                        <th className="px-1.5 py-2 text-center font-bold uppercase text-xs tracking-wider">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {onLoad && (
                                                        <tr>
                                                            <td colSpan={6}>
                                                                <LineLoader />
                                                            </td>
                                                        </tr>
                                                    )}
                                                    {
                                                        adherents && adherents.length > 0 ? (
                                                            adherents.map((adherent) => (
                                                                <tr
                                                                    key={adherent.id}
                                                                    className="hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 transition-all duration-200 border-b border-gray-100"
                                                                >
                                                                    <td className="px-1 text-center whitespace-nowrap">
                                                                        <span className="font-mono bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold">
                                                                            {adherent.id}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-1 text-center whitespace-nowrap">
                                                                        <span className="font-mono bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold">
                                                                            {adherent.cin}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-1 hover:underline hover:cursor-pointe text-center text-lg text-gray-900">
                                                                        <Link
                                                                            href={`/adherents/${adherent.id}/fiche`}
                                                                            title="Fiche adhérent">
                                                                            {adherent.firstName} {adherent.lastName}

                                                                        </Link>
                                                                    </td>

                                                                    <td className="px-1 text-center whitespace-nowrap">
                                                                        <span className="text-sm font-mono bg-blue-50 text-blue-800 px-3 py-1 rounded-full">
                                                                            {adherent.phonePrimary}
                                                                        </span>
                                                                    </td>

                                                                    <td className="px-1 text-center whitespace-nowrap">
                                                                        <span className="text-sm text-gray-600 font-medium">
                                                                            {adherent.registrationDate}
                                                                        </span>
                                                                    </td>

                                                                    <td className="px-2 py-2 whitespace-nowrap text-sm">
                                                                        <div className="flex space-x-2 justify-center">
                                                                            <Link
                                                                                href={`/adherents/${adherent.id}/fiche`}
                                                                                className="p-1 cursor-pointer text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                                                                                title="Fiche adhérent"
                                                                            >
                                                                                <UserCircle size={20} />
                                                                            </Link>

                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan={6} className="text-center py-2 text-gray-500 font-semibold">
                                                                    Aucun adhérent trouvé
                                                                </td>
                                                            </tr>
                                                        )
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === "remaininAmount" && (
                            <div className="p-2">
                                <h2 className="text-2xl font-bold text-red-800 mb-2 flex items-center">Adhérents ayant un reste de paiement <Download className="ml-2 mt-0.5 cursor-pointer text-red-500" onClick={() => downloadAdherentsHasRemainingAmount()} /></h2>

                                <div className="text-start py-4 text-gray-500 bg-red-50/50 rounded-3xl p-2 border-2 border-dashed border-red-200">
                                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className=" bg-gradient-to-r from-red-600 via-red-700 to-red-900 text-white">
                                                    <tr>
                                                        <th className="px-1.5 py-2 text-center font-bold uppercase text-xs tracking-wider">ID</th>
                                                        <th className="px-1.5 py-2 text-center font-bold uppercase text-xs tracking-wider">CIN</th>
                                                        <th className="px-1.5 py-2 text-center font-bold uppercase text-xs tracking-wider">Nom Complet</th>
                                                        <th className="px-1.5 py-2 text-center font-bold uppercase text-xs tracking-wider">Téléphone</th>
                                                        <th className="px-1.5 py-2 text-center font-bold uppercase text-xs tracking-wider">Date d'inscription</th>
                                                        <th className="px-1.5 py-2 text-center font-bold uppercase text-xs tracking-wider">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {onLoad && (
                                                        <tr>
                                                            <td colSpan={6}>
                                                                <LineLoader />
                                                            </td>
                                                        </tr>
                                                    )}
                                                    {
                                                        adherents && adherents.length > 0 ? (
                                                            adherents.map((adherent) => (
                                                                <tr
                                                                    key={adherent.id}
                                                                    className="hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 transition-all duration-200 border-b border-gray-100"
                                                                >
                                                                    <td className="px-1 text-center whitespace-nowrap">
                                                                        <span className="font-mono bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold">
                                                                            {adherent.id}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-1 text-center whitespace-nowrap">
                                                                        <span className="font-mono bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold">
                                                                            {adherent.cin}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-1 hover:underline hover:cursor-pointe text-center text-lg text-gray-900">
                                                                        <Link
                                                                            href={`/adherents/${adherent.id}/fiche`}
                                                                            title="Fiche adhérent">
                                                                            {adherent.firstName} {adherent.lastName}

                                                                        </Link>
                                                                    </td>

                                                                    <td className="px-1 text-center whitespace-nowrap">
                                                                        <span className="text-sm font-mono bg-blue-50 text-blue-800 px-3 py-1 rounded-full">
                                                                            {adherent.phonePrimary}
                                                                        </span>
                                                                    </td>

                                                                    <td className="px-1 text-center whitespace-nowrap">
                                                                        <span className="text-sm text-gray-600 font-medium">
                                                                            {adherent.registrationDate}
                                                                        </span>
                                                                    </td>

                                                                    <td className="px-2 py-2 whitespace-nowrap text-sm">
                                                                        <div className="flex space-x-2 justify-center">
                                                                            <Link
                                                                                href={`/adherents/${adherent.id}/fiche`}
                                                                                className="p-1 cursor-pointer text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                                                                                title="Fiche adhérent"
                                                                            >
                                                                                <UserCircle size={20} />
                                                                            </Link>

                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan={6} className="text-center py-2 text-gray-500 font-semibold">
                                                                    Aucun adhérent trouvé
                                                                </td>
                                                            </tr>
                                                        )
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}