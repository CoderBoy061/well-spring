export function formatDuration(minutes: number) {
  if (!minutes) {
    return "0 min";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (!hours) {
    return `${remainingMinutes} min`;
  }

  if (!remainingMinutes) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
}

export function formatDate(value: string | Date) {
  const date = new Date(value);

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
