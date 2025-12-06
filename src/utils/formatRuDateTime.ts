/**
 * Formats a Date object into a string in the format DD.MM.YYYY HH:MM:SS (e.g., 01.07.2025 14:32:00).
 * @param {Date} date - The Date object to format.
 * @param {boolean} [includeTime=true] - Whether to include the time in the formatted string.
 * @returns {string} The formatted string.
 */
export default function (date: Date, includeTime: boolean = true): string {
  const pad = (num: number): string => num.toString().padStart(2, '0');

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return includeTime
    ? `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`
    : `${day}.${month}.${year}`;
}
