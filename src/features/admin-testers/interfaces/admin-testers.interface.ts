import { HiddenState, OverrideMeta } from "@/features/admin-core/interfaces";

export type AdminTester = HiddenState &
    OverrideMeta & {
        discord_id: string;
        uuid: string | null;
        /** Nick efectivo (override > staff > perfil); `null` = retirado sin nick. */
        nick: string | null;
        /** Nick que resuelve la web sin override. */
        base_nick: string | null;
        nick_override: string | null;
        role_name: string | null;
        role_colour: string | null;
        total_tests: number;
        recent_tests: number;
        month_tests: number;
    };

export type AdminTestersResponse = {
    data: AdminTester[];
};

export type TesterPatchBody = {
    nick?: string | null;
    hidden?: boolean;
    hidden_reason?: string | null;
};

export type TesterFilter = "visible" | "unnamed" | "hidden";
