import { useQuery } from "@tanstack/react-query";
import { getAdminTestersAction } from "../actions";

export const ADMIN_TESTERS_KEY = ["admin-testers"] as const;

const useAdminTestersQuery = () =>
    useQuery({
        queryKey: ADMIN_TESTERS_KEY,
        queryFn: getAdminTestersAction,
        staleTime: 30 * 1000,
        refetchOnWindowFocus: false,
        retry: false,
    });

export { useAdminTestersQuery };
