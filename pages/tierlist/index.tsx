import { TierlistView } from "@/features";
import { paths } from "@/shared/constants";
import { PageTransition } from "@/shared/layouts";
import Layout from "pages/Layout";
import { useTranslation } from "react-i18next";

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
            <PageTransition>
                <TierlistView />
            </PageTransition>
        </Layout>
    )
};

export default TierlistPage;
