import { BansView } from "@/features";
import { paths } from "@/shared/constants";
import { PageTransition } from "@/shared/layouts";
import Layout from "pages/Layout";

const BansPage = () => {

    return (
        <Layout 
            title={'Bans | Navy'}
            description={'Bans navy'}
            textPage={'Partners'}
            linkPage={ paths.partners }
        >
            <PageTransition>
                <BansView />
            </PageTransition>
        </Layout>
    )
};

export default BansPage;
