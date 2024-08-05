import { Role } from "@prisma/client";
import prisma from "../../utils/client";
import { roleSchemaCreate } from "../../utils/validationSchemas";
class RoleCreateAction {
    static async execute(
        data: Omit <Role, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>,
        coop_id: number
    ) {
        return await prisma.role.create({
            data: {
                ...data,
                coopId: coop_id
            }
        });
    }

    static validate(
        data: Omit <Role, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>
    ) {
        return roleSchemaCreate.safeParse(data);
    }
}

export default RoleCreateAction;