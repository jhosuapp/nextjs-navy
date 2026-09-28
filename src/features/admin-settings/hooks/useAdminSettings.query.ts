import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAuditAction, getCacheStatsAction } from "../actions";
import { AuditFilter } from "../interfaces";

export const ADMIN_CACHE_KEY = ["admin-cache-stats"] as const;
export const ADMIN_AUDIT_KEY = ["admin-audit"] as const;

const useCacheStatsQuery = () =>
    useQuery({
        queryKey: ADMIN_CACHE_KEY,
        queryFn: getCacheStatsAction,
        staleTime: 0,
        refetchOnWindowFocus: false,
        retry: false,
    });

const useAuditQuery = (page: number, entity: AuditFilter) =>
    useQuery({
        queryKey: [...ADMIN_AUDIT_KEY, entity, page],
        queryFn: () => getAuditAction(page, entity),
        placeholderData: keepPreviousData,
        staleTime: 0,
        refetchOnWindowFocus: false,
        retry: false,
    });

export { useCacheStatsQuery, useAuditQuery };
