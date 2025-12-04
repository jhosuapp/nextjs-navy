import { BansView } from "@/features";
import { PageTransition } from "@/shared/layouts";
import Layout from "pages/Layout";

const BansPage = () => {

    return (
        <Layout 
            title={'Bans | Navy'}
            description={'Bans navy'}
            textPage={'Bans navy'}
            linkPage={'/bans'}
        >
            <PageTransition>
                <BansView />
            </PageTransition>
        </Layout>
    )
};

export default BansPage;
