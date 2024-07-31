import { Request } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import Token from '../../utils/token';
import { User } from '../../types/custom';
import { z } from 'zod';

const prisma = new PrismaClient();

class UserAuthAction {
  static async execute(data: User, ip: string, id: number) {

    const user = await prisma.user.findFirst({
      where: {
        email: String(data.email),
        deleted_at: null
      },
      include: {
        account: true

      }
    });

    if (!user) {
      await this.recordFailedAttempt(ip, id);
      throw new Error("Invalid Login Credentials");
    }

    const lockedOut = await this.checkAndHandleLockout(ip, id);
    if (lockedOut) {
      throw new Error("Too many login attempts. Please try again later.");
    }

    const isPasswordMatch = await bcrypt.compareSync(
      data.password.toString(),
      user.account[0].password
    );
    if (!isPasswordMatch) {
      await this.recordFailedAttempt(ip, id);
      throw new Error("Invalid Login Credentials");
    }

    await this.resetLoginAttempts(ip, id);

    const token = Token.generate({ id: user.id, email: user.email });
    return { user, token };
  }

  static async recordFailedAttempt(ip: string, id: number) {
    const now = new Date();
    const existingAttempt = await prisma.loginAttempt.findFirst({
      where: {
        ip_address: ip,
        userId: id
      }
    });

    if (existingAttempt) {
      await prisma.loginAttempt.update({
        where: {
          id: existingAttempt.id
        },
        data: {
          attempts: {
            increment: 1
          },
          last_attempt_at: now
        }
      });
    } else {
      await prisma.loginAttempt.create({
        data: {
          ip_address: ip,
          userId: id, attempts: 1,
          last_attempt_at: now
        }
      });
    }
  }


  static async checkAndHandleLockout(ip: string, id: number) {
    const attempt = await prisma.loginAttempt.findFirst({
      where: {
        ip_address: ip,
        userId: id
      }
    });

    if (attempt) {
      if (attempt.last_attempt_at === null) {
        return false;
      }

      const lastAttemptTime = new Date(attempt.last_attempt_at).getTime();
      const now = new Date().getTime();
      const timeDifference = now - lastAttemptTime;
      const lockoutTime = 60 * 1000;

      if (attempt.attempts >= 5 && timeDifference < lockoutTime) {
        return true;
      } else if (timeDifference >= lockoutTime) {
        await this.resetLoginAttempts(ip, id);
      }
    }

    return false;
  }


  static async resetLoginAttempts(ip: string, id: number) {
    const attempt = await prisma.loginAttempt.findFirst({
      where: {
        ip_address: ip,
        userId: id
      }
    });

    if (attempt) {
      await prisma.loginAttempt.update({
        where: {
          id: attempt.id
        },
        data:
        {
          attempts: 0,
          last_attempt_at: null
        }
      });
    }
  }

  static validate(data: User) {
    const loginSchema = z.object({
      email: z.string().email(),
      password: z.string(),
    });

    return loginSchema.safeParse(data);
  }

  static async generateToken(data: any) {
    const userToken = await prisma.user.findFirst({
      where: {
        email: data.email,
        deleted_at: null
      },
    });

    if (!userToken) {
      throw new Error("Invalid Login Credentials");
    }

    console.log(userToken);

    return Token.generate(userToken);
  }

}

export default UserAuthAction;
