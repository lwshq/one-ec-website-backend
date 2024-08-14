import { User } from "@prisma/client";
import prisma from "../../utils/client";
import { z } from "zod";
import { custUpdateSchema } from "../../utils/validationSchemas";

class UserUpdateAction {
    static async execute(id: number,
        data: Partial<Omit<User, "id" | "created_at" | "updated_at" | "deleted_at">>
    ) {
        return await prisma.user.update({
            where : { id },
            data,
        });
    }

    static validate (
        data: Partial<Omit<User, "id" | "created_at" | "updated_at" | "deleted_at">>
    ) {
        return custUpdateSchema.safeParse(data);
    }
}

export default UserUpdateAction;