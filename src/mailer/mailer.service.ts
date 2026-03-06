/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
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

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        context: options.context,
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('Email sending failed');
    }
  }

  async sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
    const html = this.generateWelcomeEmailHtml(data);

    await this.sendEmail({
      to: data.email,
      subject: 'Welcome to JobHuntly! 🎉',
      html,
    });
  }

  async sendEmailVerification(
    email: string,
    firstName: string,
    verificationLink: string,
  ): Promise<void> {
    const html = this.generateVerificationEmailHtml(
      firstName,
      verificationLink,
    );

    await this.sendEmail({
      to: email,
      subject: 'Verify Your Email Address',
      html,
    });
  }

  async sendPasswordReset(
    email: string,
    firstName: string,
    resetLink: string,
  ): Promise<void> {
    const html = this.generatePasswordResetHtml(firstName, resetLink);

    await this.sendEmail({
      to: email,
      subject: 'Reset Your Password',
      html,
    });
  }


  private generateWelcomeEmailHtml(data: WelcomeEmailData): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to Job Huntly</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Job Huntly! 🎉</h1>
            </div>
            <div class="content">
              <h2>Hello ${data.firstName}!</h2>
              <p>Welcome to Job Huntly, your trusted platform for searching for a job.</p>
              <p>With Job Huntly, you can:</p>
              <ul>
                <li>Join and search for peer jobs</li>
                <li>Get Notifications from your favourite companies</li>
                <li>Follow up with recruiters for prospective job offers</li>
              </ul>
              ${
                data.verificationLink
                  ? `
                <p>To get started, please verify your email address:</p>
                <a href="${data.verificationLink}" class="button">Verify Email</a>
              `
                  : ''
              }
              <p>Thank you for joining our community!</p>
              <p>Best regards,<br>The Erda Team</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private generateVerificationEmailHtml(
    firstName: string,
    verificationLink: string,
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Verify Your Email</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Verify Your Email Address</h1>
            </div>
            <div class="content">
              <h2>Hello ${firstName}!</h2>
              <p>Please verify your email address to complete your registration.</p>
              <p>Click the button below to verify your account:</p>
              <a href="${verificationLink}" class="button">Verify Email Address</a>
              <p>If you didn't create an account, you can safely ignore this email.</p>
              <p>Best regards,<br>The Erda Team</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private generatePasswordResetHtml(
    firstName: string,
    resetLink: string,
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Password Reset</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #EF4444; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background: #EF4444; color: white; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Hello ${firstName}!</h2>
              <p>We received a request to reset your password for your AjoConnect account.</p>
              <p>Click the button below to reset your password:</p>
              <a href="${resetLink}" class="button">Reset Password</a>
              <p>This link will expire in 1 hour for security reasons.</p>
              <p>If you didn't request this password reset, you can safely ignore this email.</p>
              <p>Best regards,<br>The AjoConnect Team</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private generateGroupStatusUpdateHtml(
    memberName: string,
    groupName: string,
    status: string,
    message: string,
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Group Status Update</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #6366F1; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .status-update { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Group Status Update 📢</h1>
            </div>
            <div class="content">
              <h2>Hello ${memberName}!</h2>
              <p>There's an important update regarding your group <strong>${groupName}</strong>.</p>
              
              <div class="status-update">
                <h3>Status: ${status}</h3>
                <p>${message}</p>
              </div>
              
              <p>Please log in to your account for more details and any required actions.</p>
              <p>Best regards,<br>The AjoConnect Team</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}
