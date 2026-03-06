import { MailerService } from '@nestjs-modules/mailer';
export interface EmailOptions {
    to: string;
    subject: string;
    template?: string;
    context?: any;
    html?: string;
    text?: string;
}
export interface WelcomeEmailData {
    firstName: string;
    email: string;
    verificationLink?: string;
}
export declare class EmailService {
    private readonly mailerService;
    constructor(mailerService: MailerService);
    sendEmail(options: EmailOptions): Promise<void>;
    sendWelcomeEmail(data: WelcomeEmailData): Promise<void>;
    sendEmailVerification(email: string, firstName: string, verificationLink: string): Promise<void>;
    sendPasswordReset(email: string, firstName: string, resetLink: string): Promise<void>;
    private generateWelcomeEmailHtml;
    private generateVerificationEmailHtml;
    private generatePasswordResetHtml;
    private generateGroupStatusUpdateHtml;
}
