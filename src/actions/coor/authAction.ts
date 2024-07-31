import { User } from "../../types/custom";
import { z } from "zod";
import prisma from "../../utils/client";
import bcrypt from "bcrypt";
import { includes } from "lodash";
import Token from "../../utils/token";
import Mailer from "../../utils/Mailer";
import { aggregatePermissionsAndModules } from "../../middlewares/role";
class AuthAction {
  static async execute(data: User) {
    const coor = await prisma.coopCoordinator.findFirst({
      where: {
        email: String(data.email),
        deleted_at: null,
      },
      include: {
        account: true
      }
    });

    if (!coor) {
      throw new Error("Invalid Login Credentials");
    }

    const now = new Date();
    if (coor.loginAttempts >= 5 && coor.lastLoginAttempt) {
      const timeDifference = now.getTime() - new Date(coor.lastLoginAttempt).getTime();
      const waitTime = 1 * 60 * 1000;

      if (timeDifference < waitTime) {
        const remainingTime = Math.ceil((waitTime - timeDifference) / 1000);
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        if (coor.loginAttempts === 5) {
          const mailer = new Mailer();
          await mailer.sendLoginAttemptAlert(coor.email, "Warning: Multiple Failed Login Attempts", "You have one more login attempt left before your account is temporarily locked.");
          await prisma.admin.update({
            where: {
              id: coor.id
            },
            data: {
              loginAttempts: { increment: 1 },
              lastLoginAttempt: now,
            }
          });
        }

        throw new Error(`Too many login attempts, please try again after ${minutes} minutes and ${seconds} seconds`);
      } else {
        await prisma.coopCoordinator.update({
          where: {
            id: coor.id
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
      coor.account[0].password
    );

    if (!isPasswordMatch) {
      await prisma.coopCoordinator.update({
        where: {
          id: coor.id
        },
        data: {
          loginAttempts: { increment: 1 },
          lastLoginAttempt: now,
        }
      });
      throw new Error("Invalid Login Credentials");
    }

    await prisma.coopCoordinator.update({
      where: {
        id: coor.id
      },
      data: {
        loginAttempts: 0,
        lastLoginAttempt: null
      }
    });

    return coor;
  }

  static async generateToken(data: any) {
    const coor = await prisma.coopCoordinator.findFirst({
      where: {
        email: data.email,
        deleted_at: null
      },
    });

    if (!coor) {
      throw new Error("Invalid Login Credentials");
    }

    console.log(coor);

    return Token.generate(coor);
  }

 
  static validate(data: User) {
      const loginSchema = z.object({
      email: z.string().email(),
      password: z.string(),
    });  

    return loginSchema.safeParse(data);
  }



  static async logActivity(coor: any, activity: string) {
    await prisma.adminLog.create({
      data: {
        coor_id: coor.id,
        name: coor.first_name + ' ' + coor.last_name,
        email: coor.email,
        date: new Date(),
        time: new Date().toISOString().split('T')[1].split('.')[0],
        activity: activity
      }
    })
  }
}

export default AuthAction;
