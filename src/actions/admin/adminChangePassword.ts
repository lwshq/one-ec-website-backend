import prisma from "../../utils/client";
import bcrypt from "bcrypt";
import Mailer from "../../utils/Mailer";

class ChangePasswordAction {
  static async changePassword(adminId: number, currentPassword: string, newPassword: string) {
    const admin = await prisma.admin.findUnique({
      where: { 
        id: adminId 
    },
      include: { 
        account: true 
    },
    });

    if (!admin) {
      throw new Error("Admin not found");
    }

    const isPasswordMatch = bcrypt.compareSync(currentPassword, admin.account[0].password);

    if (!isPasswordMatch) {
      throw new Error("Current password is incorrect");
    }

    const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

    await prisma.account.update({
      where: { id: admin.account[0].id },
      data: { password: hashedNewPassword },
    });

    const mailer = new Mailer();
    await mailer.sendPasswordChangeNotification(admin.email, admin.first_name);

    return true;
  }



  static async logActivity(admin: any, activity: string) {
    await prisma.adminLog.create({
        data: {
            admin_id: admin.id,
            name: admin.first_name + ' ' + admin.last_name,
            email: admin.email,
            date: new Date(),
            time: new Date().toISOString().split('T')[1].split('.')[0],
            activity: "Password changed",
          },
    })
  }


}

export default ChangePasswordAction;
