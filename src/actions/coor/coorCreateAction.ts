import { CoopCoordinator, Account } from "@prisma/client";
import prisma from "../../utils/client";

import crypto from "crypto";
import bcrypt from "bcrypt";
import Mailer from "../../utils/Mailer";

class CoorCreateAction {
    static async execute(
        data: Omit<CoopCoordinator, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>,
        roleIds: number[],
        coopId: number,
    ) {
        return await prisma.$transaction(async (tx) => {
            const randomPassword = crypto.randomBytes(8).toString('hex');
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            const coordinator = await tx.coopCoordinator.create({
                data: {
                    ...data,
                    coop_id: coopId,
                    account: {
                        create: { password: hashedPassword }
                    },
                    roles: {
                        createMany: {
                            data: roleIds.map(roleId => ({ roleId }))
                        }
                    }
                }
            });

            const mailer = new Mailer();
            await mailer.sendAccountPassword(data.email, randomPassword, data.email);

            return { coordinator };

        });

        

    }
}

export default CoorCreateAction;