import { AdminUsersView } from "@/features/admin-users/views/AdminUsers.view";
import { getAdminLayout } from "@/features/admin-core/layout/AdminLayout";
import { getAdminStaticProps } from "@/features/admin-core/helpers/adminStaticProps";
import type { NextPageWithLayout } from "@/shared/interfaces/page.interface";

const AdminUsersPage: NextPageWithLayout = () => <AdminUsersView />;

AdminUsersPage.getLayout = getAdminLayout;

export default AdminUsersPage;

export const getStaticProps = getAdminStaticProps;
