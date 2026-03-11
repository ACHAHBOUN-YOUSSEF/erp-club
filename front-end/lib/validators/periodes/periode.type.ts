import z from "zod";
import { PeriodeSchema } from "./periode.schema";
export type PeriodeType=z.infer<typeof PeriodeSchema>