import { useTranslation } from "next-i18next";
import { BansView } from "@/features/bans/views/Bans.view";
import { paths } from "@/shared/constants/routes";
import { PageTransition } from "@/shared/layouts";
import Layout from "pages/Layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticPropsContext } from "next";

const BansPage = () => {
    const { t } = useTranslation("common");

    return (
        <Layout 
            title={t('seo.bansMetaTitle')}
            description={t('seo.bansMetaDescription')}
            textPage={ t('nav.partners') }
            linkPage={ paths.partners }
            url={ paths.partners }
        >
            <PageTransition>
                <BansView />
            </PageTransition>
        </Layout>
    )
};

export default BansPage;

export async function getStaticProps({ locale }: GetStaticPropsContext) {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? 'es', ['common', 'bans'])),
        },
    };
}