import nodemailer from "nodemailer";
import { MAIL_SETTINGS } from "../../settings";



const transporter = nodemailer.createTransport({
    service: MAIL_SETTINGS.MAIL_SERVICE,
    auth: {
        user: MAIL_SETTINGS.MAIL_FROM.address,
        pass: MAIL_SETTINGS.MAIL_FROM.password,
    },
});


export const NodemailerService = {
    async sendEmail (mailTo: string[], subject: string, mailHtml: string) {
        return await transporter.sendMail({
            from: `${MAIL_SETTINGS.MAIL_FROM.name} <${MAIL_SETTINGS.MAIL_FROM.address}>`,
            to: mailTo,
            subject: subject,
            html: mailHtml,
        });
    }
}