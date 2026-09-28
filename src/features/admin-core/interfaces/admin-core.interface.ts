export type AdminRole = "admin" | "founder";

export type SessionResponse = {
    authenticated: boolean;
    username?: string;
    role?: AdminRole;
};

export type LoginBody = {
    username: string;
    password: string;
};

export type LoginResponse = {
    username: string;
};

export type MutationResponse = {
    message: string;
};

/** Soft delete de una entidad (vive en `admin_overrides`). */
export type HiddenState = {
    hidden: boolean;
    hidden_reason: string | null;
    hidden_at: string | null;
};

/** Último admin que tocó el override. */
export type OverrideMeta = {
    updated_by: string | null;
    updated_at: string | null;
};

export type PaginatedResponse<T> = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    data: T[];
};

/** Body común de ocultar/restaurar. */
export type VisibilityBody = {
    hidden: boolean;
    hidden_reason?: string | null;
};
