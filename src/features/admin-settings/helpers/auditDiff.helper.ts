import { AuditEntry } from "../interfaces";

export type AuditChange = {
    field: string;
    before: string;
    after: string;
};

const IGNORED_FIELDS = new Set(["updated_at", "updated_by"]);

const format = (value: unknown): string => {
    if (value === null || value === undefined || value === "") return "—";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
};

/** Campos que cambiaron entre `before` y `after` de una entrada de auditoría. */
export const getAuditChanges = (entry: AuditEntry): AuditChange[] => {
    const before = entry.before ?? {};
    const after = entry.after ?? {};
    const fields = new Set([...Object.keys(before), ...Object.keys(after)]);

    return [...fields]
        .filter((field) => !IGNORED_FIELDS.has(field))
        .filter((field) => format(before[field]) !== format(after[field]))
        .map((field) => ({ field, before: format(before[field]), after: format(after[field]) }));
};
