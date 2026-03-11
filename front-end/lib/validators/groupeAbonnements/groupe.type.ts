import z from "zod";
import { GroupeAbonnements } from "./groupe.shema";
export type GroupeAbonnementType=z.infer<typeof GroupeAbonnements> 
