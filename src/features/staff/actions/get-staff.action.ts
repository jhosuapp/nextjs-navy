import { navyApi } from "@/shared/api";
import { GroupedStaffResponse } from "../interfaces";

const getStaffAction = async ():Promise<GroupedStaffResponse> => {
    const { data } = await navyApi.get<GroupedStaffResponse>('/staff');

    return data;
}

export { getStaffAction }