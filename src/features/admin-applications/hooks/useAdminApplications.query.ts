import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
    getApplicationsAction,
    getSessionAction,
} from "../actions";
import { ApplicationKindFilter } from "../interfaces";

const useSessionQuery = () =>
    useQuery({
        queryKey: ["admin-session"],
        queryFn: getSessionAction,
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        retry: false,
    });

const useApplicationsQuery = (
    page: number,
    kind: ApplicationKindFilter,
    enabled: boolean
) =>
    useQuery({
        queryKey: ["admin-applications", kind, page],
        queryFn: () => getApplicationsAction(page, kind),
        enabled,
        placeholderData: keepPreviousData,
        staleTime: 0,
        refetchOnWindowFocus: false,
        retry: false,
    });

export { useSessionQuery, useApplicationsQuery };
