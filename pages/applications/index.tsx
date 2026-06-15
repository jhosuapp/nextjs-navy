import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticPropsContext } from "next";
import { ApplicationsView } from "@/features/applications/views/Applications.view";
import { paths } from "@/shared/constants";
import { PageTransition } from "@/shared/layouts";
import Layout from "@/shared/layouts/Layout";

const ToastContainer = dynamic(
    () => import("react-toastify").then((mod) => mod.ToastContainer),
    { ssr: false }
);

const ApplicationsPage = () => {
    const { t } = useTranslation("common");

    return (
        <Layout
            title={t("seo.applicationsMetaTitle")}
            description={t("seo.applicationsMetaDescription")}
            textPage={t("nav.home")}
            linkPage={paths.home}
            url={paths.applications}
        >
            <ToastContainer />
            <PageTransition>
                <ApplicationsView />
            </PageTransition>
        </Layout>
    );
};

export default ApplicationsPage;

export async function getStaticProps({ locale }: GetStaticPropsContext) {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? "es", [
                "common",
                "applications",
            ])),
        },
    };
}
