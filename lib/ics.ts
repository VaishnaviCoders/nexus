function pad(n: number) {
  return n.toString().padStart(2, '0');
}

function toICSDate(d: Date) {
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    'T' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    'Z'
  );
}

export function buildICS(args: {
  title: string;
  description: string;
  start: Date;
  end: Date;
  location?: string;
}) {
  const uid = `${Date.now()}@exam`;
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//v0 Exam//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${toICSDate(new Date())}`,
    `DTSTART:${toICSDate(args.start)}`,
    `DTEND:${toICSDate(args.end)}`,
    `SUMMARY:${escapeICS(args.title)}`,
    `DESCRIPTION:${escapeICS(args.description)}`,
    args.location ? `LOCATION:${escapeICS(args.location)}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n');

  return lines;
}

function escapeICS(s: string) {
  return s.replace(/([,;])/g, '\\$1').replace(/\n/g, '\\n');
}

export function downloadICS(content: string, fileName: string) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  URL.revokeObjectURL(link.href);
  document.body.removeChild(link);
}
