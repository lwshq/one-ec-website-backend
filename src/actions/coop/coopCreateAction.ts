import { Cooperative } from "@prisma/client";
import prisma from "../../utils/client";
import { coopSchema } from "../../utils/validationSchemas";

class CoopCreateAction {
    static async execute(
        data: Omit <Cooperative, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>
    ) {
        return await prisma.cooperative.create({
            data,
        });
    }

    static validate(
        data: Omit <Cooperative, 'id'| 'created_at' | 'updated_at' | 'deleted_at'>
    ) {
        return coopSchema.safeParse(data);
    }

}

export default CoopCreateAction;