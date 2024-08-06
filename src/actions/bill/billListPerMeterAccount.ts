import prisma from "../../utils/client";

class BillListPerMeterAccountAction {
    static async execute(page: number, pageSize: number, coopId: number, userId: number) {
        const userExists = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!userExists) {
            throw new Error(`User with ID ${userId} does not exist`);
        }
        const userInAccountRegistry = await prisma.accountRegistry.findFirst({
            where: {
                userId: userId,
                meterAccount: {
                    coopId: coopId
                },
                deletedAt: null
            },
        });

        if (!userInAccountRegistry) {
            throw new Error(`User with ID ${userId} does not exist in the account registry`);
        }
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