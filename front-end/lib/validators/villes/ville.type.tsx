import type { z } from "zod";
import { VilleSchemaData } from "./ville.schema";

export type VilleSchema = z.infer<typeof VilleSchemaData>;
