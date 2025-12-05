import { HomeView } from "@/features";
import { PageTransition } from "@/shared/layouts";
import Layout from "./Layout";
import { paths } from "@/shared/constants";

const HomePage = () => {
    return (
        <Layout
            title={'Navy'}
            description={'Navy'}
            textPage={'Tierlist'}
            linkPage={paths.tierlist}
        >
            <PageTransition>
                <HomeView />
            </PageTransition>
        </Layout>
    )
};

export default HomePage;
