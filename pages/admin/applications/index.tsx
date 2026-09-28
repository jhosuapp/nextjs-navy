import { AdminApplicationsView } from "@/features/admin-applications/views/AdminApplications.view";
import { getAdminLayout } from "@/features/admin-core/layout/AdminLayout";
import { getAdminStaticProps } from "@/features/admin-core/helpers/adminStaticProps";
import type { NextPageWithLayout } from "@/shared/interfaces/page.interface";

const AdminApplicationsPage: NextPageWithLayout = () => <AdminApplicationsView />;

AdminApplicationsPage.getLayout = getAdminLayout;

export default AdminApplicationsPage;

export const getStaticProps = getAdminStaticProps;
