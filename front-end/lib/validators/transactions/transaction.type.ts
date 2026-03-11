import z from "zod";
import { TransactionSchema } from "./transaction.shema";
export type TransactionType=z.infer<typeof TransactionSchema>