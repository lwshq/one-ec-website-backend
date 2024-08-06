import { User, UserRole } from "@prisma/client";
import prisma from "../../utils/client";
import bcrypt from "bcrypt";
import { formatISO, parseISO } from "date-fns";

class UserRegistrationAction {

    static async execute(data: Omit<User, "id" | "created_at" | "updated_at" | "deleted_at">,
        password: string
    ) {
        const hashedPassword = await bcrypt.hash(password, 10);
        let formattedBirthdate = null;
        if (data.birthdate) {
            formattedBirthdate = formatISO(data.birthdate);
        }
        return await prisma.user.create({
            data: {
                ...data,
                birthdate: formattedBirthdate,
                role: UserRole.USER,
                account: {
                    create: {
                        password: hashedPassword
                    }
                }
            },
            include: {
                account: true
            }
        })
    }

}

export default UserRegistrationAction;