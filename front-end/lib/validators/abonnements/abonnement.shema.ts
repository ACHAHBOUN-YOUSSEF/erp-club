import { z } from "zod";

export const AbonnementSchema = z.object({
    id: z.number().optional(),

    title: z
        .string()
        .min(1, { message: "Le titre d'abonnement est obligatoire." })
        .max(255, { message: "Le titre ne doit pas dépasser 255 caractères." }),

    durationMonths: z
        .coerce.number()
        .int({ message: "La durée doit être un nombre entier." })
        .min(1, { message: "La durée doit être au minimum 1 mois." })
        .max(60, { message: "La durée ne peut pas dépasser 60 mois." }),

    price: z
        .string()
        .min(1, { message: "Le prix est obligatoire." })
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val), {
            message: "Le prix doit être un nombre valide.",
        })
        .refine((val) => val > 0, {
            message: "Le prix doit être supérieur à 0.",
        }),

    isArchived: z
        .coerce.boolean(),

    groupeId: z
        .coerce.number()
        .int({ message: "Le groupe doit être valide." })
        .positive({ message: "Le groupe doit être valide." }),
    groupe: z.object({
        id: z.number(),
        name: z.string(),
    }).optional()
});