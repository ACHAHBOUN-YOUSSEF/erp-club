import z from "zod";
import { newSubscriptionShema } from "./subscriptions.shema";
export type newSubscriptionType=z.infer<typeof newSubscriptionShema>