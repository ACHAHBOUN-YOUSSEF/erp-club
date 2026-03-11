import z from "zod";

export const GroupeAbonnements = z.object({
    id: z.number().optional(),
    name: z.string().min(1, "Le nom de groupe est obligatoire.").max(255, "Le nom de groupe ne doit pas dépasser 255 caractères."),
    type: z.string().min(1, "Le type de groupe est obligatoire.").max(255, "Le type de groupe ne doit pas dépasser 255 caractères."),
    description: z.string().min(1, "Le description de groupe est obligatoire.").max(2000, "Le description de groupe ne doit pas dépasser 255 caractères."),
    isArchived: z.coerce.boolean(),
    brancheId: z.coerce.number("Veuillez choisir un club").positive("Veuillez choisir un club").int("Veuillez choisir un").positive("Veuillez choisir un club"),
    club: z.object({
        name: z.string().optional(),
        id: z.number().optional()
    }).optional(),
    abonnements: z
        .array(
            z.object({
                id: z.number(),
                title: z.string(),
                price: z.coerce.number(),
                durationMonths: z.number(),
                isArchived: z.coerce.boolean(),

            })
        )
        .optional(),
})