import { TierlistView } from "@/features";
import { paths } from "@/shared/constants";
import { PageTransition } from "@/shared/layouts";
import Layout from "pages/Layout";

const TierlistPage = () => {

    return (
        <Layout 
            title={'Tierlist | Navy'}
            description={'Tierlist Navy'}
            textPage={'Staff'}
            linkPage={ paths.staff }
        >
            <PageTransition>
                <TierlistView />
            </PageTransition>
        </Layout>
    )
};

export default TierlistPage;
