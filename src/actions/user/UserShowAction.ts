import { UserRole } from "@prisma/client";
import prisma from "../../utils/client";

class UserShowAction {
    static async execute (id: number){
        return await prisma.user.fi
    } 

}

export default UserRole