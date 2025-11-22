import { Container } from "@/shared/components";
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
                <Container className="!mt-10" isFirst>
                    <p>hola</p>
                    <Link href={'/'}>Home</Link>
                </Container>
            </PageTransition>
        </Layout>
    )
};

export default StaffPage;
