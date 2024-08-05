import prisma from "../../utils/client";

class BillShowAction {
    static async execute(id: number) {
        const bill = await prisma.bill.findUnique({
            where: {
                id: id,
                deletedAt: null,
            },
        });
        return bill;
    }
}

export default BillShowAction;