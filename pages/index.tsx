import dynamic from "next/dynamic";
import { HomeView } from "@/features";
import { PageTransition } from "@/shared/layouts";
import Layout from "./Layout";
import { paths } from "@/shared/constants";
import { useTranslation } from "react-i18next";

const ToastContainer = dynamic(() => import('react-toastify').then(mod => mod.ToastContainer), { ssr: false });

const HomePage = () => {
    const { t } = useTranslation("common");

    return (
        <Layout
            title={t('seo.homeMetaTitle')}
            description={t('seo.homeMetaDescription')}
            textPage={t('nav.tierlist')}
            linkPage={paths.tierlist}
            hasYoutube
        >
            <ToastContainer />
            <PageTransition>
                <HomeView />
            </PageTransition>
        </Layout>
    )
};

export default HomePage;
