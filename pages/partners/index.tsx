import { PartnersView } from "@/features";
import { paths } from "@/shared/constants";
import { PageTransition } from "@/shared/layouts";
import Layout from "pages/Layout";

const PartnersPage = () => {

    return (
        <Layout 
            title={'Partners | Navy'}
            description={'Partners navy'}
            textPage={'Home'}
            linkPage={ paths.home }
        >
            <PageTransition>
                <PartnersView />
            </PageTransition>
        </Layout>
    )
};

export default PartnersPage;
