import nodemailer from "nodemailer";
import { MAIL_SETTINGS } from "../../../../settings";
import {injectable} from "inversify";



const transporter = nodemailer.createTransport({
    service: MAIL_SETTINGS.MAIL_SERVICE,
    host: MAIL_SETTINGS.MAIL_HOST,
    port: MAIL_SETTINGS.MAIL_PORT,
    secure: MAIL_SETTINGS.MAIL_SECURE,
    ignoreTLS: MAIL_SETTINGS.MAIL_IGNORE_TLS,
    auth: {
        user: MAIL_SETTINGS.MAIL_FROM.address,
        pass: MAIL_SETTINGS.MAIL_FROM.password,
    },
});


@injectable()
export class NodemailerService {
    async sendEmail (mailTo: string[], subject: string, mailHtml: string) {
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
}




// export const nodemailerService = {
//     async sendEmail (mailTo: string[], subject: string, mailHtml: string) {
//         return await transporter.sendMail({
//             from: `${MAIL_SETTINGS.MAIL_FROM.name} <${MAIL_SETTINGS.MAIL_FROM.address}>`,
//             to: mailTo,
//             subject: subject,
//             html: mailHtml,
//         });
//     }
// }


