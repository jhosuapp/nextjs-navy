import { useQuery } from "@tanstack/react-query";
import { getResumeAction } from "../actions/get-resume.action";
import { TierlistResumeResponse } from "../interfaces";

const REFETCH_INTERVAL = 30_000;

/**
 * Excepción consciente al `staleTime: Infinity` que el proyecto usa por defecto:
 * esa regla aplica a data estática, y los últimos resultados deben ir en vivo.
 * 30 s de polling son 2 req/min, muy por debajo del límite de 40 req/min por IP.
 */
const useResumeQuery = (initialData: TierlistResumeResponse) =>
    useQuery({
        queryKey: ["tierlist-resume"],
        queryFn: getResumeAction,
        initialData,
        staleTime: 0,
        refetchInterval: REFETCH_INTERVAL,
        refetchIntervalInBackground: false,
        refetchOnWindowFocus: true,
        retry: 1,
    });

export { useResumeQuery };
