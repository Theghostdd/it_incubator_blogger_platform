import {MailDto} from "../../../internal/application/nodlemailer/patterns/domain/dto";
import {saveError} from "../../../internal/utils/error-utils/save-error";
import {inject, injectable} from "inversify";
import {NodemailerService} from "../../../internal/application/nodlemailer/nodemailer/nodemailer";
import {PatternsMailService} from "../../../internal/application/nodlemailer/patterns/application/patterns-service";

@injectable()
export class AuthMailService {
    constructor(
        @inject(NodemailerService) private nodemailerService: NodemailerService,
        @inject(PatternsMailService) private patternsMailService: PatternsMailService
    ) {
    }

     sendRegistrationMail(email: string[], confirmCode: string): void {
        const mail: MailDto = this.patternsMailService.confirmMail(confirmCode)
         this.nodemailerService.sendEmail(email, mail.subject, mail.html)
            .catch((err) => {
                saveError("Send Email", "SMTP", "Send confirmation code", err)
            })
    }

    sendRecoveryPasswordMail(email: string[], confirmCode: string): void {
        const mail: MailDto = this.patternsMailService.recoveryPasswordMail(confirmCode)
        this.nodemailerService.sendEmail(email, mail.subject, mail.html)
            .catch((err) => {
                saveError("Send Email", "SMTP", "Send confirmation code", err)
            })
    }
}