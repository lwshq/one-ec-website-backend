import { hash, hashSync } from "bcrypt";
import { Transaction } from "kysely";
import prisma from "../../utils/client";

const adminSeeder = async () => {
  try {
    await prisma.$transaction(async (trx) => {
      await trx.admin.create({
        data: {
          first_name: "Ernest", 
          last_name: "Sacdal", 
          email: "sacdalernest02@gmail.com",
          account: {
            create: {
              password: hashSync("password", 10),
            },
          },
        },
      });
    });

    return;
  } catch (error: unknown) {
    console.log(error);
  }
};

export default adminSeeder;