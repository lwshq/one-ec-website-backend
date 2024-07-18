import { CoopCoordinator } from "@prisma/client";
import prisma from "../../utils/client";

class CoorUpdateAction {
    static async execute(
        coorId: number,
        data: Partial<Omit<CoopCoordinator, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'email'>>,
        roleIds: number[],
    ) {
        return await prisma.$transaction(async (tx) => {


            const rolesUpdate = await tx.coordinatorRole.updateMany({
                where: {
                    coordinatorId: coorId,
                    roleId: { notIn: roleIds },
                    deletedAt: null
                },
                data: {
                    deletedAt: new Date(),
                }
            });
            await Promise.all(roleIds.map(async (roleId) => {
                const existingRole = await tx.coordinatorRole.findFirst({
                    where: {
                        coordinatorId: coorId,
                        roleId: roleId
                    }
                });

                if (existingRole) {
                    await tx.coordinatorRole.update({
                        where: { id: existingRole.id },
                        data: { deletedAt: null }
                    });
                } else {
                    await tx.coordinatorRole.create({
                        data: {
                            coordinatorId: coorId,
                            roleId: roleId
                        }
                    });
                }
            }));

            const coordinatorUpdate = await tx.coopCoordinator.update({
                where: { id: coorId, deleted_at: null },
                data: {
                    ...data,
                }
            });
            return { coordinatorUpdate };
        });
    }
}

export default CoorUpdateAction;