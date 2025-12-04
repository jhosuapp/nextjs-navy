import { StaffView } from "@/features";
import { PageTransition } from "@/shared/layouts";
import Layout from "pages/Layout";

const StaffPage = () => {

    return (
        <Layout 
            title={'Staff | Navy'}
            description={'Staff navy'}
            textPage={'Staff navy'}
            linkPage={'/staff'}
        >
            <PageTransition>
                <StaffView />
            </PageTransition>
        </Layout>
    )
};

export default StaffPage;
