import { BookingData } from '../types';
import { JUST_MEL_DETAIL_PROFILE } from '../data/defects';

/**
 * Formats a Date object or ISO string into an iCalendar UTC timestamp: YYYYMMDDTHHMMSSZ
 */
function formatICSDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

/**
 * Creates RFC 5545 compatible iCalendar (.ics) string for the detailing appointment
 */
export function generateICSContent(booking: BookingData): string {
  const profile = JUST_MEL_DETAIL_PROFILE;

  // Parse appointment date or default to tomorrow 10:00 AM
  let startDate = new Date(booking.preferredDate || Date.now() + 86400000);
  if (isNaN(startDate.getTime())) {
    startDate = new Date(Date.now() + 86400000);
  }
  startDate.setHours(10, 0, 0, 0);

  // End date default 3 hours later
  const endDate = new Date(startDate.getTime() + 3 * 3600000);

  const startStr = formatICSDate(startDate);
  const endStr = formatICSDate(endDate);
  const stampStr = formatICSDate(new Date());
  const uid = `jmd-${Date.now()}-${Math.floor(Math.random() * 10000)}@justmeldetail.com`;

  const summary = `JustMelDetail Mobile Detailing: ${booking.packageName}`;
  const location = booking.serviceAddress || 'Aiken, SC and surrounding areas';

  const description = [
    `JUSTMELDETAIL MOBILE DETAILING APPOINTMENT`,
    `Owner & Lead Detailer: Jamel Tyler (${profile.phone})`,
    `Client Name: ${booking.clientName}`,
    `Vehicle VIN: ${booking.vin || 'On file'}`,
    `Vehicle: ${booking.vehicleSummary}`,
    `Service Package: ${booking.packageName} (Starts at $${booking.packagePrice})`,
    `Mobile Location: ${location}`,
    `Pre-Service Checklist:`,
    `- Ensure vehicle is parked in an accessible driveway, barn aisle, or parking space`,
    `- Detailer van brings self-contained water & mobile power if needed`,
    `- Unlocking keys provided to Jamel upon arrival`,
    `- Questions or rescheduling: Call/Text ${profile.phone}`,
  ].join('\\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//JustMelDetail//Mobile Detailing Aiken SC//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stampStr}`,
    `DTSTART:${startStr}`,
    `DTEND:${endStr}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    `ORGANIZER;CN="${profile.fullTitle}":mailto:${profile.emails[0]}`,
    `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN="${booking.clientName}":mailto:${booking.clientEmail}`,
    `STATUS:CONFIRMED`,
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: JustMelDetail Mobile Detailing appointment in 2 hours',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * Triggers a client-side download of the .ics calendar file
 */
export function downloadICSFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename.endsWith('.ics') ? filename : `${filename}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Generates an instant Google Calendar event template link
 */
export function generateGoogleCalendarUrl(booking: BookingData): string {
  const profile = JUST_MEL_DETAIL_PROFILE;

  let startDate = new Date(booking.preferredDate || Date.now() + 86400000);
  if (isNaN(startDate.getTime())) {
    startDate = new Date(Date.now() + 86400000);
  }
  startDate.setHours(10, 0, 0, 0);
  const endDate = new Date(startDate.getTime() + 3 * 3600000);

  const startStr = formatICSDate(startDate);
  const endStr = formatICSDate(endDate);

  const title = encodeURIComponent(`JustMelDetail Detailing: ${booking.packageName} (${booking.clientName})`);
  const location = encodeURIComponent(booking.serviceAddress || 'Aiken, SC');
  const details = encodeURIComponent(
    `Mobile Detailing with Jamel Tyler (JustMelDetail)\n` +
    `Phone: ${profile.phone}\n` +
    `Vehicle: ${booking.vehicleSummary}\n` +
    `VIN: ${booking.vin || 'N/A'}\n` +
    `Package: ${booking.packageName} ($${booking.packagePrice})\n` +
    `Address: ${booking.serviceAddress}\n\n` +
    `"Spend a little on prevention today, or spend a lot more on correction later."`
  );

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${location}`;
}
