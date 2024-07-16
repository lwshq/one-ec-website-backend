import prisma from "../../utils/client";
import bcrypt from "bcrypt";
import Mailer from "../../utils/Mailer";

class ChangePasswordAction {
  static async changePassword(coorId: number, currentPassword: string, newPassword: string) {
    const coor = await prisma.coopCoordinator.findUnique({
      where: { 
        id: coorId 
    },
      include: { 
        account: true 
    },
    });

    if (!coor) {
      throw new Error("Coordinator not found");
    }

    const isPasswordMatch = bcrypt.compareSync(currentPassword, coor.account[0].password);

    if (!isPasswordMatch) {
      throw new Error("Current password is incorrect");
    }

    const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

    await prisma.account.update({
      where: { id: coor.account[0].id },
      data: { password: hashedNewPassword },
    });

    const mailer = new Mailer();
    await mailer.sendPasswordChangeNotification(coor.email, coor.first_name);

    return true;
  }



  static async logActivity(coor: any, activity: string) {
    await prisma.adminLog.create({
        data: {
            coor_id: coor.id,
            name: coor.first_name + ' ' + coor.last_name,
            email: coor.email,
            date: new Date(),
            time: new Date().toISOString().split('T')[1].split('.')[0],
            activity: "Password changed",
          },
    })
  }


}

export default ChangePasswordAction;
