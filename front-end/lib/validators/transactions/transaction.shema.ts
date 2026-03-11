import { z } from "zod";
export const TransactionSchema = z.object({
    id: z.number().min(1, { message: "ID invalide" }).optional(),
    created_at: z.string().min(1, { message: "Date de création obligatoire" }).optional(),

    updated_at: z.string().min(1, { message: "Date de modification obligatoire" }).optional(),

    montant: z.string().min(1, { message: "Le montant est obligatoire" }),

    type: z.string().min(1, { message: "Le type est obligatoire" }).optional(),

    description: z.string().min(1, { message: "La description est obligatoire" }),

    modePaiement: z.string().min(1, { message: "Le mode de paiement est obligatoire" }),

    adherent: z.string().min(1, { message: "L'adhérent est obligatoire" }).optional(),
    adherentId: z.coerce.number({ message: "ID adhérent invalide" }).min(1, { message: "Le ID d'adhérent est obligatoire" }),
    userId: z.number().min(1, { message: "Le Id de utulisateur est obligatoire" }).optional().nullable(),

    executedByUser: z.string().min(1, { message: "L'utilisateur est obligatoire" }).optional(),
    transactionDate: z
        .coerce.string({ message: "Date de transaction invalide" })
        .min(1, { message: "La date de transaction est obligatoire" })
        .refine((date) => !isNaN(Date.parse(date)), {
            message: "Format de date invalide (YYYY-MM-DD)"
        }),
});