import { number, z } from "zod";

export const SubscriptionSchema = z.object({
    abonnementId: z.coerce.number().min(1, "Veuillez sélectionner un abonnement"),
    id: number().optional(),
    adherentId: z.coerce
        .number()
        .min(1, "Veuillez sélectionner un adhérent")
        .optional(),

    remainingAmount: z.coerce
        .number()
        .min(0, "Le montant restant ne peut pas être négatif")
        .optional()
        .or(z.literal("")),
    NewRemainingAmount: z.preprocess((val) => {
        if (val === "" || val === undefined) return undefined;
        return Number(val);
    },
        z.number("Le montant restant ne peut pas être négatif ou des lettre").min(0, "Le montant restant ne peut pas être négatif").optional()
    ),
    noRemainingAmount :z.coerce.boolean().optional().nullable(),
    montant: z.coerce
        .number()
        .positive("Le montant doit être supérieur à 0")
        .optional()
        .or(z.literal("")),

    startDate: z
        .string()
        .min(1, "La date de début est obligatoire")
        .transform((val) => val.split("T")[0]),

    endDate: z
        .string()
        .min(1, "La date de fin est obligatoire")
        .transform((val) => val.split("T")[0]),

    modePaiement: z
        .enum(["ESPECES", "VIREMENT", "CHEQUE"] as const)
        .optional()
        .or(z.literal("")),
})
    .superRefine((data, ctx) => {

        // ✅ 1️⃣ Vérifier que endDate >= startDate
        if (data.startDate && data.endDate) {
            if (data.endDate < data.startDate) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["endDate"],
                    message: "La date de fin doit être supérieure ou égale à la date de début",
                });
            }
        }

        // ✅ 2️⃣ Si montant contient un nombre → modePaiement obligatoire
        if (
            typeof data.montant === "number" &&
            data.montant > 0 &&
            !data.modePaiement
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["modePaiement"],
                message: "Le mode de paiement est obligatoire si un montant est saisi",
            });
        }
    });