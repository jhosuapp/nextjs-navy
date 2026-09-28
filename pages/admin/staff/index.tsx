import { AdminStaffView } from "@/features/admin-staff/views/AdminStaff.view";
import { getAdminLayout } from "@/features/admin-core/layout/AdminLayout";
import { getAdminStaticProps } from "@/features/admin-core/helpers/adminStaticProps";
import type { NextPageWithLayout } from "@/shared/interfaces/page.interface";

const AdminStaffPage: NextPageWithLayout = () => <AdminStaffView />;

AdminStaffPage.getLayout = getAdminLayout;

export default AdminStaffPage;

export const getStaticProps = getAdminStaticProps;
