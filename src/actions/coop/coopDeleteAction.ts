import prisma from "../../utils/client";

class CoopDeleteAction {
    static async execute(id: number) {
        return await prisma.cooperative.update({
            where: {
                id
            },
            data: {
                deletedAt: new Date()
            },
        });
    }
}

export default CoopDeleteAction;