import prisma from "../../utils/client";

class BillListPerMeterAccountAction {
    static async execute(page: number, pageSize: number, coopId: number, id: number) {
        const skip = (page - 1) * pageSize;
        const [ar, total] = await Promise.all ([
            prisma.accountRegistry.findMany({
                where: {
                    id: id,
                    deletedAt: null,
                    meterAccount: {
                        coopId: coopId
                    }
                },
                skip,
                take: pageSize,
                include: {
                    meterAccount: {
                        include: {
                            Bill: true
                        }
                    },
                    user: true,
                }
            }),
            prisma.accountRegistry.count({
                where: {
                    deletedAt: null,
                    id: id,
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