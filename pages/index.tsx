import { HomeView } from "@/features";
import { PageTransition } from "@/shared/layouts";
import Layout from "./Layout";

const HomePage = () => {
    return (
        <Layout
            title={'Navy'}
            description={'Navy'}
            textPage={''}
            linkPage={'/'}
        >
            <PageTransition>
                <HomeView />
            </PageTransition>
        </Layout>
    )
};

export default HomePage;
