import { useTranslation } from "next-i18next";
import { BansView } from "@/features/bans/views/Bans.view";
import { BansResponse } from "@/features/bans/interfaces";
import { fetchBansData } from "@/features/bans/actions/get-bans.server";
import { paths } from "@/shared/constants/routes";
import { PageTransition } from "@/shared/layouts";
import Layout from "@/shared/layouts/Layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticPropsContext } from "next";

type Props = {
    bans: BansResponse;
}

const BansPage = ({ bans }: Props) => {
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
                <BansView bans={ bans } />
            </PageTransition>
        </Layout>
    )
};

export default BansPage;

export async function getStaticProps({ locale }: GetStaticPropsContext) {
    const { data: bans, revalidate } = await fetchBansData();

    return {
        props: {
            bans,
            ...(await serverSideTranslations(locale ?? 'es', ['common', 'bans'])),
        },
        revalidate,
    };
}
