import { BookingData } from '../types';
import { JUST_MEL_DETAIL_PROFILE } from '../data/defects';

export interface EmailPayload {
  to: string;
  from: string;
  subject: string;
  previewText: string;
  bodyHtml: string;
  bodyText: string;
}

/**
 * Generates automated verification email sent during Step 2 (verification)
 */
export function generateVerificationEmails(booking: BookingData, code: string): {
  clientEmail: EmailPayload;
  detailerEmail: EmailPayload;
} {
  const profile = JUST_MEL_DETAIL_PROFILE;
  const detailerEmailAddress = 'jamelisjustmeldetail@gmail.com';

  const clientEmail: EmailPayload = {
    to: booking.clientEmail || 'client@example.com',
    from: `${profile.businessName} <${profile.emails[0]}>`,
    subject: `Your JustMelDetail Verification Code: ${code}`,
    previewText: `Enter code ${code} to verify your mobile detailing appointment in Aiken, SC.`,
    bodyHtml: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
        <div style="background: #0f172a; padding: 24px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.5px;">${profile.businessName}</h1>
          <p style="margin: 4px 0 0; font-size: 12px; color: #94a3b8;">Mobile Detailing • Aiken, SC & Surrounding Areas</p>
        </div>
        <div style="padding: 28px 24px; color: #1e293b;">
          <h2 style="margin: 0 0 12px; font-size: 16px; color: #0f172a;">Hello ${booking.clientName},</h2>
          <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.5; color: #475569;">
            Please enter the 6-digit verification code below to confirm your mobile appointment request with <strong>Jamel Tyler</strong>.
          </p>
          <div style="background: #f1f5f9; border: 2px dashed #94a3b8; border-radius: 12px; padding: 18px; text-align: center; margin: 20px 0;">
            <span style="font-family: monospace; font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #0284c7;">${code}</span>
            <p style="margin: 6px 0 0; font-size: 11px; color: #64748b;">Code expires in 15 minutes • One-time security authorization</p>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; font-size: 12px; color: #334155; margin-top: 20px;">
            <p style="margin: 0 0 4px; font-weight: 600; color: #0f172a;">Booking Overview:</p>
            <p style="margin: 0 0 2px;">• <strong>Vehicle:</strong> ${booking.vehicleSummary} (VIN: ${booking.vin || 'Pending'})</p>
            <p style="margin: 0 0 2px;">• <strong>Service:</strong> ${booking.packageName}</p>
            <p style="margin: 0 0 2px;">• <strong>Preferred Date:</strong> ${booking.preferredDate || 'Flexible'}</p>
            <p style="margin: 0;">• <strong>Location:</strong> ${booking.serviceAddress || 'Aiken, SC'}</p>
          </div>
          <p style="margin: 24px 0 0; font-size: 13px; color: #64748b; font-style: italic; border-top: 1px solid #f1f5f9; padding-top: 14px;">
            "${profile.mottoQuote}"<br>
            <span style="font-weight: 600; color: #0f172a;">— Jamel Tyler, Owner & Lead Detailer</span>
          </p>
        </div>
      </div>
    `,
    bodyText: `Your JustMelDetail Verification Code is: ${code}\n\nEnter this code to finalize your appointment for ${booking.vehicleSummary} (${booking.packageName}).\nJamel Tyler: ${profile.phone}`,
  };

  const detailerEmail: EmailPayload = {
    to: detailerEmailAddress,
    from: `Automated Booking System <intake@justmeldetail.com>`,
    subject: `[NEW INTAKE VERIFYING] ${booking.clientName} - ${booking.vehicleSummary}`,
    previewText: `Client ${booking.clientName} is verifying an appointment in Aiken, SC for ${booking.packageName}. Verification code: ${code}.`,
    bodyHtml: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
        <div style="background: #0284c7; padding: 20px; text-align: left; color: #ffffff;">
          <h1 style="margin: 0; font-size: 18px; font-weight: 700;">JustMelDetail Mobile Dispatch Alert</h1>
          <p style="margin: 4px 0 0; font-size: 12px; color: #e0f2fe;">New Client Verification in Progress</p>
        </div>
        <div style="padding: 24px; color: #1e293b; font-size: 13px; line-height: 1.6;">
          <p style="margin-top: 0;">Jamel, a client just submitted their mobile booking and is entering verification code <strong>${code}</strong>.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 12px;">
            <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0; font-weight: 600; width: 120px;">Client:</td><td>${booking.clientName}</td></tr>
            <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0; font-weight: 600;">Phone:</td><td><a href="tel:${booking.clientPhone}">${booking.clientPhone}</a></td></tr>
            <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0; font-weight: 600;">Email:</td><td>${booking.clientEmail}</td></tr>
            <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0; font-weight: 600;">Vehicle & VIN:</td><td>${booking.vehicleSummary} | VIN: <code>${booking.vin || 'N/A'}</code></td></tr>
            <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0; font-weight: 600;">Package:</td><td><strong>${booking.packageName}</strong> ($${booking.packagePrice}+)</td></tr>
            <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0; font-weight: 600;">Address:</td><td>${booking.serviceAddress}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 600;">Date/Time:</td><td>${booking.preferredDate || 'Flexible'} (${booking.preferredTime})</td></tr>
          </table>
          <p style="margin-bottom: 0; font-size: 11px; color: #64748b;">Dispatched automatically to ${detailerEmailAddress}</p>
        </div>
      </div>
    `,
    bodyText: `New Client Verifying:\nClient: ${booking.clientName} (${booking.clientPhone})\nVehicle: ${booking.vehicleSummary} (VIN: ${booking.vin})\nPackage: ${booking.packageName}\nLocation: ${booking.serviceAddress}\nCode: ${code}`,
  };

  return { clientEmail, detailerEmail };
}

