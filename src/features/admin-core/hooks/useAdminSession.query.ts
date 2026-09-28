import { useQuery } from "@tanstack/react-query";
import { getSessionAction } from "../actions";

export const ADMIN_SESSION_KEY = ["admin-session"] as const;

const useAdminSessionQuery = () =>
    useQuery({
        queryKey: ADMIN_SESSION_KEY,
        queryFn: getSessionAction,
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        retry: false,
    });

export { useAdminSessionQuery };
