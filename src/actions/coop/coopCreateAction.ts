import { Cooperative, CoopCoordinator, UserRole } from "@prisma/client";
import prisma from "../../utils/client";
import { coopSchema } from "../../utils/validationSchemas";
import crypto from "crypto";
import bcrypt from "bcrypt";
import Mailer from "../../utils/Mailer";

class CoopCreateAction {
    static async execute(
        data: Omit<Cooperative, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> & {
            coordinator: Omit<CoopCoordinator, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'coop_id' | 'role'> & {
                account: {
                    password: string;
                };
            };
        }
    ) {
        return await prisma.$transaction(async (tx) => {
            const coop = await tx.cooperative.create({
                data: {
                    name: data.name,
                    description: data.description,
                    address: data.address,
                },
            });

            const randomPassword = crypto.randomBytes(8).toString('hex');
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            const coordinator = await tx.coopCoordinator.create({
                data: {
                    first_name: data.coordinator.first_name,
                    middle_name: data.coordinator.middle_name,
                    last_name: data.coordinator.last_name,
                    email: data.coordinator.email,
                    contact_number: data.coordinator.contact_number,
                    coop_id: coop.id,
                    role: UserRole.COOPSUPERADMIN,
                },
            });

            await tx.account.create({
                data: {
                    password: hashedPassword, 
                    coordinator_id: coordinator.id,
                },
            });

            const superAdminRole = await tx.role.create({
                data: {
                    name: UserRole.COOPSUPERADMIN,
                    permissions: [], 
                    modules: [],
                },
            });

    
            await tx.coordinatorRole.create({
                data: {
                    coordinatorId: coordinator.id,
                    roleId: superAdminRole.id,
                },
            });
            const mailer = new Mailer();
            await mailer.sendAccountPassword(
                data.coordinator.email,
                randomPassword,
                data.coordinator.email
            );
            

            return { coop, coordinator, role: superAdminRole };
        });
    }

    static validate(
        data: Omit<Cooperative, 'id'| 'createdAt' | 'updatedAt' | 'deletedAt'> & {
            coordinator: Omit<CoopCoordinator, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'coop_id' | 'role'> & {
                account: {
                    password: string;
                };
            };
        }
    ) {
        return coopSchema.safeParse(data);
    }
}

export default CoopCreateAction;
