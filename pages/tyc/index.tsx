import { LegalView } from "@/features/legal/views/Legal.view";
import { paths } from "@/shared/constants";
import { PageTransition } from "@/shared/layouts";
import Layout from "@/shared/layouts/Layout";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticPropsContext } from "next";

const TycPage = () => {
    const { t } = useTranslation("common");

    return (
        <Layout
            title={t('seo.tycMetaTitle')}
            description={t('seo.tycMetaDescription')}
            textPage={t('nav.home')}
            linkPage={ paths.home }
            url={ paths.tyc }
        >
            <PageTransition>
                <LegalView doc="tyc" />
            </PageTransition>
        </Layout>
    )
};

export default TycPage;

export async function getStaticProps({ locale }: GetStaticPropsContext) {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? 'es', ['common', 'legal'])),
        },
    };
}
