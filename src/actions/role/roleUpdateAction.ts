import { Role } from "@prisma/client";
import prisma from "../../utils/client";
import { z } from "zod";
import { roleSchemaUpdate } from "../../utils/validationSchemas";

class RoleUpdateAction {
    static async execute(id: number,
        data: Partial<Omit<Role, "id" | "created_at" | "updated_at" | "deleted_at">>
    ) {
        return await prisma.role.update({
            where : { id },
            data,
        });
    }

    static validate (
        data: Partial<Omit<Role, "id" | "created_at" | "updated_at" | "deleted_at">>
    ) {
        return roleSchemaUpdate.safeParse(data);
    }
}

export default RoleUpdateAction;