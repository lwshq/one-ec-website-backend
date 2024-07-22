import prisma from "../../utils/client";

class BillListPaginateAction {
    static async execute(page: number, pageSize: number, coopId: number) {
        const skip = (page - 1) * pageSize;
        const [coors, total] = await Promise.all ([
            prisma.bill.findMany({
                where: {
                    deletedAt: null,
                    coopId: coopId
                },
                skip,
                take: pageSize,
            }),
            prisma.bill.count({
                where: {
                    deletedAt: null,
                    coopId: coopId
                }
            }),
        ])
        return { coors, total }
    }
}

export default BillListPaginateAction;