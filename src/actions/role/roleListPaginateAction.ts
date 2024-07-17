import prisma from "../../utils/client";

class RoleListPaginateAction {
    static async execute(page: number, pageSize: number) {
        const skip = (page - 1) * pageSize;
        const [roles, total] = await Promise.all ([
            prisma.role.findMany({
                where: {
                    deletedAt: null,
                },
                skip,
                take: pageSize,
            }),
            prisma.role.count({
                where: {
                    deletedAt: null,
                }
            }),
        ])
        return { roles, total }
    }
}

export default RoleListPaginateAction;