import fs from 'fs';
const PDFDocument = require('pdfkit');
import { Bill } from '@prisma/client';

class PDFService {
    static generatePDF(bill: Bill, filePath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument();
            const stream = fs.createWriteStream(filePath);

            doc.pipe(stream);

            doc.fontSize(16).text(`Bill Details`, { underline: true });
            doc.moveDown();
            doc.fontSize(12);
            doc.text(`Bill ID: ${bill.id}`);
            doc.text(`From Date: ${bill.fromDate.toISOString().split('T')[0]}`);
            doc.text(`To Date: ${bill.toDate.toISOString().split('T')[0]}`);
            doc.text(`kWh Consumed: ${bill.kwhConsume}`);
            doc.text(`Rate per kWh: ${bill.rate}`);
            doc.text(`Total Amount: ${bill.amount}`);
            doc.text(`Distribution Charge: ${bill.distribution}`);
            doc.text(`Generation Charge: ${bill.generation}`);
            doc.text(`System Loss Charge: ${bill.sLoss}`);
            doc.text(`Transmission Charge: ${bill.transmission}`);
            doc.text(`Subsidies: ${bill.subsidies}`);
            doc.text(`Government Tax: ${bill.gTax}`);
            doc.text(`FIT-All Charge: ${bill.fitAll}`);
            doc.text(`Applied Fees: ${bill.applied}`);
            doc.text(`Other Charges: ${bill.other}`);
            doc.text(`Amount: ${bill.amount}`);
            doc.end();

            stream.on('finish', () => resolve());
            stream.on('error', reject);
        });
    }
}

export default PDFService;
