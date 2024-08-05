import prisma from "../../utils/client";

class BillListPerMeterAccountAction {
    static async execute(page: number, pageSize: number, coopId: number, userId: number) {
        const skip = (page - 1) * pageSize;
        const [ar, total] = await Promise.all ([
            prisma.accountRegistry.findMany({
                where: {
                    deletedAt: null,
                    userId: userId,
                    meterAccount: {
                        coopId: coopId
                    }
                },
                skip,
                take: pageSize,
                include: {
                    // user: true,
                    meterAccount: {
                        include: {
                            Bill: true
                        }
                    },
                }
            }),
            prisma.accountRegistry.count({
                where: {
                    deletedAt: null,
                    userId: userId,
                    meterAccount: {
                        coopId: coopId
                    }
                },
            }),
        ])
        return { ar, total }
    }
}

export default BillListPerMeterAccountAction;