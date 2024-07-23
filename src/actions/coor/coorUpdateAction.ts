import { CoopCoordinator } from "@prisma/client";
import prisma from "../../utils/client";

class CoorUpdateAction {
    static async execute(
        coorId: number,
        data: Partial<Omit<CoopCoordinator, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>>,
        roleIds: number[]
    ) {
        return await prisma.$transaction(async (tx) => {

            const coordinatorExists = await tx.coopCoordinator.findUnique({
                where: { id: coorId }
            });

            if (!coordinatorExists) {
                throw new Error("Coordinator not found.");
            }

            const existingRoles = await tx.role.findMany({
                where: {
                    id: { in: roleIds },
                    deletedAt: null
                }
            });

            if (existingRoles.length !== roleIds.length) {
                throw new Error("One or more roles do not exist.");
            }

            const existingRoleAssignments = await tx.coordinatorRole.findMany({
                where: {
                    coordinatorId: coorId,
                    roleId: { in: roleIds }
                }
            });

            const existingRoleIds = existingRoleAssignments.map(role => role.roleId);

            await tx.coordinatorRole.updateMany({
                where: {
                    coordinatorId: coorId,
                    roleId: { notIn: roleIds }
                },
                data: {
                    deletedAt: new Date(),
                }
            });

            await Promise.all(roleIds.map(async (roleId) => {
                if (!existingRoleIds.includes(roleId)) {
                    await tx.coordinatorRole.create({
                        data: {
                            coordinatorId: coorId,
                            roleId: roleId
                        }
                    });
                } else {
                    await tx.coordinatorRole.updateMany({
                        where: {
                            coordinatorId: coorId,
                            roleId: roleId,
                            deletedAt: { not: null }
                        },
                        data: { deletedAt: null }
                    });
                }
            }));

            const coordinatorUpdate = await tx.coopCoordinator.update({
                where: { id: coorId },
                data: {
                    ...data,
                }
            });

            return { coordinatorUpdate };
        });
    }
}

export default CoorUpdateAction;
