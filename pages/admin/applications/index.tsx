import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticPropsContext } from "next";
import { AdminApplicationsView } from "@/features/admin-applications/views/AdminApplications.view";
import { paths } from "@/shared/constants";
import { PageTransition } from "@/shared/layouts";
import Layout from "@/shared/layouts/Layout";

const ToastContainer = dynamic(
    () => import("react-toastify").then((mod) => mod.ToastContainer),
    { ssr: false }
);

const AdminApplicationsPage = () => {
    const { t } = useTranslation("admin");
    const { t: tc } = useTranslation("common");

    return (
        <Layout
            title={t("seo.title")}
            description={t("seo.description")}
            textPage={tc("nav.home")}
            linkPage={paths.home}
            url={paths.applicationsAdmin}
            enableBot={false}
            hasNoIndex
        >
            <ToastContainer />
            <PageTransition>
                <AdminApplicationsView />
            </PageTransition>
        </Layout>
    );
};

export default AdminApplicationsPage;

export async function getStaticProps({ locale }: GetStaticPropsContext) {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? "es", [
                "common",
                "admin",
            ])),
        },
    };
}
