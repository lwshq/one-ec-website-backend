import prisma from "../../utils/client";

class ArListPaginateAction {
    static async execute(page: number, pageSize: number, coopId: number) {
        const skip = (page - 1) * pageSize;
        const [ar, total] = await Promise.all ([
            prisma.accountRegistry.findMany({
                where: {
                    deletedAt: null,
                    meterAccount: {
                        coop: {
                            id: coopId,
                            deletedAt: null
                        }
                    },
                    user: {
                        deleted_at: null
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
                        coop: {
                            id: coopId
                        }
                    },
                    user : {
                        deleted_at: null
                    }
                },
            }),

            
        ]);
        return { ar, total }
    }
}

export default ArListPaginateAction;