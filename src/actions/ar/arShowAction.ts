import prisma from "../../utils/client";

class ArShowAction {
    static async execute(id: number) {
        const ar = await prisma.accountRegistry.findUnique({
            where: {
                id: id,
                deletedAt: null,
            },
            include: {
                user: true,
                meterAccount: true
            }
        });
        return ar;
    }
}

export default ArShowAction;