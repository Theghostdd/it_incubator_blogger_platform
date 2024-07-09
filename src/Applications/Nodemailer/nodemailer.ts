import nodemailer from "nodemailer";
import { MAIL_SETTINGS } from "../../settings";



export const transporter = nodemailer.createTransport({
    service: MAIL_SETTINGS.MAIL_SERVICE,
    auth: {
        user: MAIL_SETTINGS.MAIL_FROM.address,
        pass: MAIL_SETTINGS.MAIL_FROM.password,
    },
});


export const sendEmail = async (mailTo: string[], subject: string, mailHtml: string) => {
    try {
        await transporter.sendMail({
            from: `${MAIL_SETTINGS.MAIL_FROM.name} <${MAIL_SETTINGS.MAIL_FROM.address}>`,
            to: mailTo,
            subject: subject, 
            html: mailHtml, 
        });
    } catch (e: any) {
        throw new Error(e)
    }
}