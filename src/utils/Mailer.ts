import ejs from "ejs";
import fs from "fs";
import path from "path";
import config from "../config/index";

const nodemailer = require("nodemailer");

class Mailer {
  private sendEmail(
    receiver: string,
    subject: string,
    data?: any,
    templateName?: string,
    plainText?: string,
    htmlContent?: string
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

        content = ejs.render(template, { data });
      }

      if (!plainText && !content && !htmlContent) {
        return reject(new Error("No content provided for email."));
      }
      const mailOptions = {
        from: "OneEC",
        to: receiver,
        subject: subject,
        text: plainText ?? undefined,
        html: htmlContent ?? content ?? undefined,
      };

      transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
          console.error("Error sending email:", error);
          reject(error);
        } else {
          console.log("Email sent:", info.response);
          resolve(true); 
        }
      });
    });
  }

  async sendLoginAttemptAlert(email: string, subject: string, message: string) {
    const data = { subject, message };
    return await this.sendEmail(email, subject, data, "failedLoginAlert");
  }

  async sendPasswordResetLink(email: string, resetLink: string) {
    const data = { resetLink };
    return await this.sendEmail(email, "Password Reset Request", data, "passwordReset");
  }

  // async testSender(message: string, email: string) {
  //   const subject = "This is a sample sample email";
  //   const data = { message: message };

  //   return await this.sendEmail(email, subject, data, "index");
  // }

  // async sendVerificationCode(code: string, email: string) {
  //   const subject = "Verify your account";
  //   const content = `This is your verification code: ${code}. Do not share this with others.`;
  //   return await this.sendEmail(email, subject, null, content);
  // }

  // async testSenderNoHtml(message: string, email: string) {
  //   const subject = "This is a sample sample email";
  //   // const data = { message: message };
  //   return await this.sendEmail(email, subject, null, message);
  // }
}

export default Mailer;
