import { PageTransition } from "@/shared/layouts";
import Link from "next/link";
import Layout from "pages/Layout";

const StaffPage = () => {

    return (
        <Layout 
            title={'hola'}
            description={'hola'}
            textPage={'hola'}
            linkPage={'/ffa-diamond'}
        >
            <PageTransition>
                <p>hola</p>
                <Link href={'/'}>Home</Link>
            </PageTransition>
        </Layout>
    )
};

export default StaffPage;
