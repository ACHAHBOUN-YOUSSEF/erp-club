"use client";
import DeleteAdherent from "@/components/ui/modals/adherents/delete";
import EditAdherent from "@/components/ui/modals/adherents/edit";
import LogsHistory from "@/components/ui/modals/log/LogsModal";
import NewPeriode from "@/components/ui/modals/periodes/create";
import DeletePeriode from "@/components/ui/modals/periodes/delete";
import EditPeriode from "@/components/ui/modals/periodes/edit";
import NewSubscription from "@/components/ui/modals/subscriptions/create";
import DeleteSubscriptions from "@/components/ui/modals/subscriptions/delete";
import EditSubscription from "@/components/ui/modals/subscriptions/edit";
import TransactionsHistory from "@/components/ui/modals/transactions/transactionsLog";
import Spinner from "@/components/ui/spinner";
import { downloadBlob } from "@/helpers/helpers";
import { usePermission } from "@/hooks/usePermission";
import { adherentType } from "@/lib/validators/adherents";
import { PeriodeType } from "@/lib/validators/periodes";
import { SubscriptionType } from "@/lib/validators/subscriptions";
import { ServiceAdherent } from "@/services/adherentsService";
import { clubsService } from "@/services/clubs.Service";
import { FilesService } from "@/services/filesServices";
import { PeriodeService } from "@/services/periode.Service";
import { SubscriptionService } from "@/services/subscrptionService";
import { Download, Edit, File, FileDown, FileIcon, FilePlus, FileText, RefreshCcw, Trash2, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export default function AdherentFiche() {
    const router = useRouter()
    const params = useParams()
    const [clubs, setClubs] = useState([])
    const [isBusy, setIsBusy] = useState(false)
    const [isOpneModalDeleteAdherent, setIsOpneModalDeleteAdherent] = useState(false)
    const [isOpneModalNewSubscription, setisOpneModalNewSubscription] = useState(false)
    const [isOpneModalNewPeriode, setisOpneModalNewPeriode] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [AherentIdToDelete, setAherentIdToDelete] = useState<number | null>(null)
    const [adherentId, setAdherentId] = useState<number>()
    const [adherent, setAdherent] = useState<adherentType | null>(null)
    const id = Number(params.id as string)
    const [openDownloadId, setOpenDownloadId] = useState<number | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const [subscriptionId, setSubscriptionId] = useState<number | null>(null)
    const [periodeId, setPeriodeId] = useState<number | null>(null)
    const [isOpneModalDeletesubscription, setIsOpneModalDeletesubscription] = useState(false)
    const [isOpneModalDeletePeriode, setIsOpneModalDeletePeriode] = useState(false)
    const [periodeToEdit, setPeriodeToEdit] = useState<PeriodeType | null>(null)
    const [isOpneModalEditPeriode, setIsOpneModalEditPeriode] = useState(false)
    const [isDeletingPeriode, setIsDeletingPeriode] = useState(false)
    const [subscriptionOnEdit, setSubscriptionOnEdit] = useState<SubscriptionType | null>(null)
    const [adherentToEdit, setAdherentToEdit] = useState<adherentType | null>(null)
    const [isOpneModalEditAdherent, setIsOpneModalEditAdherent] = useState(false)
    const CanDeleteUser = usePermission("delete")
    const handleDelete = (id: number) => {
        setAherentIdToDelete(id)
        setIsOpneModalDeleteAdherent(true)
    }
    const handleDeleteSubscription = (id: number) => {
        setSubscriptionId(id)
        setIsOpneModalDeletesubscription(true)
    }
    const handleDeletePeriode = (id: number) => {
        setPeriodeId(id)
        setIsOpneModalDeletePeriode(true)
    }
    const handleEditSubscription = async (id: number) => {
        try {
            setIsBusy(true)
            const res = await SubscriptionService.getById(id)
            setSubscriptionOnEdit(res.data);
            setIsBusy(false)
        } catch (err: any) {
            if (err.response?.status === 422) {
                const backendErrors = err.response.data.errors;
                if (backendErrors) {
                    const firstFieldErrors = Object.values(backendErrors)[0] as string[];
                    if (firstFieldErrors && firstFieldErrors.length > 0) {
                        toast.error(firstFieldErrors[0]);
                    }
                } else {
                    toast.error("Probléme de téléchargement ");
                }
            } else {
                toast.error(err.message || "Probléme serveur");
            }
            setIsBusy(false)

        }
    }
    const loadClubs = async () => {
        try {
            const res = await clubsService.getAll()
            setClubs(res.data)

        } catch (err: any) {
            toast.error("Probléme lors de telechargement de clubs")
        }
    }
    const confiDeleteSubscriptions = async () => {
        setIsDeleting(true)

        try {
            const res = await SubscriptionService.delete(Number(subscriptionId))
            toast.success(res.message)
            setIsDeleting(false)
            setIsOpneModalDeletesubscription(false)
            loadAdherentInfos(id)
        } catch (err: any) {
            const backendErrors = err.response.data.errors;
            if (backendErrors) {
                const firstFieldErrors = Object.values(backendErrors)[0] as string[];
                if (firstFieldErrors && firstFieldErrors.length > 0) {
                    toast.error(firstFieldErrors[0]);
                }
            } else {
                toast.error("Probléme de suppresion inconnue");
            }
            setIsDeleting(false)
        }
    }
    const confirmDeletePeriode = async () => {
        setIsDeletingPeriode(true)
        try {
            const res = await PeriodeService.delete(Number(periodeId))
            toast.success(res.message)
            setIsDeletingPeriode(false)
            setIsOpneModalDeletePeriode(false)
            loadAdherentInfos(id)
        } catch (err: any) {
            const backendErrors = err.response.data.errors;
            if (backendErrors) {
                const firstFieldErrors = Object.values(backendErrors)[0] as string[];
                if (firstFieldErrors && firstFieldErrors.length > 0) {
                    toast.error(firstFieldErrors[0]);
                }
            } else {
                toast.error("Probléme de suppresion inconnue");
            }
            setIsDeletingPeriode(false)
        }
    }
    const confirmDelete = async () => {
        setIsDeleting(true)
        try {
            const res = await ServiceAdherent.delete(Number(AherentIdToDelete))
            toast.success(res.message)
            setIsDeleting(false)
            setIsOpneModalDeleteAdherent(false)
            router.push("/adherents")
        } catch (err: any) {
            const backendErrors = err.response.data.errors;
            if (backendErrors) {
                const firstFieldErrors = Object.values(backendErrors)[0] as string[];
                if (firstFieldErrors && firstFieldErrors.length > 0) {
                    toast.error(firstFieldErrors[0]);
                }
            } else {
                toast.error("Probléme de suppresion inconnue");
            }
            setIsDeleting(false)
        }
    }
    const loadAdherentInfos = async (id: number) => {
        setIsBusy(true)
        try {
            const res = await ServiceAdherent.get(id)
            setAdherent(res.data)
        } catch {
            toast.error("Probléme lors du chargement de l'adherent")
        } finally {
            setIsBusy(false)
        }
    }
    const handleEdit = async (id: number) => {
        try {
            setIsBusy(true)
            const res = await ServiceAdherent.get(id)
            setAdherentToEdit(res.data)
            setIsOpneModalEditAdherent(true)
            setIsBusy(false)
        } catch (err: any) {
            if (err.response?.status === 422) {
                const backendErrors = err.response.data.errors;
                if (backendErrors) {
                    const firstFieldErrors = Object.values(backendErrors)[0] as string[];
                    if (firstFieldErrors && firstFieldErrors.length > 0) {
                        toast.error(firstFieldErrors[0]);
                    }
                } else {
                    toast.error("Probléme de téléchargement ");
                }
            } else {
                toast.error(err.message || "Probléme serveur");
            }
            setIsBusy(false)
        }
    }
    const handleEditPeriode = async (id: number) => {
        setIsBusy(true)
        try {
            const res = await PeriodeService.getOne(id)
            toast.success(res.message)
            setPeriodeToEdit(res.data)
            setIsOpneModalEditPeriode(true)
            setIsBusy(false)
        } catch (err: any) {
            if (err.response?.status === 422) {
                const backendErrors = err.response.data.errors;
                if (backendErrors) {
                    const firstFieldErrors = Object.values(backendErrors)[0] as string[];
                    if (firstFieldErrors && firstFieldErrors.length > 0) {
                        toast.error(firstFieldErrors[0]);
                    }
                } else {
                    toast.error("Probléme de téléchargement ");
                }
            } else {
                toast.error(err.message || "Probléme serveur");
            }
            setIsBusy(false)
        }
    }
    useEffect(() => {
        loadClubs();
        loadAdherentInfos(id);
    }, [id]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpenDownloadId(null);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const DownloadContrat = async (subscription: SubscriptionType) => {
        setOpenDownloadId(null)
        setIsBusy(true);
        try {
            const response = await FilesService.DownloadContrant(Number(subscription.id));
            let filename = `contrat--${adherent?.firstName.toLowerCase() + " " + adherent?.lastName.toLocaleLowerCase()}--${subscription.id}.docx`
            downloadBlob(response.data, filename);
            console.log(response);

            toast.success('Contrat téléchargé !');
        } catch (err) {
            toast.error('Probléme téléchargement');
        } finally {
            setIsBusy(false);
        }
    }
    const DownloadFacture = async (subscription: SubscriptionType) => {
        setOpenDownloadId(null)
        setIsBusy(true);
        try {
            const response = await FilesService.DownloadFacture(Number(subscription.id));
            let filename = `facture--${adherent?.firstName.toLowerCase() + " " + adherent?.lastName.toLocaleLowerCase()}--${subscription.id}.docx`
            downloadBlob(response.data, filename);
            toast.success('Facture téléchargé !');
        } catch (err) {
            toast.error('Probléme téléchargement');
        } finally {
            setIsBusy(false);
        }
    }
    const DownloadRecuPeriode = async (id: number) => {
        setIsBusy(true);
        try {
            const response = await FilesService.DownloadRecuPeriode(Number(id));
            let filename = `recus--(${adherent?.firstName.toLowerCase() + "--" + adherent?.lastName.toLocaleLowerCase()})--${id}.docx`
            downloadBlob(response.data, filename);
            toast.success('Recus téléchargé !');
        } catch (err) {
            console.log(err);

            toast.error('Probléme téléchargement');
        } finally {
            setIsBusy(false);
        }
    }
    const DownloadRecuSubscription = async (subscription: SubscriptionType) => {
        setOpenDownloadId(null)
        setIsBusy(true);
        try {
            const response = await FilesService.DownloadRecuSubscription(Number(subscription.id));
            let filename = `recus--${adherent?.firstName.toLowerCase() + " " + adherent?.lastName.toLocaleLowerCase()}--${subscription.id}.docx`
            downloadBlob(response.data, filename);
            toast.success('Recu téléchargé !');
        } catch (err) {
            toast.error('Probléme téléchargement');
        } finally {
            setIsBusy(false);
        }

    }
    return (
        <div className="p-2 mt-2 min-h-screen">
            {isBusy && <Spinner />}
            <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl p-6 space-y-8" ref={dropdownRef}>

                {/* HEADER */}
                <div className="border-b pb-4">
                    <h1 className="text-3xl font-bold text-red-700">
                        Fiche Adhérent
                    </h1>
                </div>

                {/* INFORMATIONS PERSONNELLES */}
                <section className="bg-gray-50 rounded-xl p-4 shadow">
                    <h2 className="text-xl font-bold text-red-600 mb-4">
                        Informations Personnelles
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <Info label="ID" value={adherent?.id} />
                        <Info label="CIN" value={adherent?.cin?.toLocaleUpperCase()} />
                        <Info label="Nom & Prénom" value={`${adherent?.firstName.toLocaleUpperCase()} ${adherent?.lastName.toLocaleUpperCase()}`} />
                        <Info label="Branche" value={adherent?.club?.name} />
                        <Info label="Téléphone" value={adherent?.phonePrimary} />
                        <Info label="Téléphone Secondaire" value={adherent?.phoneSecondary} />
                        <Info label="Genre" value={adherent?.gender} />
                        <Info label="Date Inscription" value={adherent?.registrationDate} />
                        <Info label="Date fin assurance" value={adherent?.insuranceEndDate} />
                        <Info
                            label="Status"
                            value={
                                adherent?.resteJoursAssurance! > 0 ? (
                                    <span className="text-green-600 font-semibold">Assurée</span>
                                ) : (
                                    <span className="text-red-600 font-semibold">Non Assurée</span>
                                )
                            }
                        />
                        <Info label="Reste jours" value={`${adherent?.resteJoursAssurance} jours`} />
                        <Info label="Ajoutè par " value={`${adherent?.addedBy?.toLocaleUpperCase()}`} />
                    </div>
                </section>
                <div>
                    <div className="flex justify-start">
                        <button onClick={() => { setisOpneModalNewSubscription(true); setAdherentId(adherent?.id) }} className="cursor-pointer p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200">
                            <FilePlus />
                        </button>
                        <button onClick={() => { setisOpneModalNewPeriode(true) }} className="cursor-pointer p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200">
                            <File />
                        </button>
                        <button onClick={() => handleEdit(id)} className="cursor-pointer p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200">
                            <Edit />
                        </button>
                        {
                            CanDeleteUser && (
                                <button onClick={() => handleDelete(Number(adherent?.id))}
                                    className="cursor-pointer p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                                >
                                    <Trash2 />
                                </button>
                            )
                        }
                        <button onClick={() => loadAdherentInfos(id)}
                            className="cursor-pointer p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                        >
                            <RefreshCcw />
                        </button>
                    </div>
                </div>
                {
                    adherent?.subscriptions && adherent.subscriptions.length > 0 ? (
                        <section className="bg-gray-50 rounded-xl p-4  shadow">
                            <h2 className="text-xl font-bold text-red-600 mb-4">
                                Historique des subscriptions
                            </h2>
                            <div className="w-full overflow-x-auto">
                                <table className="min-w-full divide-y rounded-2xl   shadow-2xl rounded-2xl bg-white">
                                    <thead className="bg-gradient-to-r from-red-700/10 to-red-600 sticky top-0">
                                        <tr>
                                            <th className="py-2 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                                                Groupe
                                            </th>
                                            <th className="py-2 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                                                Type
                                            </th>
                                            <th className="py-2 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                                                Prix
                                            </th>
                                            <th className="py-2 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                                                Reste de paiement
                                            </th>
                                            <th className="py-2 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                                                Date debut
                                            </th>
                                            <th className="py-2 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                                                Date fin
                                            </th>
                                            <th className="py-2 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                                                Reste des jours
                                            </th>
                                            <th className="py-2 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="py-2 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody
                                        className="divide-y divide-gray-200"
                                    >
                                        {adherent?.subscriptions && adherent.subscriptions.length > 0 ? (
                                            adherent.subscriptions.map((subscription) => (
                                                <tr
                                                    key={subscription.id}
                                                    className="hover:bg-red-50  transition-colors duration-200"
                                                >
                                                    <td className="font-bold px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900">
                                                        {subscription.groupe?.toUpperCase()}
                                                    </td>

                                                    <td className="font-bold px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900">
                                                        {subscription.title?.toUpperCase()}
                                                    </td>

                                                    <td className="font-bold px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900">
                                                        {subscription.price} DH
                                                    </td>

                                                    <td className="font-bold px-6 py-4 text-center whitespace-nowrap text-sm">
                                                        <span
                                                            className={`font-bold ${Number(subscription.remainingAmount) > 0 ? "text-red-500" : "text-green-500"
                                                                }`}
                                                        >
                                                            {subscription.remainingAmount} DH
                                                        </span>
                                                    </td>

                                                    <td className="font-bold px-6 py-4 text-center whitespace-nowrap text-sm">
                                                        {subscription.startDate}
                                                    </td>

                                                    <td className="font-bold px-6 py-4 text-center whitespace-nowrap text-sm">
                                                        {subscription.endDate}
                                                    </td>

                                                    <td className="font-bold px-6 py-4 text-center whitespace-nowrap text-sm">
                                                        <span
                                                            className={`font-bold ${subscription.resteJours > 0 ? "text-green-500" : "text-red-500"
                                                                }`}
                                                        >
                                                            {subscription.resteJours} Jours
                                                        </span>
                                                    </td>

                                                    <td className="font-bold px-6 py-4 text-center whitespace-nowrap text-sm">
                                                        <span
                                                            className={`font-bold ${subscription.resteJours > 0 ? "text-green-500" : "text-red-500"
                                                                }`}
                                                        >
                                                            {subscription.resteJours > 0 ? "Non Expirée" : "Expirée"}
                                                        </span>
                                                    </td>

                                                    {/* ACTIONS */}
                                                    <td className="font-bold relative px-6 py-2 text-center whitespace-nowrap text-sm">
                                                        <div className="flex items-center justify-center gap-3">
                                                            <button onClick={(e) => handleEditSubscription(subscription.id)} className="text-blue-500 cursor-pointer hover:text-blue-700 transition">
                                                                <Edit size={18} />
                                                            </button>

                                                            <button
                                                                onClick={() => handleDeleteSubscription(subscription.id)}
                                                                className="text-red-500 cursor-pointer hover:text-red-700 transition"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>

                                                            <button
                                                                onClick={() =>
                                                                    setOpenDownloadId(
                                                                        openDownloadId === subscription.id ? null : subscription.id
                                                                    )
                                                                }
                                                                className="text-green-500 cursor-pointer hover:text-green-700 transition"
                                                            >
                                                                <Download size={18} />
                                                            </button>
                                                        </div>

                                                        {openDownloadId === subscription.id && (
                                                            <div className="absolute bottom-3 mb-2 pt-3 -left-2 -translate-x-1/2 bg-white shadow-xl border rounded-lg p-2 mt-6 flex gap-3 z-50 animate-fadeIn">
                                                                <button
                                                                    onClick={() => setOpenDownloadId(null)}
                                                                    className="absolute top-1 right-1 text-gray-500 hover:text-red-500 cursor-pointer"
                                                                >
                                                                    <X />
                                                                </button>
                                                                <button onClick={() => DownloadContrat(subscription)} title="Contart" className="hover:bg-gray-100 cursor-pointer p-2 rounded">
                                                                    <FileText size={16} /> Contrat
                                                                </button>

                                                                <button onClick={() => DownloadFacture(subscription)} className="hover:bg-gray-100 cursor-pointer p-2 rounded">
                                                                    <FileDown size={16} />Facture
                                                                </button>
                                                                <button onClick={() => DownloadRecuSubscription(subscription)} className="hover:bg-gray-100 cursor-pointer p-2 mr-5 rounded">
                                                                    <FileIcon size={16} />Recu
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={9} className="px-6 py-4 text-center text-gray-500 font-semibold">
                                                    Aucune subscription disponible
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    ) : ("")
                }
                {
                    adherent?.periodes && adherent.periodes.length > 0 ? (
                        <section className="bg-gray-50 rounded-xl p-4  shadow">
                            <h2 className="text-xl font-bold text-red-600 mb-4">
                                Historique des periodes
                            </h2>
                            <div className="w-full overflow-x-auto">
                                <table className="min-w-full divide-y rounded-2xl   shadow-2xl rounded-2xl bg-white">
                                    <thead className="bg-gradient-to-r from-red-700/10 to-red-600 sticky top-0">
                                        <tr>
                                            <th className="py-2 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                                                Prix
                                            </th>
                                            <th className="py-2 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                                                Reste de paiement
                                            </th>
                                            <th className="py-2 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                                                Durée
                                            </th>
                                            <th className="py-2 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                                                Date debut
                                            </th>
                                            <th className="py-2 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                                                Date fin
                                            </th>
                                            <th className="py-2 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                                                Reste des jours
                                            </th>
                                            <th className="py-2 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="py-2 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody
                                        className="divide-y divide-gray-200"
                                    >
                                        {adherent?.periodes && adherent.periodes.length > 0 ? (
                                            adherent.periodes.map((periode) => (
                                                <tr
                                                    key={periode.id}
                                                    className="hover:bg-red-50  transition-colors duration-200"
                                                >
                                                    <td className="font-bold px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900">
                                                        {periode.price}
                                                    </td>
                                                    <td className="font-bold px-6 py-4 text-center whitespace-nowrap text-sm">
                                                        <span
                                                            className={`font-bold ${Number(periode.remainingAmount) > 0 ? "text-red-500" : "text-green-500"
                                                                }`}
                                                        >
                                                            {periode.remainingAmount} DH
                                                        </span>
                                                    </td>

                                                    <td className="font-bold px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900">
                                                        {periode.durationDays}
                                                    </td>

                                                    <td className="font-bold px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900">
                                                        {periode.startDate}
                                                    </td>

                                                    <td className="font-bold px-6 py-4 text-center whitespace-nowrap text-sm">
                                                        {periode.endDate}
                                                    </td>

                                                    <td className="font-bold px-6 py-4 text-center whitespace-nowrap text-sm">
                                                        <span
                                                            className={`font-bold ${periode.resteJours! > 0 ? "text-green-500" : "text-red-500"
                                                                }`}
                                                        >
                                                            {periode.resteJours} Jours
                                                        </span>
                                                    </td>
                                                    <td className="font-bold px-6 py-4 text-center whitespace-nowrap text-sm">
                                                        <span
                                                            className={`font-bold ${periode.resteJours! > 0 ? "text-green-500" : "text-red-500"
                                                                }`}
                                                        >
                                                            {periode.resteJours! > 0 ? "Non Expirée" : "Expirée"}
                                                        </span>
                                                    </td>
                                                    <td className="font-bold relative px-6 py-2 text-center whitespace-nowrap text-sm">
                                                        <div className="flex items-center justify-center gap-3">
                                                            <button
                                                                onClick={() => handleEditPeriode(Number(periode.id))}
                                                                className="text-blue-500 cursor-pointer hover:text-blue-700 transition">
                                                                <Edit size={18} />
                                                            </button>

                                                            <button
                                                                onClick={() => handleDeletePeriode(Number(periode.id))}
                                                                className="text-red-500 cursor-pointer hover:text-red-700 transition"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>

                                                            <button
                                                                onClick={() => DownloadRecuPeriode(Number(periode.id))}
                                                                className="text-green-500 cursor-pointer hover:text-green-700 transition">
                                                                <Download size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={9} className="px-6 py-4 text-center text-gray-500 font-semibold">
                                                    Aucune periode disponible
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    ) : ("")
                }
                {
                    adherent?.logs && adherent.logs.length > 0 ? (
                        <section className="bg-gray-50 rounded-xl p-4 shadow">
                            <LogsHistory logs={adherent?.logs ?? []} />
                        </section>
                    ) : ("")
                }
                {
                    adherent?.transactions && adherent.transactions.length > 0 ? (
                        <section className="bg-gray-50 rounded-xl p-4 shadow">
                            <TransactionsHistory reload={() => loadAdherentInfos(Number(adherent.id))} transactions={adherent?.transactions ?? []} />
                        </section>
                    ) : ("")
                }
            </div>
            {
                isOpneModalDeleteAdherent && <DeleteAdherent loading={isDeleting} onConfirm={confirmDelete} onClose={() => setIsOpneModalDeleteAdherent(false)} />
            }
            {
                isOpneModalDeletesubscription && <DeleteSubscriptions loading={isDeleting} onConfirm={confiDeleteSubscriptions} onClose={() => setIsOpneModalDeletesubscription(false)} />
            }
            {
                isOpneModalDeletePeriode && <DeletePeriode onClose={() => setIsOpneModalDeletePeriode(false)} onConfirm={confirmDeletePeriode} loading={isDeletingPeriode} />
            }
            {
                isOpneModalNewSubscription && <NewSubscription Cancel={() => setisOpneModalNewSubscription(false)} adherentId={Number(id)} clubs={clubs} onClose={() => { loadAdherentInfos(Number(adherentId)); setisOpneModalNewSubscription(false) }} />
            }
            {
                isOpneModalNewPeriode && <NewPeriode onClose={() => { loadAdherentInfos(id); setisOpneModalNewPeriode(false) }} Cancel={() => setisOpneModalNewPeriode(false)} adherentId={id} />
            }
            {
                isOpneModalEditPeriode&&<EditPeriode Cancel={()=>setIsOpneModalEditPeriode(false)} onClose={()=>{setIsOpneModalEditPeriode(false);loadAdherentInfos(id)}} adherentId={id} periode={periodeToEdit} />
            }
            {
                subscriptionOnEdit && <EditSubscription Cancel={() => setSubscriptionOnEdit(null)} subscription={subscriptionOnEdit} adherentId={id} onClose={() => { setSubscriptionOnEdit(null); loadAdherentInfos(id) }} />
            }
            {
                isOpneModalEditAdherent && <EditAdherent onClose={() => { loadAdherentInfos(id); setIsOpneModalEditAdherent(false) }} Cancel={() => setIsOpneModalEditAdherent(false)} adherent={adherentToEdit} />
            }
        </div>

    );
};
const Info = ({ label, value }: any) => (
    <div>
        <span className="font-semibold text-gray-700">{label} :</span>{" "}
        <span className="text-gray-900">{value || "Non disponible"}</span>
    </div>
);
