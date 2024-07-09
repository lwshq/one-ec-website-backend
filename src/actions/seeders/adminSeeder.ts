import { hashSync } from "bcrypt";
import { Admin } from "@prisma/client";
import prisma from "../../utils/client";

const adminSeeder = {
    async execute(
        data: Omit<Admin, "id" | "createdAt" | "updatedAt" | "deletedAt">
    ) {
        try {
            // Hash the password
            const hashedPassword = hashSync(data.password, 10);
            
            // Insert the data into the Admin table
            const admin = await prisma.admin.create({
                data: {
                    ...data,
                    password: hashedPassword
                }
            });
            return;
        } catch (error) {
            console.log (error);
        }
    }
}

export default adminSeeder;
