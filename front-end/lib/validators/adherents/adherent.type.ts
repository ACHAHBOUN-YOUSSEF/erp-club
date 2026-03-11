import z from "zod"
import { adherentSchema } from "./adherent.shema";
export type adherentType=z.infer<typeof adherentSchema>;