import { Bill, Prisma } from "@prisma/client";
import prisma from "../../utils/client";
import { billCreationSchema } from "../../utils/validationSchemas";
import { formatISO, parseISO } from "date-fns";
import Mailer from "../../utils/Mailer";
import UserShowAction from "../user/UserShowAction";
import { parse } from "path";

class SoaCreateAction {

    static async getNextReferenceNumber(): Promise<string> {
        const lastBill = await prisma.bill.findFirst({
            where: {},
            orderBy: {
                id: 'desc',
            },
        });

        if (!lastBill) {
            return "OEC00000001";
        }

        const lastReferenceNumber = lastBill.referenceNumber;
        const lastNumber = parseInt(lastReferenceNumber.slice(3), 10);
        const nextNumber = (lastNumber + 1).toString().padStart(8, '0');
        return `OEC${nextNumber}`;
    }

    static async execute(
        data: Omit<Bill, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
        mId: number,
    ) {


        // const accountRegistry = await prisma.accountRegistry.findFirst({
        //     where: {
        //         userId: Uid,
        //         meterId: mId
        //     }, 
        //     include: {
        //         meterAccount: true
        //     }
        // })

        // if (!accountRegistry) {
        //     throw new Error("Account registry not found.");
        // }
        const { kwhConsume, rate } = data;

        const lastBill = await prisma.bill.findFirst({
            where: {
                meterAccountId: mId,
                deletedAt: null,
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
        const referenceNumber = await this.getNextReferenceNumber();
        return await prisma.bill.create({
            data: {
                ...data,
                cRead: cRead,
                pRead: pRead,
                amount: amount,
                fromDate: formattedFromDate,
                toDate: formattedToDate,
                nextDate: formattedNextDate,
                dueDate: formattedDueDate,
                referenceNumber: referenceNumber,
                meterAccountId: mId
            },

        });

    }
    static async calculateDetails(data: Omit<Bill, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
        mId: number
    ) {
        const { kwhConsume, rate } = data;
        const lastBill = await prisma.bill.findFirst({
            where: {
                meterAccountId: mId,
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
        const referenceNumber = await this.getNextReferenceNumber();
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
            const roundedTotalAmount = parseFloat(totalAmount.toFixed(2));
        const cRead = lastBill ? lastBill.cRead + kwhConsume : kwhConsume;
        const pRead = lastBill ? lastBill.cRead : 0;

        return {
            kwhConsume,
            cRead,
            pRead,
            totalAmount: roundedTotalAmount
        };
    }

    static validate(
        data: Omit<Bill, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>
    ) {
        return billCreationSchema.safeParse(data);
    }

}

export default SoaCreateAction;
