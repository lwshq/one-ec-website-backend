import { Cooperative } from "@prisma/client";
import prisma from "../../utils/client";
import { z } from "zod";
import { coopSchemaUpdate } from "../../utils/validationSchemas";

class CoopUpdateAction {
    static async execute(id: number,
        data: Partial<Omit<Cooperative, "id" | "created_at" | "updated_at" | "deleted_at">>
    ) {
        return await prisma.cooperative.update({
            where : { id },
            data,
        });
    }

    static validate (
        data: Partial<Omit<Cooperative, "id" | "created_at" | "updated_at" | "deleted_at">>
    ) {
        return coopSchemaUpdate.safeParse(data);
    }
}

export default CoopUpdateAction;