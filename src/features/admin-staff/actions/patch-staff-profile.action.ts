import { navyApi } from "@/shared/api";
import { MutationResponse } from "@/features/admin-core/interfaces";
import { StaffProfilePatchBody } from "../interfaces";

const patchStaffProfileAction = async (discordId: string, body: StaffProfilePatchBody): Promise<MutationResponse> => {
    const { data } = await navyApi.patch<MutationResponse>(`/admin/staff/${encodeURIComponent(discordId)}/profile`, body);
    return data;
};

export { patchStaffProfileAction };
