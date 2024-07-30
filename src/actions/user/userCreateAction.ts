import prisma from "../../utils/client";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { User, MeterAccount, Status } from "@prisma/client";
import { formatISO, parseISO } from "date-fns";
import Mailer from "../../utils/Mailer";

type UserData = Omit<User, "id" | "created_at" | "updated_at" | "deleted_at">;
type MeterData = Omit<MeterAccount, "id" | "created_at" | "updated_at" | "deleted_at">;

class CreateCustomerAction {
    static async execute(userData: UserData, meterData: MeterData, coop_id: number) {
        return await prisma.$transaction(async (tx) => {
            const randomPassword = crypto.randomBytes(8).toString('hex');
            const hashedPassword = await bcrypt.hash(randomPassword, 10);
            const birthdate = new Date();
            const formattedBirthdate = formatISO(birthdate)
            const user = await tx.user.create({
                data: {
                    ...userData,
                    birthdate: formattedBirthdate,
                    account: {
                        create: {
                            password: hashedPassword
                        },
                    },
                },
            });



            const meterAccountName = `${userData.first_name} ${userData.middle_name || ''} ${userData.last_name}`;
            const meterAccount = await tx.meterAccount.create({
                data: {
                    ...meterData,
                    meterAccountName: meterAccountName.trim(),
                    coopId: coop_id,
                    meterActivated: true,
                    meterAddress: user.address && user.address.length > 0 ? user.address[0] : ''
                }
            });

            const accountRegistry = await tx.accountRegistry.create({
                data: {
                    userId: user.id,
                    meterId: meterAccount.id,
                    status: Status.APPROVED
                }
            });
            const mailer = new Mailer();
            await mailer.sendAccountPassword(user.email, randomPassword, user.email);
            return { user, meterAccount, accountRegistry };
        });
    }

}

export default CreateCustomerAction;
