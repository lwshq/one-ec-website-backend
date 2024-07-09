import config from "../config/index";
import ejs from "ejs";
import fs from "fs";
import path from "path";

const nodemailer = require("nodemailer");

class Mailer {
  private sendEmail(
    receiver: string,
    subject: string,
    data?: any,
    templateName?: string,
    plainText?: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: config.email.address,
          pass: config.email.password,
        },
      });

      let content: string | null = null;
      if (templateName) {
        const templatePath = path.resolve(
          __dirname,
          `../views/email/${templateName}.ejs`
        );

        const template = fs.readFileSync(templatePath, "utf8");

        // Render the EJS template with provided data
        content = ejs.render(template, { data });
      }

      if (!plainText && !content) {
        return reject(new Error("No content provided for email."));
      }
      const mailOptions = {
        from: "OneEC",
        to: receiver,
        subject: subject,
        text: plainText ?? undefined,
        html: content ?? undefined,
      };

      transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
          console.error("Error sending email:", error);
          reject(error); // Reject the promise if there's an error
        } else {
          console.log("Email sent:", info.response);
          resolve(true); // Resolve the promise if email sent successfully
        }
      });
    });
  }

  async testSender(message: string, email: string) {
    const subject = "This is a sample sample email";
    const data = { message: message };

    return await this.sendEmail(email, subject, data, "index");
  }

  async sendVerificationCode(code: string, email: string) {
    const subject = "Verify your account";
    const content = `This is your verification code : ${code}. Do not share this to others`;
    return await this.sendEmail(email, subject, null, content);
  }

  async testSenderNoHtml(message: string, email: string) {
    const subject = "This is a sample sample email";
    // const data = { message: message };
    return await this.sendEmail(email, subject, null, message);
  }
}

export default Mailer;
