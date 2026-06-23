export type ApplicationStatus = "pendiente" | "aceptado" | "rechazado";

export type ApplicationKind = "helper" | "tester";

export type ApplicationKindFilter = "all" | ApplicationKind;

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

export type HelperApplication = Application & { kind: "helper" };

export type TesterApplication = {
    kind: "tester";
    id: number;
    nombre: string;
    discord: string;
    tipo: string;
    edad: number;
    region: string;
    modos: string;
    tier_modo: string;
    experiencia_tester: boolean;
    detalle_experiencia: string | null;
    baneado: boolean;
    detalle_baneado: string | null;
    uso_cheats: boolean;
    opinion_navy: string;
    por_que_tester: string;
    tiempo_testeos: string;
    servidores: string;
    clanes_pvp: boolean;
    detalle_clanes: string | null;
    toxico: boolean;
    sospecha_hacks: string;
    ip_hash: string | null;
    status: ApplicationStatus;
    created_at: string;
};

export type AdminApplication = HelperApplication | TesterApplication;

export type UpdateStatusBody = {
    status: ApplicationStatus;
    kind: ApplicationKind;
};

export type UpdateStatusResponse = {
    message: string;
};

export type ApplicationsPage = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    data: AdminApplication[];
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
