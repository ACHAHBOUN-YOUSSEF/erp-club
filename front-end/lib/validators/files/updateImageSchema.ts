import * as z from "zod";

export const updateImageSchema = z.object({
  imagePath: z
    .any()
    .refine((file) => file instanceof File, "Veuillez sélectionner une image")
    .optional(),
});
