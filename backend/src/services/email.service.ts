import nodemailer, { Transporter } from 'nodemailer';
import { SampleRequest, Order } from '../types';

export class EmailService {
  private transporter: Transporter | null = null;
  private adminEmail: string;

  constructor() {
    this.adminEmail = process.env.ADMIN_EMAIL || 'admin@nuttryx.com';
    this.initTransporter();
  }

  private initTransporter() {
    const user = process.env.EMAIL_USER;
    const rawPass = process.env.EMAIL_PASS;
    const cleanPass = rawPass ? rawPass.replace(/\s+/g, '') : '';

    if (user && cleanPass) {
      if (user.endsWith('@gmail.com')) {
        this.transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user,
            pass: cleanPass
          }
        });
      } else {
        const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
        const port = Number(process.env.EMAIL_PORT) || 587;
        this.transporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: {
            user,
            pass: cleanPass
          }
        });
      }
      console.log('✅ Real SMTP Email transporter configured for:', user);
    } else {
      console.log('ℹ️ SMTP credentials not set in .env. Emails will be logged to console.');
    }
  }

  async sendSampleNotification(sample: SampleRequest): Promise<boolean> {
    const from = process.env.EMAIL_FROM || '"NUTTRYX Foods" <notifications@nuttryx.com>';
    const to = this.adminEmail;
    const subject = `🎁 New Free Sample Request: ${sample.name} (${sample.selectedFlavour})`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FAF7F2; border: 1px solid #E8DDCE; border-radius: 12px; overflow: hidden;">
        <div style="background: #20100A; color: #FAF7F2; padding: 20px; text-align: center;">
          <h2 style="margin: 0; font-size: 20px; letter-spacing: 1px;">NUTTRYX™ FOODS</h2>
          <p style="margin: 4px 0 0; font-size: 13px; color: #D9822B;">New Free 50g Sample Request Received</p>
        </div>
        <div style="padding: 24px; background: #FFFFFF; color: #20100A;">
          <p style="font-size: 15px; margin-top: 0;">A new user has submitted a free sample claim from the store:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 18px 0; font-size: 14px;">
            <tr style="border-bottom: 1px solid #F0E8DE;">
              <td style="padding: 10px; font-weight: bold; color: #736257; width: 140px;">Sample ID:</td>
              <td style="padding: 10px; font-weight: bold; color: #20100A;">${sample.id}</td>
            </tr>
            <tr style="border-bottom: 1px solid #F0E8DE;">
              <td style="padding: 10px; font-weight: bold; color: #736257;">Requested Flavour:</td>
              <td style="padding: 10px; font-weight: bold; color: #D9822B;">${sample.selectedFlavour}</td>
            </tr>
            <tr style="border-bottom: 1px solid #F0E8DE;">
              <td style="padding: 10px; font-weight: bold; color: #736257;">Customer Name:</td>
              <td style="padding: 10px; color: #20100A;">${sample.name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #F0E8DE;">
              <td style="padding: 10px; font-weight: bold; color: #736257;">Phone Number:</td>
              <td style="padding: 10px; color: #20100A;"><a href="tel:${sample.phone}" style="color: #20100A; text-decoration: none; font-weight: bold;">${sample.phone}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #F0E8DE;">
              <td style="padding: 10px; font-weight: bold; color: #736257;">Email:</td>
              <td style="padding: 10px; color: #20100A;">${sample.email || 'N/A'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #F0E8DE;">
              <td style="padding: 10px; font-weight: bold; color: #736257;">Delivery Address:</td>
              <td style="padding: 10px; color: #20100A;">${sample.address}</td>
            </tr>
            <tr style="border-bottom: 1px solid #F0E8DE;">
              <td style="padding: 10px; font-weight: bold; color: #736257;">City:</td>
              <td style="padding: 10px; color: #20100A;">${sample.city}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; color: #736257;">Pincode:</td>
              <td style="padding: 10px; color: #20100A;">${sample.pincode}</td>
            </tr>
          </table>

          <div style="background: #FAF7F2; padding: 14px; border-radius: 8px; border-left: 4px solid #D9822B; font-size: 13px; color: #5C4A3E;">
            ⚡ Please dispatch this sample within 24 hours to ensure high conversion to 500g/1kg jar orders.
          </div>
        </div>
        <div style="background: #F3ECE2; color: #8A7A70; padding: 12px; text-align: center; font-size: 12px;">
          NUTTRYX Peanut Butter Admin System • Surat, Gujarat
        </div>
      </div>
    `;

    console.log(`\n======================================================`);
    console.log(`📧 [EMAIL NOTIFICATION] TO: ${to}`);
    console.log(`SUBJECT: ${subject}`);
    console.log(`CUSTOMER: ${sample.name} | PHONE: ${sample.phone} | FLAVOUR: ${sample.selectedFlavour}`);
    console.log(`ADDRESS: ${sample.address}, ${sample.city} - ${sample.pincode}`);
    console.log(`======================================================\n`);

    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from,
          to,
          subject,
          html
        });
        console.log(`✅ Real email delivered to ${to} successfully!`);
        return true;
      } catch (err) {
        console.error('❌ Failed to send SMTP email:', err);
        return false;
      }
    }

    return true;
  }

  async sendOrderNotification(order: Order): Promise<boolean> {
    const from = process.env.EMAIL_FROM || '"NUTTRYX Foods" <orders@nuttryx.com>';
    const to = this.adminEmail;
    const subject = `📦 New Store Order: #${order.id} - ₹${order.total} (${order.customer.name})`;

    const itemsRows = order.items.map(item => `
      <tr style="border-bottom: 1px solid #F0E8DE;">
        <td style="padding: 8px 10px;">${item.product.name} (${item.selectedSize.weight})</td>
        <td style="padding: 8px 10px; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px 10px; text-align: right; font-weight: bold;">₹${item.selectedSize.price * item.quantity}</td>
      </tr>
    `).join('');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FAF7F2; border: 1px solid #E8DDCE; border-radius: 12px; overflow: hidden;">
        <div style="background: #20100A; color: #FAF7F2; padding: 20px; text-align: center;">
          <h2 style="margin: 0; font-size: 20px; letter-spacing: 1px;">NUTTRYX™ FOODS</h2>
          <p style="margin: 4px 0 0; font-size: 13px; color: #D9822B;">New Customer Order Confirmed</p>
        </div>
        <div style="padding: 24px; background: #FFFFFF; color: #20100A;">
          <h3 style="margin-top: 0; color: #20100A;">Order #${order.id} - ₹${order.total}</h3>
          
          <p><strong>Customer:</strong> ${order.customer.name} (<a href="tel:${order.customer.phone}">${order.customer.phone}</a>)</p>
          <p><strong>Shipping Address:</strong> ${order.customer.address}, ${order.customer.city}, ${order.customer.state || ''} - ${order.customer.pincode}</p>

          <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
            <thead>
              <tr style="background: #FAF7F2; border-bottom: 2px solid #E8DDCE;">
                <th style="padding: 8px 10px; text-align: left;">Item</th>
                <th style="padding: 8px 10px; text-align: center;">Qty</th>
                <th style="padding: 8px 10px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 10px; font-weight: bold; text-align: right;">Total Paid:</td>
                <td style="padding: 10px; font-weight: 900; text-align: right; font-size: 16px; color: #20100A;">₹${order.total}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    `;

    console.log(`\n======================================================`);
    console.log(`📦 [ORDER NOTIFICATION] TO: ${to}`);
    console.log(`ORDER ID: ${order.id} | TOTAL: ₹${order.total}`);
    console.log(`CUSTOMER: ${order.customer.name} | ${order.customer.phone}`);
    console.log(`======================================================\n`);

    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from,
          to,
          subject,
          html
        });
        console.log(`✅ Real order email sent to ${to}!`);
        return true;
      } catch (err) {
        console.error('❌ Failed to send SMTP order email:', err);
        return false;
      }
    }

    return true;
  }

  async sendPasswordResetOtpEmail(to: string, otp: string, recipientName: string = 'Customer'): Promise<boolean> {
    const from = process.env.EMAIL_FROM || '"NUTTRYX Foods" <support@nuttryx.com>';
    const subject = `🔐 ${otp} is your NUTTRYX Password Reset OTP`;

    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 580px; margin: 0 auto; background: #1C120C; border: 1px solid rgba(229, 131, 45, 0.3); border-radius: 20px; overflow: hidden; color: #FAF7F2; box-shadow: 0 16px 36px rgba(0,0,0,0.5);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #180D07 0%, #29150B 100%); padding: 32px 24px; text-align: center; border-bottom: 1px solid rgba(229, 131, 45, 0.2);">
          <div style="display: inline-block; width: 44px; height: 44px; border-radius: 50%; background: rgba(229, 131, 45, 0.15); border: 1px solid rgba(229, 131, 45, 0.4); line-height: 44px; font-size: 20px; margin-bottom: 12px;">🥜</div>
          <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 2px; color: #FAF7F2;">NUTTRYX<span style="color: #E5832D;">™</span></h1>
          <p style="margin: 6px 0 0; font-size: 13px; color: #A8988C; letter-spacing: 0.5px;">Healthy Nutrition, Better You</p>
        </div>

        <!-- Body -->
        <div style="padding: 32px 28px; background: #20130C;">
          <h2 style="margin: 0 0 12px; font-size: 18px; color: #FAF7F2; font-weight: 700;">Password Reset Request</h2>
          <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #C4B5A5;">
            Hello <strong style="color: #FAF7F2;">${recipientName}</strong>,<br>
            We received a request to reset your password. Use the following 6-digit One-Time Password (OTP) to proceed with resetting your password:
          </p>

          <!-- OTP Box -->
          <div style="background: rgba(229, 131, 45, 0.1); border: 2px dashed #E5832D; border-radius: 14px; padding: 20px; text-align: center; margin: 24px 0;">
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #E5832D; font-weight: 700; margin-bottom: 8px;">Your Verification Code</div>
            <div style="font-size: 34px; font-weight: 800; letter-spacing: 10px; color: #FFFFFF; font-family: 'Courier New', Courier, monospace; text-shadow: 0 2px 10px rgba(229, 131, 45, 0.4);">${otp}</div>
            <div style="font-size: 12px; color: #A8988C; margin-top: 8px;">⏱️ Valid for <strong>10 minutes</strong> only</div>
          </div>

          <p style="margin: 0 0 16px; font-size: 13px; line-height: 1.5; color: #A8988C;">
            If you did not request this verification code, please ignore this email or reach out to support. Your account remains completely secure.
          </p>

          <div style="background: rgba(0,0,0,0.25); border-left: 3px solid #E5832D; padding: 12px 16px; border-radius: 6px; font-size: 12px; color: #D4C4B5;">
            🔒 <strong>Security Tip:</strong> Never share this OTP with anyone, including NUTTRYX representatives.
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #140A05; padding: 20px; text-align: center; font-size: 12px; color: #8A7A70; border-top: 1px solid rgba(255,255,255,0.06);">
          NUTTRYX Foods • Premium Roasted Peanut Butter • Surat, Gujarat<br>
          <span style="opacity: 0.7;">© 2026 NUTTRYX. All rights reserved.</span>
        </div>
      </div>
    `;

    console.log(`\n======================================================`);
    console.log(`🔐 [PASSWORD RESET OTP] TO: ${to}`);
    console.log(`OTP CODE: ${otp}`);
    console.log(`RECIPIENT: ${recipientName}`);
    console.log(`======================================================\n`);

    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from,
          to,
          subject,
          html
        });
        console.log(`✅ Real Password Reset OTP email delivered to ${to} successfully!`);
        return true;
      } catch (err) {
        console.error('❌ Failed to send SMTP Password Reset OTP email:', err);
        return false;
      }
    }

    return true;
  }
}

export const emailService = new EmailService();
