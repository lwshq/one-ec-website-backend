import prisma from "../../utils/client";

class RoleDeleteAction {
    static async execute(id: number) {
        return await prisma.role.update({
            where: {
                id
            },
            data: {
                deletedAt: new Date()
            },
        });
    }
}

export default RoleDeleteAction;