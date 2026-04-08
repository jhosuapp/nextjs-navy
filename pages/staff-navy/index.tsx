import { StaffView } from "@/features";
import { paths } from "@/shared/constants";
import { PageTransition } from "@/shared/layouts";
import Layout from "pages/Layout";
import { useTranslation } from "react-i18next";

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
