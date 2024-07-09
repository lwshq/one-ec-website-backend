import { User } from "../../types/custom";
import { z } from "zod";
import prisma from "../../utils/client";
import bcrypt from "bcrypt";
import { includes } from "lodash";
import Token from "../../utils/token";

class AuthAction {
  static async execute(data: User) {
    const admin = await prisma.admin.findFirst({
      where: {
        email: String(data.email),
      },
      include: {
        account: true
      }
    });

    if (!admin) {
      throw new Error("Invalid Login Credentials");
    }

    const isPasswordMatch = bcrypt.compareSync(
        String(data.password),
        admin.account[0].password
      );

    if (!isPasswordMatch) {
      throw new Error("Invalid Login Credentials");
    }

    return true;
  }

  static async generateToken(data: any) {
    const admin = await prisma.admin.findFirst({
      where: {
        email: data.email,
      },
    });

    if (!admin) {
      throw new Error("Invalid Login Credentials");
    }

    console.log(admin);

    return Token.generate(admin);
  }

  static validate(data: User) {
    const loginSchema = z.object({
      email: z.string().email(),
      password: z.string(),
    });

    return loginSchema.safeParse(data);
  }
}

export default AuthAction;