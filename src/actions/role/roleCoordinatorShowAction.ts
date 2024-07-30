import prisma from "../../utils/client";

class RoleCoorShowAction {
    static async execute(id: number) {
        const coordinator = await prisma.coopCoordinator.findUnique({
            where: {
                id: id,
                deleted_at: null
            },
            include: {
                roles: {
                    where: {
                        deletedAt: null
                    },
                    include: {
                        role: true
                    }
                }
            }
        });

        // if (!roleData) {
        //     return null;
        // }

        // const aggregatedPermissions = new Set<string>();
        // const aggregatedModules = new Set<string>();

        // roleData.roles.forEach(roleEntry => {
        //     roleEntry.role.permissions.forEach(permission => aggregatedPermissions.add(permission));
        //     roleEntry.role.modules.forEach(module => aggregatedModules.add(module));
        // });

        // const combinedRoleData = {
        //     ...roleData,
        //     permissions: Array.from(aggregatedPermissions),
        //     modules: Array.from(aggregatedModules)
        // };
        // return combinedRoleData;

        if (!coordinator) {
            throw new Error("Coordinator not found");
        }

        // Extract only the roles and their related data
        const rolesData = coordinator.roles.map(coordinatorRole => {
            return {
                id: coordinatorRole.role.id,
                name: coordinatorRole.role.name,
                permissions: coordinatorRole.role.permissions,
                modules: coordinatorRole.role.modules,

            };
        });

        return {
            coordinatorRole: coordinator.role,
            roles: rolesData
        };
    }

    
}

export default RoleCoorShowAction;
