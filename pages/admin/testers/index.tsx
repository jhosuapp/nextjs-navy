import { AdminTestersView } from "@/features/admin-testers/views/AdminTesters.view";
import { getAdminLayout } from "@/features/admin-core/layout/AdminLayout";
import { getAdminStaticProps } from "@/features/admin-core/helpers/adminStaticProps";
import type { NextPageWithLayout } from "@/shared/interfaces/page.interface";

const AdminTestersPage: NextPageWithLayout = () => <AdminTestersView />;

AdminTestersPage.getLayout = getAdminLayout;

export default AdminTestersPage;

export const getStaticProps = getAdminStaticProps;
