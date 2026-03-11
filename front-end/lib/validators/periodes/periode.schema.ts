import { number, z } from "zod";

export const PeriodeSchema = z.object({
    id: number().optional(),
    adherentId: z.coerce
        .number()
        .min(1, "Veuillez sélectionner un adhérent")
        .optional(),
    durationDays: z.coerce.number().min(1, "Veuillez taper une periode en jours"),
    price: z.coerce.number().min(1, "Veuillez taper un prix"),
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
        if (data.startDate && data.endDate) {
            if (data.endDate < data.startDate) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["endDate"],
                    message: "La date de fin doit être supérieure ou égale à la date de début",
                });
            }
        }
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