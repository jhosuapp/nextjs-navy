import { HiddenState, OverrideMeta } from "@/features/admin-core/interfaces";

export type StaffEditableFields = {
    nick: string | null;
    role_name: string;
    role_colour: string;
    role_weight: number;
};

export type AdminStaffMember = HiddenState &
    OverrideMeta & {
        discord_id: string;
        uuid: string | null;
        is_premium: boolean | null;
        role_id: string;
        /** Valores efectivos (bot + overrides). */
        current: StaffEditableFields;
        /** Valores que escribió el bot. */
        original: StaffEditableFields;
        /** Solo los campos con override activo. */
        overrides: Partial<StaffEditableFields>;
    };

export type AdminStaffResponse = {
    data: AdminStaffMember[];
};

export type StaffPatchBody = {
    [K in keyof StaffEditableFields]?: StaffEditableFields[K] | null;
} & {
    hidden?: boolean;
    hidden_reason?: string | null;
};

export type StaffVisibilityFilter = "visible" | "hidden";
