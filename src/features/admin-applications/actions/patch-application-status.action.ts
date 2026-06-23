import { navyApi } from "@/shared/api";
import {
    UpdateStatusBody,
    UpdateStatusResponse,
} from "../interfaces";

const patchApplicationStatusAction = async (
    id: number,
    body: UpdateStatusBody
): Promise<UpdateStatusResponse> => {
    const { data } = await navyApi.patch<UpdateStatusResponse>(
        `/admin/applications/${id}`,
        body
    );
    return data;
};

export { patchApplicationStatusAction };
