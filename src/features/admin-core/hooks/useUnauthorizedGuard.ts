import { useEffect } from "react";
import { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { ADMIN_SESSION_KEY } from "./useAdminSession.query";

export const isUnauthorized = (error: unknown): boolean =>
    error instanceof AxiosError && error.response?.status === 401;

/** Si una query del panel devuelve 401 (sesión caducada), revalida la sesión. */
const useUnauthorizedGuard = (error: unknown): void => {
    const queryClient = useQueryClient();

    useEffect(() => {
        if (isUnauthorized(error)) {
            queryClient.invalidateQueries({ queryKey: ADMIN_SESSION_KEY });
        }
    }, [error, queryClient]);
};

export { useUnauthorizedGuard };
