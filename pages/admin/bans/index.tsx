import { AdminBansView } from "@/features/admin-bans/views/AdminBans.view";
import { getAdminLayout } from "@/features/admin-core/layout/AdminLayout";
import { getAdminStaticProps } from "@/features/admin-core/helpers/adminStaticProps";
import type { NextPageWithLayout } from "@/shared/interfaces/page.interface";

const AdminBansPage: NextPageWithLayout = () => <AdminBansView />;

AdminBansPage.getLayout = getAdminLayout;

export default AdminBansPage;

export const getStaticProps = getAdminStaticProps;
