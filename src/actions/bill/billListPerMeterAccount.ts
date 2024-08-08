import prisma from "../../utils/client";

class BillListPerMeterAccountAction {
    static async execute(page: number, pageSize: number, coopId: number, id: number) {
        const skip = (page - 1) * pageSize;

        // Find the specific account registry entry
        const ar = await prisma.accountRegistry.findUnique({
            where: {
                id: id,
                deletedAt: null,
                meterAccount: {
                    coopId: coopId
                }
            },
            include: {
                meterAccount: {
                    include: {
                        Bill: {
                            skip,
                            take: pageSize,
                        }
                    }
                },
                user: true,
            }
        });

        if (!ar) {
            return { ar: null, total: 0 };
        }

        const total = await prisma.bill.count({
            where: {
                meterAccountId: ar.meterAccount.id,
            },
        });

        return { ar, total }
    }
}

export default BillListPerMeterAccountAction;
