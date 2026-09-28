import { navyApi } from "@/shared/api";
import { MutationResponse } from "@/features/admin-core/interfaces";
import { UserPatchBody } from "../interfaces";

const patchUserAction = async (key: string, body: UserPatchBody): Promise<MutationResponse> => {
    const { data } = await navyApi.patch<MutationResponse>(`/admin/users/${encodeURIComponent(key)}`, body);
    return data;
};

export { patchUserAction };
