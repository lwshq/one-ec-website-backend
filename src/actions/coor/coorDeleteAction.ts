import prisma from "../../utils/client";

class CoorDeleteAction {
    static async execute(id: number) {
        return await prisma.coopCoordinator.update({
            where: {
                id
            },
            data: {
                deleted_at: new Date()
            },
        });
    }
}

export default CoorDeleteAction;