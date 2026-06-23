import { navyApi } from "@/shared/api";
import { ApplicationKindFilter, ApplicationsPage } from "../interfaces";

const getApplicationsAction = async (
    page: number,
    kind: ApplicationKindFilter = "all"
): Promise<ApplicationsPage> => {
    const { data } = await navyApi.get<ApplicationsPage>(
        `/admin/applications?page=${page}&kind=${kind}`
    );
    return data;
};

export { getApplicationsAction };
