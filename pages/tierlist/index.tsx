import dynamic from "next/dynamic";
import { TierlistView } from "@/features/tierlist/views/Tierlist.view";
import { paths } from "@/shared/constants";
import { PageTransition } from "@/shared/layouts";
import Layout from "pages/Layout";
import { useTranslation } from "next-i18next";
import { GetStaticPropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const ToastContainer = dynamic(() => import('react-toastify').then(mod => mod.ToastContainer), { ssr: false });

const TierlistPage = () => {
    const { t } = useTranslation("common");

    return (
        <Layout 
            title={t('seo.tierlistMetaTitle')}
            description={t('seo.tierlistMetaDescription')}
            textPage={t('nav.staff')}
            linkPage={ paths.staff }
            url={ paths.staff }
        >
            <ToastContainer />
            <PageTransition>
                <TierlistView />
            </PageTransition>
        </Layout>
    )
};

export default TierlistPage;

export async function getStaticProps({ locale }: GetStaticPropsContext) {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? 'es', ['common', 'tierlist'])),
        },
    };
}