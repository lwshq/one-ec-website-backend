import prisma from "../../utils/client";

class CoopShowAction {
    static async execute(id: number) {
        return await prisma.cooperative.findUnique({
            where: { id },
        });
    }
}

export default CoopShowAction;