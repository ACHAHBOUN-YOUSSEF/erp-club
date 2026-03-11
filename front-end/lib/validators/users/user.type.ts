import z from "zod";
import { userSchema } from "./user.schema";

export type userType=z.infer<typeof userSchema>