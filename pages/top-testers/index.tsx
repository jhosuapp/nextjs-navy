import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticPropsContext } from "next";
import { TopTestersView } from "@/features/top-testers/views/TopTesters.view";
import { fetchTopTestersData } from "@/features/top-testers/actions/get-top-testers.server";
import { TopTestersData } from "@/features/top-testers/interfaces";
import { paths } from "@/shared/constants";
import { PageTransition } from "@/shared/layouts";
import Layout from "@/shared/layouts/Layout";

type Props = {
    data: TopTestersData;
}

const ToastContainer = dynamic(() => import('react-toastify').then(mod => mod.ToastContainer), { ssr: false });

const TopTestersPage = ({ data }: Props) => {
    const { t } = useTranslation("common");

    return (
        <Layout
            title={ t('seo.topTestersMetaTitle') }
            description={ t('seo.topTestersMetaDescription') }
            textPage={ t('nav.home') }
            linkPage={ paths.home }
            url={ paths.topTesters }
        >
            <ToastContainer />
            <PageTransition>
                <TopTestersView data={ data } />
            </PageTransition>
        </Layout>
    );
};

export default TopTestersPage;

export async function getStaticProps({ locale }: GetStaticPropsContext) {
    const { data, revalidate } = await fetchTopTestersData();

    return {
        props: {
            data,
            ...(await serverSideTranslations(locale ?? 'es', ['common', 'top-testers'])),
        },
        revalidate,
    };
}
