import { User } from "../../types/custom";
import { z } from "zod";
import prisma from "../../utils/client";
import bcrypt from "bcrypt";
import { includes } from "lodash";
import Token from "../../utils/token";
import Mailer from "../../utils/Mailer";

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

    const now = new Date();
    if (admin.loginAttempts >= 5 && admin.lastLoginAttempt) {
      const timeDifference = now.getTime() - new Date(admin.lastLoginAttempt).getTime();
      const waitTime = 1 * 60 * 1000;

      if (timeDifference < waitTime) {
        const remainingTime = Math.ceil((waitTime - timeDifference) / 1000);
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        if (admin.loginAttempts === 5) {
          const mailer = new Mailer();
          await mailer.sendLoginAttemptAlert(admin.email, "Warning: Multiple Failed Login Attempts", "You have one more login attempt left before your account is temporarily locked.");
          await prisma.admin.update({
            where: {
              id: admin.id
            },
            data: {
              loginAttempts: { increment: 1 },
              lastLoginAttempt: now,
            }
          });
        }

        throw new Error(`Too many login attempts, please try again after ${minutes} minutes and ${seconds} seconds`);
      } else {
        await prisma.admin.update({
          where: {
            id: admin.id
          },
          data: {
            loginAttempts: 0,
            lastLoginAttempt: null
          }
        });
      }
    }

    const isPasswordMatch = bcrypt.compareSync(
      data.password.toString(),
      admin.account[0].password
    );

    if (!isPasswordMatch) {
      await prisma.admin.update({
        where: {
          id: admin.id
        },
        data: {
          loginAttempts: { increment: 1 },
          lastLoginAttempt: now,
        }
      });
      throw new Error("Invalid Login Credentials");
    }

    await prisma.admin.update({
      where: {
        id: admin.id
      },
      data: {
        loginAttempts: 0,
        lastLoginAttempt: null
      }
    });

    return admin;
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

  static async logActivity(admin: any, activity: string) {
    await prisma.adminLog.create({
      data: {
        admin_id: admin.id,
        name: admin.first_name + ' ' + admin.last_name,
        email: admin.email,
        date: new Date(),
        time: new Date().toISOString().split('T')[1].split('.')[0],
        activity: activity
      }
    })
  }
}

export default AuthAction;
