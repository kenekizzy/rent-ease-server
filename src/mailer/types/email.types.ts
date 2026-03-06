export enum EmailType {
  WELCOME = 'welcome',
  EMAIL_VERIFICATION = 'email_verification',
}

export interface BaseEmailData {
  recipientEmail: string;
  recipientName: string;
}

export interface WelcomeEmailData extends BaseEmailData {
  verificationLink?: string;
}

export interface EmailVerificationData extends BaseEmailData {
  verificationLink: string;
}

export interface PasswordResetData extends BaseEmailData {
  resetLink: string;
}
