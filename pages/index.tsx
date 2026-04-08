import { HomeView } from "@/features";
import { PageTransition } from "@/shared/layouts";
import Layout from "./Layout";
import { paths } from "@/shared/constants";
import { useTranslation } from "react-i18next";

const HomePage = () => {
    const { t } = useTranslation("common");

    return (
        <Layout
            title={t('seo.homeMetaTitle')}
            description={t('seo.homeMetaDescription')}
            textPage={t('nav.tierlist')}
            linkPage={paths.tierlist}
        >
            <PageTransition>
                <HomeView />
            </PageTransition>
        </Layout>
    )
};

export default HomePage;
