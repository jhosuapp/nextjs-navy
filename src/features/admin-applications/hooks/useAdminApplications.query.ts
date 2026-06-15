import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
    getApplicationsAction,
    getSessionAction,
} from "../actions";

const useSessionQuery = () =>
    useQuery({
        queryKey: ["admin-session"],
        queryFn: getSessionAction,
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        retry: false,
    });

const useApplicationsQuery = (page: number, enabled: boolean) =>
    useQuery({
        queryKey: ["admin-applications", page],
        queryFn: () => getApplicationsAction(page),
        enabled,
        placeholderData: keepPreviousData,
        staleTime: 0,
        refetchOnWindowFocus: false,
        retry: false,
    });

export { useSessionQuery, useApplicationsQuery };
