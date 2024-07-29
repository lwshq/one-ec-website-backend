import prisma from "../../utils/client";
import crypto from "crypto";
import bcrypt from "bcrypt";
import Mailer from "../../utils/Mailer";
import { User,  } from "@prisma/client";


class CreateCustomerAction {
    static async execute(data: Omit<User, "id" | "createdAt" | "updatedAt" | "deletedAt" >)
    {
        
    }

}


export default CreateCustomerAction;