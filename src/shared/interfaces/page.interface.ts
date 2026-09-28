import type { NextPage } from "next";
import type { ReactElement, ReactNode } from "react";

/**
 * Página con layout persistente: `_app` envuelve la página con `getLayout`
 * para que el layout (p. ej. el sidebar del panel) no se desmonte al navegar.
 */
export type NextPageWithLayout<P = object> = NextPage<P> & {
    getLayout?: (page: ReactElement) => ReactNode;
};
