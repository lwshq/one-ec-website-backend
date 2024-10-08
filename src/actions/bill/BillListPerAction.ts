import prisma from "../../utils/client";

class BillListPaginateAction {
    static async execute(page: number, pageSize: number, coopId: number) {
        const skip = (page - 1) * pageSize;
        const [ar, total] = await Promise.all ([
            prisma.accountRegistry.findMany({
                where: {
                    deletedAt: null,
                    meterAccount: {
                        coopId: coopId
                    }
                },
                skip,
                take: pageSize,
                include: {
                    user: true,
                    meterAccount: true
                }
            }),
            prisma.accountRegistry.count({
                where: {
                    deletedAt: null,
                    meterAccount: {
                        coopId: coopId
                    }
                },
            }),
        ])
        return { ar, total }
    }
}

export default BillListPaginateAction;