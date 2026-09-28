import {
    HiddenState,
    OverrideMeta,
    PaginatedResponse,
} from "@/features/admin-core/interfaces";

export type ExpirationMode = "permanent" | "date";

export type BanEditableFields = {
    nick: string | null;
    reason: string;
    is_cheater: boolean;
    /** `null` = permanente. ISO string en otro caso. */
    expiration: string | null;
};

export type BanOverrides = {
    nick?: string;
    reason?: string;
    is_cheater?: boolean;
    expiration_mode?: ExpirationMode;
    expiration?: string | null;
};

export type AdminBan = HiddenState &
    OverrideMeta & {
        id: number;
        uuid: string | null;
        is_premium: boolean;
        punisher_id: string;
        applied: string;
        active: boolean;
        current: BanEditableFields;
        original: BanEditableFields;
        overrides: BanOverrides;
    };

export type BanStatusFilter = "active" | "inactive" | "hidden";

export type AdminBansResponse = PaginatedResponse<AdminBan> & {
    counts: Record<BanStatusFilter, number>;
};

export type BanPatchBody = {
    nick?: string | null;
    reason?: string | null;
    is_cheater?: boolean | null;
    expiration_mode?: ExpirationMode | null;
    expiration?: string | null;
    hidden?: boolean;
    hidden_reason?: string | null;
};
