import z from "zod";
import { SubscriptionSchema } from "./subscriptions.shema";
export type SubscriptionType=z.infer<typeof SubscriptionSchema>