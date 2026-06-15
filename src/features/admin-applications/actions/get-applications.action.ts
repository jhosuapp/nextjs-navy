import { navyApi } from "@/shared/api";
import { ApplicationsPage } from "../interfaces";

const getApplicationsAction = async (
    page: number
): Promise<ApplicationsPage> => {
    const { data } = await navyApi.get<ApplicationsPage>(
        `/admin/applications?page=${page}`
    );
    return data;
};

export { getApplicationsAction };
