import { navyApi } from "@/shared/api";
import { OnlineStaffResponse } from "../interfaces";

const getOnlineStaffAction = async (): Promise<OnlineStaffResponse> => {
    const { data } = await navyApi.get<OnlineStaffResponse>('/staff/online');
    return data;
};

export { getOnlineStaffAction };
