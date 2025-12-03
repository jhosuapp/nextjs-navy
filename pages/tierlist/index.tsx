import { TierlistView } from "@/features";
import { PageTransition } from "@/shared/layouts";
import Layout from "pages/Layout";

const TierlistPage = () => {

    return (
        <Layout 
            title={'Tierlist | Navy'}
            description={'Tierlist Navy'}
            textPage={'hola'}
            linkPage={'/ffa-diamond'}
        >
            <PageTransition>
                <TierlistView />
            </PageTransition>
        </Layout>
    )
};

export default TierlistPage;
