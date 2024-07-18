import prisma from "../../utils/client";

class CoorListPaginateAction {
    static async execute(page: number, pageSize: number) {
        const skip = (page - 1) * pageSize;
        const [coors, total] = await Promise.all ([
            prisma.coopCoordinator.findMany({
                where: {
                    deleted_at: null,
                },
                skip,
                take: pageSize,
            }),
            prisma.coopCoordinator.count({
                where: {
                    deleted_at: null,
                }
            }),
        ])
        return { coors, total }
    }
}

export default CoorListPaginateAction;