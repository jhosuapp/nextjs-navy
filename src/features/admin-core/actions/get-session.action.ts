import { navyApi } from "@/shared/api";
import { SessionResponse } from "../interfaces";

const getSessionAction = async (): Promise<SessionResponse> => {
    const { data } = await navyApi.get<SessionResponse>("/admin/session");
    return data;
};

export { getSessionAction };
