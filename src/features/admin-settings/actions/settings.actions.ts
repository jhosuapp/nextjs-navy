import { navyApi } from "@/shared/api";
import { MutationResponse } from "@/features/admin-core/interfaces";
import {
    AuditFilter,
    AuditResponse,
    CachePurgeBody,
    CachePurgeResponse,
    CacheStatsResponse,
    PasswordChangeBody,
    RevalidateResponse,
    RevalidateTarget,
} from "../interfaces";

const postRevalidateAction = async (targets: RevalidateTarget[]): Promise<RevalidateResponse> => {
    // 207 = revalidación parcial: también es una respuesta válida con resultados.
    const { data } = await navyApi.post<RevalidateResponse>("/admin/settings/revalidate", { targets });
    return data;
};

const getCacheStatsAction = async (): Promise<CacheStatsResponse> => {
    const { data } = await navyApi.get<CacheStatsResponse>("/admin/settings/cache");
    return data;
};

const deleteCacheAction = async (body: CachePurgeBody): Promise<CachePurgeResponse> => {
    const { data } = await navyApi.delete<CachePurgeResponse>("/admin/settings/cache", { data: body });
    return data;
};

const getAuditAction = async (page: number, entity: AuditFilter): Promise<AuditResponse> => {
    const { data } = await navyApi.get<AuditResponse>("/admin/settings/audit", { params: { page, entity } });
    return data;
};

const postPasswordAction = async (body: PasswordChangeBody): Promise<MutationResponse> => {
    const { data } = await navyApi.post<MutationResponse>("/admin/settings/password", body);
    return data;
};

export { postRevalidateAction, getCacheStatsAction, deleteCacheAction, getAuditAction, postPasswordAction };
