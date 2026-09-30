import { PaginatedResponse } from "@/features/admin-core/interfaces";

export type RevalidateTarget = "home" | "staff" | "bans" | "testers";

export type RevalidateResult = {
    target: RevalidateTarget;
    ok: boolean;
};

export type RevalidateResponse = {
    results: RevalidateResult[];
};

export type CacheGroup = "profiles" | "modes";

export type CacheGroupStats = {
    group: CacheGroup;
    total: number;
    expired: number;
};

export type CacheStatsResponse = {
    groups: CacheGroupStats[];
};

export type CachePurgeBody = { group: CacheGroup } | { expired: true };

export type CachePurgeResponse = {
    message: string;
    removed?: number;
};

export type AuditAction =
    | "update"
    | "hide"
    | "restore"
    | "revalidate"
    | "cache_purge"
    | "password_change"
    | "status_change";

export type AuditEntity = "staff" | "ban" | "user" | "application";

export type AuditEntry = {
    id: number;
    admin_username: string;
    action: AuditAction;
    entity: AuditEntity | null;
    entity_key: string | null;
    before: Record<string, unknown> | null;
    after: Record<string, unknown> | null;
    created_at: string;
};

export type AuditFilter = "all" | AuditEntity | "system";

export type AuditResponse = PaginatedResponse<AuditEntry>;

export type PasswordChangeBody = {
    current: string;
    next: string;
};
