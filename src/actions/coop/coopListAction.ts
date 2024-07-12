import prisma from "../../utils/client";

class CoopListAction {
    static async execute(page: number, pageSize: number) {
        const skip = (page - 1) * pageSize;
        const [coops, total] = await Promise.all ([
            prisma.cooperative.findMany({
                where: {
                    deletedAt: null,
                },
                skip,
                take: pageSize,
            }),
            prisma.cooperative.count({
                where: {
                    deletedAt: null,
                }
            }),
        ])
        return { coops, total }
    }
}

export default CoopListAction;