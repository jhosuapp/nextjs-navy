import { useTranslation } from "react-i18next";
import { BansView } from "@/features/bans/views/Bans.view";
import { paths } from "@/shared/constants/routes";
import { PageTransition } from "@/shared/layouts";
import Layout from "pages/Layout";

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
