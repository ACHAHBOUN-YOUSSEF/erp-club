import z from "zod"
import { clubSchema } from "./club.shema";
export type clubType=z.infer<typeof clubSchema>;