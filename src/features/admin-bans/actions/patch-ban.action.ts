import { navyApi } from "@/shared/api";
import { MutationResponse } from "@/features/admin-core/interfaces";
import { BanPatchBody } from "../interfaces";

const patchBanAction = async (id: number, body: BanPatchBody): Promise<MutationResponse> => {
    const { data } = await navyApi.patch<MutationResponse>(`/admin/bans/${id}`, body);
    return data;
};

export { patchBanAction };
