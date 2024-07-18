import prisma from "../../utils/client";

class CoorListPaginatePerCoopAction {
    static async execute(page: number, pageSize: number, coopId: number) {
        const skip = (page - 1) * pageSize;
        const [coors, total] = await Promise.all ([
            prisma.coopCoordinator.findMany({
                where: {
                    coop_id: coopId,
                    deleted_at: null,
                },
                skip,
                take: pageSize,
            }),
            prisma.coopCoordinator.count({
                where: {
                    coop_id: coopId,
                    deleted_at: null,
                }
            }),
        ])
        return { coors, total }
    }
}

export default CoorListPaginatePerCoopAction;