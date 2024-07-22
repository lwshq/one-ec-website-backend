import prisma from "../../utils/client";

class CoorShowAction {
    static async execute(id: number) {
        const coor = await prisma.coopCoordinator.findFirst({
            where: {
                id: id
            }
        });
        return coor;
    }
}

export default CoorShowAction;