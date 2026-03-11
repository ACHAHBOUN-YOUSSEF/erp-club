"use client"
import { X } from "lucide-react";
import { clubType } from "@/lib/validators/clubs";
import { useEffect, useState } from "react";
import { GroupeAbonnementType } from "@/lib/validators/groupeAbonnements";
import { groupeAbonnementsService } from "@/services/groupeAbonnementsService";
import { toast } from "react-toastify";
import Loader from "../../loader";
import { AbonnementType } from "@/lib/validators/abonnements";
import { AbonnementsService } from "@/services/abonnementService";
import { newSubscriptionShema, newSubscriptionType } from "@/lib/validators/new-subscriptions";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubscriptionService } from "@/services/subscrptionService";
type props = {
    onClose: () => void;
    Cancel:()=>void;
    clubs: clubType[];
    adherentId: number  
}
export default function NewSubscription({ onClose, clubs, adherentId ,Cancel}: props) {
    const [isBusy, setIsBusy] = useState(false)
    const [groupes, setGroupes] = useState<GroupeAbonnementType[] | null>(null)
    const [abonnements, setAbonnements] = useState<AbonnementType[] | null>(null)
    const [selectedClub, setSelectedClub] = useState<number | null>(null);
    const [selectedGroupe, setSelectedGroupe] = useState<number | null>(null);
    const [selectedAbonnement, setSelectedAbonnement] = useState<number | null>(null);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<newSubscriptionType>({ resolver: zodResolver(newSubscriptionShema) })

    const onSubmit: SubmitHandler<newSubscriptionType> = async (subscription: newSubscriptionType) => {
        try {            
            const res = await SubscriptionService.create(subscription)            
            toast.success(res.message)                        
            reset()
            onClose()
        } catch (err: any) {            
            if (err.response?.status === 422) {
                const backendErrors = err.response.data.errors;
                if (backendErrors) {
                    const firstFieldErrors = Object.values(backendErrors)[0] as string[];
                    if (firstFieldErrors && firstFieldErrors.length > 0) {
                        toast.error(firstFieldErrors[0]);
                    }
                } else {
                    toast.error("Erreur de validation inconnue");
                }
            } else {
                toast.error(err.message || "Erreur serveur");
            }
        }

    }
    const loadGroupesByClubId = async (clubId: number) => {
        setIsBusy(true);

        // RESET COMPLET
        setSelectedClub(clubId);
        setSelectedGroupe(null);
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
    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                <div className="bg-white rounded-lg w-96 shadow-lg relative max-h-[97vh] flex flex-col">
                    {isBusy && (<Loader />)}
                    {isSubmitting && (<Loader />)}
                    <h2 className="text-lg font-bold mb-4 px-4 pt-4 flex justify-between items-center">
                        Ajouter une subscription
                        <X className="cursor-pointer" onClick={() => Cancel()} />
                    </h2>
                    <hr />
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="overflow-y-auto px-6 pb-6 p-4">
                        <div className="mb-3 mt-3">
                            <div className="mt-3 space-y-3">
                                <div className="mb-3">
                                    <label className="block font-semibold mb-1">Choissir un club</label>
                                    <select
                                        value={selectedClub ?? ""}
                                        className="focus:bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5 pr-10"
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (!value) return;
                                            loadGroupesByClubId(Number(value));
                                        }}
                                    >
                                        <option value="" disabled>Choisir un club</option>

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
                                <div className="mb-3">
                                    <label className="block font-semibold mb-1">Choissir un groupe d'abonnement</label>

                                    <select
                                        value={selectedGroupe ?? ""}
                                        className="focus:bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5 pr-10"

                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (!value) return;
                                            loadAbonnementsBuGroupe(Number(value));
                                        }}
                                        disabled={!groupes || groupes.length === 0}
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
                                <div className="mb-3">
                                    <label className="block font-semibold mb-1">Choissir un abonnement</label>
                                    <select
                                        {...register("abonnementId")}
                                        value={selectedAbonnement ?? ""}
                                        className="focus:bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5 pr-10"

                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (!value) return;
                                            setSelectedAbonnement(Number(value));
                                        }}
                                        disabled={!abonnements || abonnements.length === 0}
                                    >
                                        <option value="" disabled>
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
                                    {errors.abonnementId && (<p className="text-red-500 text-sm mt-1">{errors.abonnementId.message}</p>)}
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-black">Date de début</label>
                                    <input
                                        {...register("startDate")}
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5"
                                    />
                                    {errors.startDate && (<p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>)}

                                </div>
                                <div >
                                    <label className="block mb-2 text-sm font-medium text-black">Montant payée</label>
                                    <input type="number" {...register("montant")}
                                        placeholder="montant payé..."
                                        className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5" />
                                    {errors.montant && (<p className="text-red-500 text-sm mt-1">{errors.montant.message}</p>)}

                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-black">Reste de paiement</label>
                                    <input type="text" {...register('remainingAmount')}
                                        placeholder="Reste de paiement..."
                                        className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5" />
                                    {errors.remainingAmount && (<p className="text-red-500 text-sm mt-1">{errors.remainingAmount.message}</p>)}
                                </div>
                                <div className="containers-assurance">
                                    <label className="block mb-2 text-sm font-medium text-black">Mode de paiement</label>
                                    <select {...register('modePaiement')} className="focus:bg-red-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none block w-full p-2.5 pr-10">
                                        <option value="ESPECES">ESPECES</option>
                                        <option value="VIREMENT">VIREMENT</option>
                                        <option value="CHEQUE">CHEQUE</option>
                                    </select>
                                    {errors.modePaiement && (<p className="text-red-500 text-sm mt-1">{errors.modePaiement.message}</p>)}
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        {...register("adherentId")}
                                        value={adherentId || ""}
                                        className="hidden"
                                        readOnly
                                        tabIndex={-1}
                                    />
                                </div>
                                    {errors.adherentId && (<p className="text-red-500 text-sm mt-1">{errors.adherentId.message}</p>)}

                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <button type="button" onClick={Cancel} className="px-4 py-2 cursor-pointer bg-gray-300 rounded disabled:opacity-50">
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className={`cursor-pointer px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"`}>
                                Ajouter
                            </button>
                        </div>
                    </form>

                </div >
            </div >

        </>
    )
}