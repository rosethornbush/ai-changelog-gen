export function getDaysAgo(count: number, startDate?: Date) {
  const date = (startDate && startDate instanceof Date) ? new Date(startDate) : new Date();
  date.setDate(date.getDate() - count);
  return date;
}
