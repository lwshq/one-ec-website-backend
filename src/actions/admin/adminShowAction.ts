import prisma from "../../utils/client";

class AdminShowAction {
    static async execute(id:number){
        const admin = await prisma.admin.findFirst({
            where: {
                id: id
            }
        });
        return admin;
    }
}

export default AdminShowAction;