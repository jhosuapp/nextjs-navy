import { useTranslation } from "next-i18next";
import { StaffView } from "@/features/staff/views/Staff";
import { GroupedStaffResponse } from "@/features/staff/interfaces";
import { fetchStaffData } from "@/features/staff/actions/get-staff.server";
import { paths } from "@/shared/constants";
import { PageTransition } from "@/shared/layouts";
import Layout from "pages/Layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticPropsContext } from "next";

type Props = {
    staff: GroupedStaffResponse;
}

const StaffPage = ({ staff }: Props) => {
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
                <StaffView staff={ staff } />
            </PageTransition>
        </Layout>
    )
};

export default StaffPage;

export async function getStaticProps({ locale }: GetStaticPropsContext) {
    const { data: staff, revalidate } = await fetchStaffData();

    return {
        props: {
            staff,
            ...(await serverSideTranslations(locale ?? 'es', ['common'])),
        },
        revalidate,
    };
}
