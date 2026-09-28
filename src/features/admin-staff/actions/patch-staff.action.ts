import { navyApi } from "@/shared/api";
import { MutationResponse } from "@/features/admin-core/interfaces";
import { StaffPatchBody } from "../interfaces";

const patchStaffAction = async (discordId: string, body: StaffPatchBody): Promise<MutationResponse> => {
    const { data } = await navyApi.patch<MutationResponse>(`/admin/staff/${encodeURIComponent(discordId)}`, body);
    return data;
};

export { patchStaffAction };
