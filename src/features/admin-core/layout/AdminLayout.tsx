import type { JSX, ReactNode } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { fadeInMotion } from "@/shared/motion/fadeIn.motion";
import { AuthGuard } from "./auth-guard/AuthGuard";
import { Sidebar } from "./sidebar/Sidebar";
import { AdminTopbar } from "./topbar/AdminTopbar";
import { findActiveItem } from "./sidebar/constants/sidebar.constants";
import styles from "./adminLayout.module.css";

const ToastContainer = dynamic(() => import("react-toastify").then((mod) => mod.ToastContainer), { ssr: false });

type Props = {
    children: ReactNode;
};

/**
 * Layout del panel admin: sin header/footer públicos, sidebar persistente
 * (se monta una vez vía `getLayout`) y transición suave solo en el contenido.
 */
const AdminLayout = ({ children }: Props): JSX.Element => {
    const { t } = useTranslation("admin");
    const { pathname } = useRouter();
    const activeItem = findActiveItem(pathname);
    const sectionTitle = activeItem ? t(activeItem.labelKey) : t("nav.panel");

    return (
        <>
            <Head>
                <title>{`${sectionTitle} · ${t("seo.title")}`}</title>
                <meta name="description" content={t("seo.description")} />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta name="robots" content="noindex, nofollow" />
                <meta name="theme-color" content="#1a151a" />
            </Head>

            <ToastContainer theme="dark" position="bottom-right" newestOnTop />

            <div className={styles.adminLayout}>
                <AuthGuard>
                    <div className={styles.adminLayout__shell}>
                        <Sidebar />
                        <main className={styles.adminLayout__main} id="admin-main">
                            <AdminTopbar title={sectionTitle} openMenuLabel={t("nav.openMenu")} />
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div key={pathname} className={styles.adminLayout__content} {...fadeInMotion()}>
                                    {children}
                                </motion.div>
                            </AnimatePresence>
                        </main>
                    </div>
                </AuthGuard>
            </div>
        </>
    );
};

/** Helper para `Page.getLayout`. */
const getAdminLayout = (page: ReactNode): JSX.Element => <AdminLayout>{page}</AdminLayout>;

export { AdminLayout, getAdminLayout };
