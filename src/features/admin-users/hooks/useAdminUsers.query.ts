import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAdminUsersAction } from "../actions";
import { UserStatusFilter } from "../interfaces";

export const ADMIN_USERS_KEY = ["admin-users"] as const;

const useAdminUsersQuery = (page: number, status: UserStatusFilter, search: string) =>
    useQuery({
        queryKey: [...ADMIN_USERS_KEY, status, search, page],
        queryFn: () => getAdminUsersAction({ page, status, search }),
        placeholderData: keepPreviousData,
        staleTime: 30 * 1000,
        refetchOnWindowFocus: false,
        retry: false,
    });

export { useAdminUsersQuery };
