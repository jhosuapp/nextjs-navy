import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getApplicationsAction } from "../actions";
import { ApplicationKindFilter } from "../interfaces";

const useApplicationsQuery = (page: number, kind: ApplicationKindFilter) =>
    useQuery({
        queryKey: ["admin-applications", kind, page],
        queryFn: () => getApplicationsAction(page, kind),
        placeholderData: keepPreviousData,
        staleTime: 0,
        refetchOnWindowFocus: false,
        retry: false,
    });

export { useApplicationsQuery };
