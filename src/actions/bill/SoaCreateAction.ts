import { Bill, Prisma } from "@prisma/client";
import prisma from "../../utils/client";
import { billCreationSchema } from "../../utils/validationSchemas";
import { formatISO, parseISO } from "date-fns";
import Mailer from "../../utils/Mailer";
import UserShowAction from "../user/UserShowAction";
import { parse } from "path";

class SoaCreateAction {
    static async execute(
        data: Omit<Bill, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
        coopId: number,
        id: number,
    ) {
        const { kwhConsume, rate } = data;

        const lastBill = await prisma.bill.findFirst({
            where: {
                coopId: coopId,
                deletedAt: null
            },
            orderBy: {
                id: 'desc'
            }
        });



        const cRead = lastBill ? lastBill.cRead + kwhConsume : kwhConsume;
        const pRead = lastBill ? lastBill.cRead : 0;


        const amount = rate * kwhConsume + data.distribution + data.generation + data.sLoss +
            data.transmission + data.subsidies + data.gTax + data.fitAll + data.applied + data.other;
        const fromDate = new Date();
        const toDate = new Date();
        const nextDate = new Date();
        const dueDate = new Date();
        const formattedNextDate = formatISO(nextDate)
        const formattedFromDate = formatISO(fromDate);
        const formattedToDate = formatISO(toDate);
        const formattedDueDate = formatISO(dueDate)
        return await prisma.bill.create({
            data: {
                ...data,
                coopId: coopId,
                cRead: cRead,
                pRead: pRead,
                amount: amount,
                fromDate: formattedFromDate,
                toDate: formattedToDate,
                nextDate: formattedNextDate,
                dueDate: formattedDueDate
            }

        });

    }
    static async calculateDetails(data: Omit<Bill, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
        coop_id: number
    ) {
        const { kwhConsume, rate } = data;
        const lastBill = await prisma.bill.findFirst({
            where: {
                coopId: coop_id,
                deletedAt: null
            },
            orderBy: {
                id: 'desc'
            }
        });



        const distributionCharge = data.distribution;
        const generationCharge = data.generation;
        const systemLossCharge = data.sLoss;
        const transmissionCharge = data.transmission;
        const subsidiesCharge = data.subsidies;
        const governmentTax = data.gTax;
        const fitAllCharge = data.fitAll;
        const appliedCharge = data.applied;
        const otherCharge = data.other;

        const totalAmount = (rate * kwhConsume) +
            distributionCharge +
            generationCharge +
            systemLossCharge +
            transmissionCharge +
            subsidiesCharge +
            governmentTax +
            fitAllCharge +
            appliedCharge +
            otherCharge;
        const cRead = lastBill ? lastBill.cRead + kwhConsume : kwhConsume;
        const pRead = lastBill ? lastBill.cRead : 0;

        return {
            kwhConsume,
            rate,
            cRead,
            pRead,
            components: {
                distributionCharge,
                generationCharge,
                systemLossCharge,
                transmissionCharge,
                subsidiesCharge,
                governmentTax,
                fitAllCharge,
                appliedCharge,
                otherCharge
            },
            totalAmount
        };
    }

    static validate(
        data: Omit<Bill, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>
    ) {
        return billCreationSchema.safeParse(data);
    }

}

export default SoaCreateAction;
