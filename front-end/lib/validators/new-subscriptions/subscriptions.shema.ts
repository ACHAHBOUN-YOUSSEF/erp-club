import { z } from "zod";

export const newSubscriptionShema = z.object({
    abonnementId: z.coerce.number().min(1, "Veuillez sélectionner un abonnement"),
    adherentId: z.coerce.number().min(1, "Veuillez sélectionner un adhérent").optional(),
    remainingAmount: z.coerce.number().min(0, "Le montant restant ne peut pas être négatif").optional().or(z.literal("")),
    montant: z.coerce.number().positive("Le montant doit être supérieur à 0").optional().or(z.literal("")),
    startDate: z.string().min(1, "La date de début est obligatoire").transform(val => new Date(val)),
    modePaiement: z.enum(["ESPECES", "VIREMENT", "CHEQUE"] as const).optional().or(z.literal("")),
})
    .superRefine((data, ctx) => {
        // ✅ Si montant > 0, modePaiement obligatoire
        if (data.montant && data.montant > 0 && !data.modePaiement) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["modePaiement"],
                message: "Le mode de paiement est obligatoire si un montant est saisi"
            });
        }
    });
