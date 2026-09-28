import {
    HiddenState,
    OverrideMeta,
    PaginatedResponse,
} from "@/features/admin-core/interfaces";

export type AdminUserGame = {
    game: string;
    tier: string;
};

export type AdminUser = HiddenState &
    OverrideMeta & {
        /** `COALESCE(uuid, CONCAT('nick_', nick))` — identidad en la tierlist. */
        key: string;
        uuid: string | null;
        is_premium: boolean;
        region: string;
        nick: string;
        original_nick: string;
        nick_override: string | null;
        points: number;
        games: AdminUserGame[];
        last_test: string;
    };

export type UserStatusFilter = "visible" | "hidden";

export type AdminUsersResponse = PaginatedResponse<AdminUser> & {
    counts: Record<UserStatusFilter, number>;
};

export type UserPatchBody = {
    nick?: string | null;
    hidden?: boolean;
    hidden_reason?: string | null;
};
