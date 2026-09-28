import { useQuery } from "@tanstack/react-query";
import { getAdminStaffAction } from "../actions";

export const ADMIN_STAFF_KEY = ["admin-staff"] as const;

const useAdminStaffQuery = () =>
    useQuery({
        queryKey: ADMIN_STAFF_KEY,
        queryFn: getAdminStaffAction,
        staleTime: 30 * 1000,
        refetchOnWindowFocus: false,
        retry: false,
    });

export { useAdminStaffQuery };
