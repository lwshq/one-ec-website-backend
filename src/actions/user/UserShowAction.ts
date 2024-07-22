import { UserRole } from "@prisma/client";
import prisma from "../../utils/client";

class UserShowAction {
    static async execute (id: number){
        return await prisma.user.findUnique({
            where: {
                id: id,
                deleted_at: null,
            }
        })
    } 

}

export default UserShowAction;