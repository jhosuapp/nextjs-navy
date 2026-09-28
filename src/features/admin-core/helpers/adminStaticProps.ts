import type { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

type AdminPageProps = Awaited<ReturnType<typeof serverSideTranslations>>;

/** `getStaticProps` común de las páginas del panel: solo traducciones. */
export async function getAdminStaticProps({
    locale,
}: GetStaticPropsContext): Promise<GetStaticPropsResult<AdminPageProps>> {
    return {
        props: await serverSideTranslations(locale ?? "es", ["common", "admin"]),
    };
}