/**
 * Generates automated confirmation email sent during Step 3 (confirmation_email)
 */
export function generateConfirmationEmails(booking: BookingData, confirmationId: string): {
  clientEmail: EmailPayload;
  detailerEmail: EmailPayload;
} {
  const profile = JUST_MEL_DETAIL_PROFILE;
  const detailerEmailAddress = 'jamelisjustmeldetail@gmail.com';

  const clientEmail: EmailPayload = {
    to: booking.clientEmail || 'client@example.com',
    from: `${profile.businessName} <${profile.emails[0]}>`,
    subject: `✓ Confirmed: JustMelDetail Mobile Appointment (${confirmationId})`,
    previewText: `Your mobile appointment with Jamel Tyler is locked in! Confirmation ID: ${confirmationId}`,
    bodyHtml: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); padding: 28px 24px; text-align: center; color: #ffffff;">
          <div style="display: inline-block; background: #22c55e; color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 4px 12px; rounded-full; border-radius: 20px; margin-bottom: 12px;">
            ✓ Appointment Confirmed & Logged
          </div>
          <h1 style="margin: 0; font-size: 22px; font-weight: 800;">${profile.businessName}</h1>
          <p style="margin: 4px 0 0; font-size: 13px; color: #bfdbfe;">Mobile Detailing & Maintenance • Aiken, SC</p>
        </div>

        <!-- Body -->
        <div style="padding: 28px 24px; color: #1e293b;">
          <p style="font-size: 15px; margin: 0 0 16px; color: #0f172a;">
            Hi <strong>${booking.clientName}</strong>,
          </p>
          <p style="font-size: 13px; line-height: 1.6; margin: 0 0 20px; color: #475569;">
            Your mobile detailing service is confirmed. <strong>Jamel Tyler</strong> will arrive directly at your location in Aiken, SC with professional detailing equipment, eco-safe formulas, and high-pressure steam sanitization.
          </p>

          <!-- Confirmation Card -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 12px;">
              <span style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b;">Confirmation #</span>
              <span style="font-family: monospace; font-size: 13px; font-weight: 700; color: #0284c7;">${confirmationId}</span>
            </div>

            <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #64748b; width: 140px;">Vehicle:</td>
                <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${booking.vehicleSummary}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">VIN Status:</td>
                <td style="padding: 6px 0; font-family: monospace; font-weight: 600; color: #0369a1;">
                  ${
                    booking.vinOption === 'on_arrival'
                      ? 'Door Jamb Verification on Arrival (Effortless)'
                      : booking.vinOption === 'photo'
                      ? 'Photo of Door Jamb Attached'
                      : (booking.vin || 'Recorded on Arrival')
                  }
                </td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Selected Service:</td>
                <td style="padding: 6px 0; font-weight: 700; color: #0f172a;">${booking.packageName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Estimated Rate:</td>
                <td style="padding: 6px 0; font-weight: 700; color: #16a34a;">$${booking.packagePrice}+</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Scheduled Window:</td>
                <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">
                  ${booking.preferredDate || 'To be confirmed'} (${booking.preferredTime})
                </td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Payment Choice:</td>
                <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">
                  ${
                    booking.paymentPreference === 'card_deposit'
                      ? '$25 Deposit Hold • Balance Due on Completion'
                      : 'Pay on Completion ($0 Due Now) • Cash, Card, or Cash App'
                  }
                </td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Service Location:</td>
                <td style="padding: 6px 0; color: #0f172a;">${booking.serviceAddress}</td>
              </tr>
            </table>
          </div>

          <!-- Pre-Service Checklist -->
          <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 14px 16px; border-radius: 4px 8px 8px 4px; margin-bottom: 24px; font-size: 12px; color: #1e40af;">
            <p style="margin: 0 0 6px; font-weight: 700;">Simple Pre-Service Checklist:</p>
            <p style="margin: 0 0 4px;">1. Please ensure the vehicle or trailer has clear driveway/stall access.</p>
            <p style="margin: 0 0 4px;">2. Remove personal valuables and firearms from the glovebox and cabin.</p>
            <p style="margin: 0;">3. Jamel's mobile van carries self-contained water and generator power.</p>
          </div>

          <!-- Insurance & Resale Ledger Note -->
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 14px; margin-bottom: 20px; font-size: 12px; color: #166534;">
            <p style="margin: 0 0 4px; font-weight: 700;">🛡️ Insurance & Resale Documentation Included:</p>
            <p style="margin: 0;">Upon completion, Jamel will certify your vehicle's VIN Passport. Your paint depth, wax protection duration, and steam sanitization will be officially recorded for your insurance file and future resale valuation.</p>
          </div>

          <!-- Contact & Payment -->
          <p style="margin: 0 0 6px; font-size: 12px; color: #64748b;">
            Direct Contact: <strong>${profile.phone}</strong> | Cash App: <strong>${profile.cashApp}</strong>
          </p>
          <p style="margin: 16px 0 0; font-size: 12px; color: #94a3b8; font-style: italic;">
            "${profile.mottoQuote}" — Jamel Tyler
          </p>
        </div>
      </div>
    `,
    bodyText: `Your JustMelDetail Appointment is Confirmed!\nConfirmation: ${confirmationId}\nClient: ${booking.clientName}\nVehicle: ${booking.vehicleSummary} (VIN: ${booking.vin})\nService: ${booking.packageName} ($${booking.packagePrice}+)\nDate: ${booking.preferredDate} (${booking.preferredTime})\nAddress: ${booking.serviceAddress}\nDirect: ${profile.phone}`,
  };

  const detailerEmail: EmailPayload = {
    to: detailerEmailAddress,
    from: `Dispatch Notification <intake@justmeldetail.com>`,
    subject: `🚨 WORK ORDER CONFIRMED: ${booking.clientName} (${booking.preferredDate}) - $${booking.packagePrice}`,
    previewText: `New confirmed appointment booked in Aiken, SC for ${booking.vehicleSummary}. Confirmation #${confirmationId}`,
    bodyHtml: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 16px; overflow: hidden;">
        <div style="background: #166534; padding: 24px; text-align: left; color: #ffffff;">
          <h1 style="margin: 0; font-size: 20px; font-weight: 800;">JustMelDetail Work Order Dispatched</h1>
          <p style="margin: 4px 0 0; font-size: 12px; color: #bbf7d0;">Confirmation #${confirmationId} • Mobile Job Scheduled</p>
        </div>
        <div style="padding: 24px; font-size: 13px; color: #1e293b; line-height: 1.6;">
          <p style="margin-top: 0;">Jamel, you have a new verified booking confirmed in your system:</p>

          <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px;">
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; font-weight: 700; width: 140px; color: #64748b;">Client Name:</td><td style="font-weight: 600;">${booking.clientName}</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; font-weight: 700; color: #64748b;">Phone:</td><td><a href="tel:${booking.clientPhone}" style="color: #0284c7; font-weight: 700;">${booking.clientPhone}</a></td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; font-weight: 700; color: #64748b;">Email:</td><td>${booking.clientEmail}</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; font-weight: 700; color: #64748b;">Vehicle:</td><td>${booking.vehicleSummary}</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; font-weight: 700; color: #64748b;">VIN Documented:</td><td style="font-family: monospace; font-weight: 700;">${booking.vin || 'Log upon arrival'}</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; font-weight: 700; color: #64748b;">Service Package:</td><td style="font-weight: 700; color: #0f172a;">${booking.packageName}</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; font-weight: 700; color: #64748b;">Job Estimate:</td><td style="font-weight: 700; color: #16a34a;">$${booking.packagePrice}+</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; font-weight: 700; color: #64748b;">Date & Time:</td><td style="font-weight: 700;">${booking.preferredDate || 'Flexible'} (${booking.preferredTime})</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; font-weight: 700; color: #64748b;">Mobile Location:</td><td style="font-weight: 600;">${booking.serviceAddress}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 700; color: #64748b;">Special Notes:</td><td>${booking.specialInstructions || 'None noted'}</td></tr>
          </table>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-top: 16px;">
            <p style="margin: 0; font-size: 11px; color: #64748b;">
              Action Items: Client calendar invite has been generated. Ready to sync with your mobile schedule.
            </p>
          </div>
        </div>
      </div>
    `,
    bodyText: `WORK ORDER CONFIRMED:\nID: ${confirmationId}\nClient: ${booking.clientName} (${booking.clientPhone})\nVehicle: ${booking.vehicleSummary} (VIN: ${booking.vin})\nPackage: ${booking.packageName} ($${booking.packagePrice})\nDate/Time: ${booking.preferredDate} (${booking.preferredTime})\nAddress: ${booking.serviceAddress}`,
  };

  return { clientEmail, detailerEmail };
}
