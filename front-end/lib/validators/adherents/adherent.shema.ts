import {  z } from "zod";
const subscriptionSchema = z.object({
    id: z.number(),
    startDate: z.string()
        .refine((val) => !isNaN(Date.parse(val)), { message: "Date invalide" }),

    endDate: z.string()
        .refine((val) => !isNaN(Date.parse(val)), { message: "Date invalide" }),

    remainingAmount: z.coerce.number(),

    title: z.string(),
    price: z.coerce.number(),
    groupe: z.string(),
    abonnementId:z.number(),
    resteJours: z.number().min(0)
})
const SchemaLogs = z.object({
    id: z.number(),
    fieldName: z.string().nullable(),
    action: z.string(),
    oldValue: z.string().nullable(),
    newValue: z.string().nullable(),
    description: z.string(),
    executedByUser: z.string(),
    created_at: z.string(),
    updated_at: z.string()
});
const PeriodeSchema = z.object({
    id: z.number().optional(),
    adherentId: z.coerce.number().optional(),
    durationDays: z.coerce.number().optional(),
    price: z.coerce.number().min(1, "Veuillez taper un prix").optional(),
    remainingAmount: z.coerce.number().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    resteJours:z.number().optional()
})
const SchemaTransaction = z.object({
    id:z.number(),
    created_at: z.string(),
    updated_at:z.string(),
    montant: z.string(),
    type: z.string(),
    description: z.string(),
    modePaiement: z.string(),
    adherent: z.string(),
    executedByUser: z.string(),
    transactionDate:z.string(),
})
export const adherentSchema = z.object({
    firstName: z.string().min(1, "Le nom est obligatoire"),
    lastName: z.string().min(1, "Le prenom est obligatoire"),
    phonePrimary: z.string().regex(/^(05|06|07)[0-9]{8}$/, "Numéro de téléphone invalide"),

    cin: z.string("le cin est obligatoire").optional().or(z.literal("")).nullable(),
    phoneSecondary: z.string("Le 2 eme Numéro de téléphone invalide").regex(/^(05|06|07)[0-9]{8}$/, "Le 2 eme Numéro de téléphone invalide").optional().or(z.literal("")).nullable(),
    birthDate: z.string("La date de naissance est obligatoire")
        .min(1, "La date de naissance est obligatoire")
        .refine((val) => !isNaN(Date.parse(val)), { message: "Date invalide" })
        .optional().or(z.literal("")).nullable(),

    gender: z.preprocess(
        (val) => (val === "" ? undefined : val),
        z.string({ message: "Le genre est obligatoire" })
            .refine((val) => val === "HOMME" || val === "FEMME", {
                message: "Le genre doit être homme ou femme"
            })
    ),
    registrationDate: z.string()
        .min(1, "La date d'inscription est obligatoire")
        .refine((val) => !isNaN(Date.parse(val)), { message: "Date invalide" })
        .optional(),
    resteJoursAssurance: z.number().optional(),
    insuranceEndDate: z.string()
        .min(1, "La date de fin d'assurance est obligatoire")
        .refine((val) => !isNaN(Date.parse(val)), { message: "Date invalide" })
        .optional(),

    insuranceRemainingAmount: z.string()
        .min(1, { message: "Le reste de paiement est obligatoire." })
        .refine((val) => !isNaN(Number(val)), { message: "Doit être un nombre valide." })
        .refine((val) => Number(val) > 0, { message: "Le montant doit être supérieur à 0." })
        .optional().nullable(),
    brancheId: z.coerce.number({ message: "Veuillez choisir un club" }).int().positive().optional(),
    id: z.number().optional(),
    club: z.object({ name: z.string().optional() }).optional(),
    addedBy: z.string().optional(),
    subscriptions: z.array(subscriptionSchema).optional(),
    logs: z.array(SchemaLogs).optional().nullable(),
    transactions:z.array(SchemaTransaction).optional(),
    periodes:z.array(PeriodeSchema).optional()
})
    .refine(
        (data) => {
            if (data.registrationDate && data.insuranceEndDate) {
                return new Date(data.insuranceEndDate) > new Date(data.registrationDate);
            }
            return true;
        },
        {
            message: "La date de fin d'assurance doit être supérieure à la date d'inscription.",
            path: ["insuranceEndDate"],
        }
    );