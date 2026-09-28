import { AdminSettingsView } from "@/features/admin-settings/views/AdminSettings.view";
import { getAdminLayout } from "@/features/admin-core/layout/AdminLayout";
import { getAdminStaticProps } from "@/features/admin-core/helpers/adminStaticProps";
import type { NextPageWithLayout } from "@/shared/interfaces/page.interface";

const AdminSettingsPage: NextPageWithLayout = () => <AdminSettingsView />;

AdminSettingsPage.getLayout = getAdminLayout;

export default AdminSettingsPage;

export const getStaticProps = getAdminStaticProps;
