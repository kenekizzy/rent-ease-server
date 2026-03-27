/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import * as nodemailer from 'nodemailer';

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
  private resend: Resend;
  private transporter: nodemailer.Transporter;

  constructor() {
    // this.resend = new Resend(process.env.RESEND_API_KEY || 're_123456789'); 
    this.transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      // const fromEmail = process.env.RESEND_FROM_EMAIL || 'Acme <onboarding@resend.dev>';

      // const { data, error } = await this.resend.emails.send({
      //   from: fromEmail,
      //   to: options.to,
      //   subject: options.subject,
      //   html: options.html || '',
      //   text: options.text,
      // });

      // if (error) {
      //   console.error('Resend API error:', error);
      //   throw new Error('Email sending failed');
      // }

      await this.transporter.sendMail({
        from: process.env.NODEMAILER_USER,
        to: options.to,
        subject: options.subject,
        html: options.html || '',
        text: options.text,
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
      subject: 'Welcome to RentEazy! 🎉',
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

  async sendInviteEmail(
    email: string,
    inviteLink: string,
  ): Promise<void> {
    const html = this.buildInviteEmailHtml(
      email,
      inviteLink,
    );

    await this.sendEmail({
      to: email,
      subject: 'You have been invited to sign a lease',
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
          <title>Welcome to RentEazy</title>
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
              <h1>Welcome to RentEazy! 🎉</h1>
            </div>
            <div class="content">
              <h2>Hello ${data.firstName}!</h2>
              <p>Welcome to RentEazy, your trusted platform for searching for managing rents and home complaints.</p>
              <p>With RentEazy, you can:</p>
              <ul>
                <li>Raise complaints and see real time follow through on the status of your complaints</li>
                <li>Get Notifications prior to the expiration of your rent</li>
                <li>As a landlord, you can manage your properties and tenants</li>
                <li>As a tenant, you can manage your leases and payments</li>
              </ul>
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

  private buildInviteEmailHtml(address: string, inviteLink: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { padding: 24px; background: #f9f9f9; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; padding: 12px 28px; background: #4F46E5; color: white !important; text-decoration: none; border-radius: 6px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header"><h1>Rental Invitation 🏠</h1></div>
            <div class="content">
              <p>You have been invited to sign a lease agreement for:</p>
              <p><strong>${address}</strong></p>
              <p>Click the button below to review the lease details and accept your invitation:</p>
              <a href="${inviteLink}" class="button">View & Accept Invitation</a>
              <p style="margin-top:24px; font-size:12px; color:#888;">
                If you were not expecting this invitation, you can safely ignore this email.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}
