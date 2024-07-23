import fs from 'fs';
const PDFDocument = require('pdfkit');
import path from 'path';
import { Bill } from '@prisma/client';

class PDFService {
    static generatePDF(bill: Bill, filePath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const dir = path.dirname(filePath);

                // Ensure the directory exists
                if (!fs.existsSync(dir)) {
                    console.log(`Directory ${dir} does not exist. Creating...`);
                    fs.mkdirSync(dir, { recursive: true });
                }

                const doc = new PDFDocument();
                const stream = fs.createWriteStream(filePath);

                // Add event listeners to the stream
                stream.on('finish', () => {
                    console.log(`PDF successfully saved to ${filePath}`);
                    resolve();
                });

                stream.on('error', (err) => {
                    console.error(`Error writing PDF to ${filePath}:`, err);
                    reject(err);
                });

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

                doc.end();
            } catch (error) {
                console.error(`Error generating PDF:`, error);
                reject(error);
            }
        });
    }
}

export default PDFService;
