/** Fecha corta localizada (p. ej. "28 sept 2026, 14:05"). */
export const formatDateTime = (iso: string | null | undefined, locale = "es"): string => {
    if (!iso) return "—";
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "—";
    return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(date);
};

/** `YYYY-MM-DDTHH:mm` en hora local, para `<input type="datetime-local">`. */
export const toDateTimeLocal = (iso: string | null | undefined): string => {
    if (!iso) return "";
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

/** Inverso de `toDateTimeLocal`: valor del input → ISO UTC. */
export const fromDateTimeLocal = (value: string): string | null => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
};
