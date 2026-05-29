import { PageTransition } from "@/shared/layouts";
import Layout from "@/shared/layouts/Layout";
import { paths } from "@/shared/constants";
import { useTranslation } from "next-i18next";
import { NotFoundView } from "@/features/not-found/views/NotFound.view";
import { GetStaticPropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";


const NotFound = () => {
    const { t } = useTranslation("common");

    return (
        <Layout
            title={t('seo.404MetaTitle')}
            description={t('seo.404MetaDescription')}
            textPage={t('nav.home')}
            linkPage={paths.home}
            enableBot={ false }
            hasNoIndex
        >
            <PageTransition>
                <NotFoundView />
            </PageTransition>
        </Layout>
    )
};

export default NotFound;

export async function getStaticProps({ locale }: GetStaticPropsContext) {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? 'es', ['common'])),
        },
    };
}
