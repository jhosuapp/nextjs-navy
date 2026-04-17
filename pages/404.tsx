import { PageTransition } from "@/shared/layouts";
import Layout from "./Layout";
import { paths } from "@/shared/constants";
import { useTranslation } from "react-i18next";
import { NotFoundView } from "@/features/not-found/views/NotFound.view";


const NotFound = () => {
    const { t } = useTranslation("common");

    return (
        <Layout
            title={t('seo.404MetaTitle')}
            description={t('seo.404MetaDescription')}
            textPage={t('nav.home')}
            linkPage={paths.home}
            enableBot={ false }
            hasNoIndex
        >
            <PageTransition>
                <NotFoundView />
            </PageTransition>
        </Layout>
    )
};

export default NotFound;
