import { HomeView } from "@/features";
import { PageTransition } from "@/shared/layouts";
import Link from "next/link";
import Layout from "./Layout";

const HomePage = () => {
    return (
        <Layout
            title={'Navy'}
            description={'Navy'}
            textPage={''}
            linkPage={'/ffa-diamond'}
        >
            <PageTransition>
                <HomeView />
                <Link href={'/staff'}>Staff</Link>
            </PageTransition>
        </Layout>
    )
};

export default HomePage;
