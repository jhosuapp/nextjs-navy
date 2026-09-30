import type { Prisma } from "@prisma/client";
import { prisma } from "@/config/lib/prisma";
import { createAdminHandler, queryString } from "@/config/lib/adminHandler";
import { pageSchema } from "@/config/lib/adminValidation";
import { ADMIN_PAGE_SIZE } from "@/shared/constants/admin";
import type {
    AuditAction,
    AuditEntity,
    AuditEntry,
    AuditFilter,
    AuditResponse,
} from "@/features/admin-settings/interfaces";

const FILTERS: AuditFilter[] = ["all", "application", "staff", "ban", "user", "tester", "system"];

const parseFilter = (value: string): AuditFilter =>
    FILTERS.includes(value as AuditFilter) ? (value as AuditFilter) : "all";

const whereFor = (filter: AuditFilter): Prisma.admin_audit_logWhereInput => {
    if (filter === "all") return {};
    if (filter === "system") return { entity: null };
    if (filter === "staff") return { entity: { in: ["staff", "staff_profile"] } };
    return { entity: filter };
};

const parseJson = (value: string | null): Record<string, unknown> | null => {
    if (!value) return null;
    try {
        const parsed: unknown = JSON.parse(value);
        return typeof parsed === "object" && parsed !== null
            ? (parsed as Record<string, unknown>)
            : { value: parsed };
    } catch {
        return null;
    }
};

// Solo fundadores: el historial muestra valores anteriores y quién hizo cada cambio.
export default createAdminHandler("settings/audit", {
    GET: async (req, res) => {
        const page = pageSchema.parse(queryString(req.query.page));
        const where = whereFor(parseFilter(queryString(req.query.entity)));

        const [total, rows] = await prisma.$transaction([
            prisma.admin_audit_log.count({ where }),
            prisma.admin_audit_log.findMany({
                where,
                orderBy: { created_at: "desc" },
                skip: (page - 1) * ADMIN_PAGE_SIZE,
                take: ADMIN_PAGE_SIZE,
            }),
        ]);

        const data: AuditEntry[] = rows.map((row) => ({
            id: row.id,
            admin_username: row.admin_username,
            action: row.action as AuditAction,
            entity: row.entity as AuditEntity | null,
            entity_key: row.entity_key,
            before: parseJson(row.before_data),
            after: parseJson(row.after_data),
            created_at: row.created_at.toISOString(),
        }));

        const body: AuditResponse = {
            page,
            limit: ADMIN_PAGE_SIZE,
            total,
            totalPages: Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE)),
            data,
        };
        res.status(200).json(body);
    },
}, { roles: ["founder"] });
