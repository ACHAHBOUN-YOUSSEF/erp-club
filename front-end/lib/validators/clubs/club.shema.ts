import { z } from "zod";

export const clubSchema = z.object({
  id: z.number().optional(),

  name: z
    .string()
    .min(1, "Le nom de club est obligatoire.")
    .max(255, "Le nom de club ne doit pas dépasser 255 caractères."),

  adresse: z
    .string()
    .min(1, "L'adresse est obligatoire.")
    .max(255, "L'adresse ne doit pas dépasser 255 caractères."),

phone: z
  .string()
  .min(1, "Le téléphone est obligatoire.")
  .regex(/^(05|06|07)[0-9]{8}$/, "Numéro de téléphone invalide (05, 06 ou 07 + 8 chiffres)"),

  email: z
    .string()
    .email("Veuillez saisir une adresse e-mail valide."),

  villeId: z.coerce
    .number("Veuillez choisir une ville").positive()
    .int("Veuillez choisir une ville")
    .positive("Veuillez choisir une ville"),

  ville: z
    .object({
      name: z.string().optional(),
      id:z.number().optional()
    })
    .optional(),
})