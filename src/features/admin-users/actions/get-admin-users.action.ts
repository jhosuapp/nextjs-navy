import { navyApi } from "@/shared/api";
import { AdminUsersResponse, UserStatusFilter } from "../interfaces";

type Params = {
    page: number;
    status: UserStatusFilter;
    search: string;
};

const getAdminUsersAction = async ({ page, status, search }: Params): Promise<AdminUsersResponse> => {
    const { data } = await navyApi.get<AdminUsersResponse>("/admin/users", {
        params: { page, status, search: search || undefined },
    });
    return data;
};

export { getAdminUsersAction };
