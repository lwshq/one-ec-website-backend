import prisma from "../../utils/client";

class BillShowAction {
    static async execute(id: number) {
        const bill = await prisma.bill.findUnique({
            where: {
                id: id,
                deletedAt: null,
            },
            include: {
                meterAccount: {
                    include: {
                        accountRegistry: {
                            include: {
                                user: true
                            }
                        }
                    }
                }
            }
        });
        return bill;
    }
}

export default BillShowAction;