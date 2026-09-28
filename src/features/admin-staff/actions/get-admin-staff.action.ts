import { navyApi } from "@/shared/api";
import { AdminStaffResponse } from "../interfaces";

const getAdminStaffAction = async (): Promise<AdminStaffResponse> => {
    const { data } = await navyApi.get<AdminStaffResponse>("/admin/staff");
    return data;
};

export { getAdminStaffAction };
