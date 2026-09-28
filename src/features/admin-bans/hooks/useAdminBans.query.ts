import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAdminBansAction } from "../actions";
import { BanStatusFilter } from "../interfaces";

export const ADMIN_BANS_KEY = ["admin-bans"] as const;

const useAdminBansQuery = (page: number, status: BanStatusFilter, search: string) =>
    useQuery({
        queryKey: [...ADMIN_BANS_KEY, status, search, page],
        queryFn: () => getAdminBansAction({ page, status, search }),
        placeholderData: keepPreviousData,
        staleTime: 30 * 1000,
        refetchOnWindowFocus: false,
        retry: false,
    });

export { useAdminBansQuery };
