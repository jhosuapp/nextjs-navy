import { prisma } from "@/config/lib/prisma";
import { createAdminHandler, queryString } from "@/config/lib/adminHandler";
import { getOverridesMap } from "@/config/lib/adminOverrides";
import { matchesSearch, paginate, serializeBan } from "@/config/lib/adminSerializers";
import { pageSchema, searchSchema } from "@/config/lib/adminValidation";
import { ADMIN_PAGE_SIZE } from "@/shared/constants/admin";
import type {
    AdminBan,
    AdminBansResponse,
    BanStatusFilter,
} from "@/features/admin-bans/interfaces";

const parseStatus = (value: string): BanStatusFilter =>
    value === "inactive" || value === "hidden" ? value : "active";

const statusOf = (ban: AdminBan): BanStatusFilter => {
    if (ban.hidden) return "hidden";
    return ban.active ? "active" : "inactive";
};

// Los overrides pueden cambiar nick y expiración, así que se filtra y pagina
// en memoria tras aplicarlos (volumen bajo: la web pública ya los carga todos).
export default createAdminHandler("bans", {
    GET: async (req, res) => {
        const page = pageSchema.parse(queryString(req.query.page));
        const search = searchSchema.parse(queryString(req.query.search));
        const status = parseStatus(queryString(req.query.status));

        const [rows, overrides] = await Promise.all([
            prisma.punishments.findMany({ orderBy: { applied: "desc" } }),
            getOverridesMap("ban"),
        ]);

        const now = new Date();
        const bans = rows.map((row) => serializeBan(row, overrides.get(String(row.id)), now));

        const counts: Record<BanStatusFilter, number> = { active: 0, inactive: 0, hidden: 0 };
        const filtered: AdminBan[] = [];

        for (const ban of bans) {
            const banStatus = statusOf(ban);
            counts[banStatus] += 1;
            if (
                banStatus === status &&
                matchesSearch(search, ban.current.nick, ban.original.nick, ban.uuid, ban.current.reason)
            ) {
                filtered.push(ban);
            }
        }

        const body: AdminBansResponse = { ...paginate(filtered, page, ADMIN_PAGE_SIZE), counts };
        res.status(200).json(body);
    },
});
