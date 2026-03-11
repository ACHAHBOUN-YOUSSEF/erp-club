import z from "zod";
import { AbonnementSchema } from "./abonnement.shema";
export type AbonnementType=z.infer<typeof AbonnementSchema>