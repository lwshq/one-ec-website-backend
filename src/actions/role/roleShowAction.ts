import prisma from "../../utils/client";

class RoleShowAction {
    static async execute(id: number) {
        return await prisma.role.findUnique({
            where: { 
                id,
                deletedAt: null,
             },
        });
    }
}

export default RoleShowAction;