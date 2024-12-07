export function lastWeekDay(): string {
  let date = new Date();
  date.setDate(new Date().getDate() - 7);
  return formatDate(date);
}

function formatDate(date: Date): string {
  var date = new Date(date),
    month = '' + (date.getMonth() + 1),
    day = '' + date.getDate(),
    year = date.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

export function convertStringToDate(date: string): Date {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day);
}
