import { navyApi } from "@/shared/api";
import { AdminBansResponse, BanStatusFilter } from "../interfaces";

type Params = {
    page: number;
    status: BanStatusFilter;
    search: string;
};

const getAdminBansAction = async ({ page, status, search }: Params): Promise<AdminBansResponse> => {
    const { data } = await navyApi.get<AdminBansResponse>("/admin/bans", {
        params: { page, status, search: search || undefined },
    });
    return data;
};

export { getAdminBansAction };
