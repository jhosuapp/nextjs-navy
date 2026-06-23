export type ApplicationStatus = "pendiente" | "aceptado" | "rechazado";

export type Application = {
    id: number;
    nombre: string;
    discord: string;
    tipo: string;
    edad: number;
    labor_helper: string;
    funciones_helper: string;
    claro_spam: boolean;
    detalle_spam: string | null;
    claro_flood: boolean;
    detalle_flood: string | null;
    conoce_hacks_ss: boolean;
    detalle_hacks_ss: string | null;
    opinion_tierlist: string;
    usuarios_peleando: string;
    testers_peleando: string;
    ticket_tester: string;
    ticket_reporte: string;
    hacks_pvp: string;
    tiempo_disciplina: boolean;
    meta_principal: string;
    capacidad_resolucion: boolean;
    se_enoja_facil: boolean;
    ip_hash: string | null;
    status: ApplicationStatus;
    created_at: string;
};

export type UpdateStatusBody = {
    status: ApplicationStatus;
};

export type UpdateStatusResponse = {
    message: string;
};

export type ApplicationsPage = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    data: Application[];
};

export type SessionResponse = {
    authenticated: boolean;
    username?: string;
};

export type LoginBody = {
    username: string;
    password: string;
};

export type LoginResponse = {
    username: string;
};
