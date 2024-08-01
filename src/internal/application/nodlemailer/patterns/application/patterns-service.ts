import {MailDto} from "../domain/dto";

export class PatternsMailService {
    confirmMail(code: string): MailDto {
        return {
            subject: 'Some Subject',
            html: `
                <h1>Thanks for your registration</h1>
                <p>To finish registration please follow the link below:
                    <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
                </p>
            `
        }
    }

    recoveryPasswordMail(code: string): MailDto {
        return {
            subject: 'Recovery password',
            html: `
                 <h1>Password recovery</h1>
                 <p>To finish password recovery please follow the link below:
                     <a href='https://somesite.com/password-recovery?recoveryCode=${code}'>recovery password</a>
                 </p>
            `
        }
    }
}