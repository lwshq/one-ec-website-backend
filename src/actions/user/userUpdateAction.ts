import { Cooperative, CoopCoordinator, UserRole, User, MeterAccount } from "@prisma/client";
import prisma from "../../utils/client";
import { coopSchema } from "../../utils/validationSchemas";
import crypto from "crypto";
import bcrypt from "bcrypt";
import Mailer from "../../utils/Mailer";

class UserUpdateAction {
    static async execute(id: number,
        data: Partial<Omit<User, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'user_id' | 'role'>>
    ) {
        return await prisma.$transaction(async (tx) => {
            const ar = await tx.accountRegistry.findUnique({
                where: {
                    id: id,
                    deletedAt: null
                }
            });

            if (!ar) {
                throw new Error("No account found");
            }

            const user = await tx.user.update({
               where: {
                id: ar.userId,
                deleted_at: null
               },
               data,
            });

          




            

        });
    }

  
}

export default UserUpdateAction;
