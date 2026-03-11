import { z } from "zod";
export const VilleSchemaData = z.object({
  id: z.number().optional(),
  name: z.string().min(2, "Nom de ville est requis"),
  region: z.string().min(2, "Région de ville est requise"),
  codePostal: z
    .number("Code Postal de ville est requis")
    .min(1, "Code Postal doit etre un nombre positif"),
});
6