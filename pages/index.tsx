import dynamic from "next/dynamic";
import { HomeView } from "@/features/home/views/Home.view";
import { PageTransition } from "@/shared/layouts";
import Layout from "./Layout";
import { paths } from "@/shared/constants";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticPropsContext } from "next";

const ToastContainer = dynamic(() => import('react-toastify').then(mod => mod.ToastContainer), { ssr: false });

const HomePage = () => {
    const { t } = useTranslation("common");

    return (
        <Layout
            title={t('seo.homeMetaTitle')}
            description={t('seo.homeMetaDescription')}
            textPage={t('nav.tierlist')}
            linkPage={paths.tierlist}
        >
            <ToastContainer />
            <PageTransition>
                <HomeView />
            </PageTransition>
        </Layout>
    )
};

export default HomePage;

export async function getStaticProps({ locale }: GetStaticPropsContext) {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? 'es', ['common', 'home'])),
        },
    };
}