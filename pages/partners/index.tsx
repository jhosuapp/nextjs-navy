import { PartnersView } from "@/features/partners/views/Partners.view";
import { paths } from "@/shared/constants";
import { PageTransition } from "@/shared/layouts";
import Layout from "pages/Layout";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticPropsContext } from "next";

const PartnersPage = () => {
    const { t } = useTranslation("common");

    return (
        <Layout 
            title={t('seo.partnersMetaTitle')}
            description={t('seo.partnersMetaDescription')}
            textPage={t('nav.home')}
            linkPage={ paths.home }
            url={ paths.home }
        >
            <PageTransition>
                <PartnersView />
            </PageTransition>
        </Layout>
    )
};

export default PartnersPage;

export async function getStaticProps({ locale }: GetStaticPropsContext) {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? 'es', ['common', 'partners'])),
        },
    };
}
