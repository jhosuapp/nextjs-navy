import { StaffView } from "@/features/staff/views/Staff";
import { paths } from "@/shared/constants";
import { PageTransition } from "@/shared/layouts";
import Layout from "pages/Layout";
import { useTranslation } from "next-i18next";
import { GetStaticPropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const StaffPage = () => {
    const { t } = useTranslation("common");

    return (
        <Layout 
            title={t('seo.staffMetaTitle')}
            description={t('seo.staffMetaDescription')}
            textPage={t('nav.bans')}
            linkPage={ paths.bans }
            url={ paths.bans }
        >
            <PageTransition>
                <StaffView />
            </PageTransition>
        </Layout>
    )
};

export default StaffPage;

export async function getStaticProps({ locale }: GetStaticPropsContext) {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? 'es', ['common'])),
        },
    };
}
