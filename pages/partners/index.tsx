import { PartnersView } from "@/features";
import { paths } from "@/shared/constants";
import { PageTransition } from "@/shared/layouts";
import Layout from "pages/Layout";
import { useTranslation } from "react-i18next";

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
