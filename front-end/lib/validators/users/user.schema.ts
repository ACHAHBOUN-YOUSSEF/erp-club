import z from "zod";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const userSchema = z.object({
    id: z.number().optional(),
    cin: z.string().min(1, "Le cin est obligatoire"),
    firstName: z.string().min(1, "Le nom est obligatoire"),
    lastName: z.string().min(1, "Le prenom est obligatoire"),
    lastSeen:z.string().optional().nullable(),
    imagePath: z.instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, {
            message: "L'image ne doit pas dépasser 5MB",
        })
        .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
            message: "Formats acceptés : JPG, PNG, WEBP",
        })
        .optional(),
    image_url: z.string().optional().nullable(),
    phone: z
        .string()
        .regex(/^(05|06|07)[0-9]{8}$/, "Numéro de téléphone invalide"),

    birthDate: z
        .string()
        .min(1, "La date de naissance est obligatoire")
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Date invalide"
        }),
    gender: z.preprocess(
        (val) => (val === "" ? undefined : val),
        z.string({ message: "Le genre est obligatoire" })
            .refine(
                (val) => val === "HOMME" || val === "FEMME",
                { message: "Le genre doit être homme ou femme" }
            )
    ),



    adresse: z
        .string()
        .min(1, "L'adresse est obligatoire")
        .max(255, "L'adresse ne doit pas dépasser 255 caractères").nullable(),

    email: z.string().email("Veuillez saisir une adresse e-mail valide"),

    password: z
        .string()
        .optional()
        .refine(
            (val) => {
                if (!val || val.length === 0) return true; // 👈 vide = OK
                return (
                    val.length >= 8 &&
                    /^(?=(?:.*[A-Z]){2,})(?=(?:.*[a-z]){2,})(?=(?:.*\d){2,})(?=(?:.*[^A-Za-z0-9]){2,}).*$/.test(
                        val
                    )
                );
            },
            {
                message:
                    "Le mot de passe doit contenir au moins 8 caractères, 2 majuscules, 2 minuscules, 2 chiffres et 2 caractères spéciaux",
            }
        ),

    club: z.object({
        id: z.number().optional(),
        name: z.string().optional(),
        ville: z.object({
            id: z.number().optional(),
            name: z.string().optional()
        })
    }).optional().nullable(),

    brancheId: z.coerce
        .number({ message: "Veuillez choisir un club" })
        .int("Veuillez choisir un club")
        .positive("Veuillez choisir un club"),

    role: z.string().min(1, "Le rôle est obligatoire").nullable(),
    permissions: z.array(z.string()).default([]),
});