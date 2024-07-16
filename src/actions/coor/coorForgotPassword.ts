
import prisma from "../../utils/client";
import bcrypt from "bcrypt";
import crypto from "crypto";
import Mailer from "../../utils/Mailer";
import { config } from "dotenv";

config();

class ForgotPasswordAction {
    static async requestReset(email: string) {
        const coor = await prisma.coopCoordinator.findUnique({
            where: { email },
            include: { account: true },
        });

        if (!coor) {
            throw new Error("Coordinator not found");
        }

        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        await prisma.passwordReset.create({
            data: {
                coorId: coor.id,
                token,
                expiresAt,
            },
        });

        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        const mailer = new Mailer();
        await mailer.sendPasswordResetLink(coor.email, resetLink);
        return true;
    }

    static async resetPassword(token: string, newPassword: string) {
        const resetRequest = await prisma.passwordReset.findFirst({
            where: { token, deletedAt: null },
            include: { coopCoor: true },
        });

        if (!resetRequest || resetRequest.expiresAt < new Date()) {
            throw new Error("Invalid or expired password reset token");
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        await prisma.account.updateMany({
            where: { coordinator_id: resetRequest.coorId },
            data: { password: hashedPassword },
        });

        await prisma.passwordReset.update({
            where: { id: resetRequest.id },
            data: { deletedAt: new Date() },
        });

        return true;
    }
}

export default ForgotPasswordAction;
