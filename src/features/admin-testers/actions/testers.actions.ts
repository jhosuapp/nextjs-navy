import { navyApi } from "@/shared/api";
import { MutationResponse } from "@/features/admin-core/interfaces";
import { AdminTestersResponse, TesterPatchBody } from "../interfaces";

const getAdminTestersAction = async (): Promise<AdminTestersResponse> => {
    const { data } = await navyApi.get<AdminTestersResponse>("/admin/testers");
    return data;
};

const patchTesterAction = async (discordId: string, body: TesterPatchBody): Promise<MutationResponse> => {
    const { data } = await navyApi.patch<MutationResponse>(`/admin/testers/${encodeURIComponent(discordId)}`, body);
    return data;
};

export { getAdminTestersAction, patchTesterAction };
