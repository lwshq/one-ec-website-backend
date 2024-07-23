import { CoopCoordinator } from "@prisma/client";
import prisma from "../../utils/client";

class CoorUpdateAction {
    static async execute(
        coorId: number,
        data: Partial<Omit<CoopCoordinator, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>>,
        roleIds: number[]
    ) {
        return await prisma.$transaction(async (tx) => {
            // Validate all role IDs exist
            const existingRoles = await tx.role.findMany({
                where: {
                    id: { in: roleIds },
                    deletedAt: null
                }
            });

            if (existingRoles.length !== roleIds.length) {
                throw new Error("One or more roles do not exist.");
            }

            // Find existing role assignments
            const existingRoleAssignments = await tx.coordinatorRole.findMany({
                where: {
                    coordinatorId: coorId,
                    roleId: { in: roleIds }
                }
            });

            const existingRoleIds = existingRoleAssignments.map(role => role.roleId);

            // Soft delete roles not currently needed
            await tx.coordinatorRole.updateMany({
                where: {
                    coordinatorId: coorId,
                    roleId: { notIn: roleIds }
                },
                data: {
                    deletedAt: new Date(),
                }
            });

            // Reactivate existing roles or create new role assignments if necessary
            await Promise.all(roleIds.map(async (roleId) => {
                if (!existingRoleIds.includes(roleId)) {
                    // Create new role assignments if not already existing
                    await tx.coordinatorRole.create({
                        data: {
                            coordinatorId: coorId,
                            roleId: roleId
                        }
                    });
                } else {
                    // Reactivate the role if it was previously deleted
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

            // Update coordinator details
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
