export const formatDate = (date: string | Date): string => {
    const d = typeof date === "string" ? new Date(date) : date;
  
    if (isNaN(d.getTime())) return "";
  
    const formatted = new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(d);
  
    return formatted.replace(".", "").replace(",", ",");
}

export const getDaysBetweenDates = (
  startDate: string | Date,
  endDate: string | Date
): number => {
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;

  const diffMs = end.getTime() - start.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  // Redondeamos hacia arriba para contar días parciales como día completo
  return Math.ceil(diffDays);
}