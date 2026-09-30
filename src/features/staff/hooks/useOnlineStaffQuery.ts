import { useQuery } from "@tanstack/react-query";
import { getOnlineStaffAction } from "../actions/get-online-staff.action";

/** Refresco del estado "en línea" (el bot lo actualiza en tiempo real). */
const ONLINE_REFRESH_MS = 60_000;

/**
 * Staff conectado. A diferencia del resto de queries (estáticas, `staleTime:
 * Infinity`) este dato es en vivo: se sondea cada minuto mientras la pestaña
 * está visible.
 */
const useOnlineStaffQuery = () => useQuery({
    queryKey: ['staff', 'online'],
    queryFn: getOnlineStaffAction,
    staleTime: ONLINE_REFRESH_MS / 2,
    refetchInterval: ONLINE_REFRESH_MS,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    retry: false,
});

export { useOnlineStaffQuery };
