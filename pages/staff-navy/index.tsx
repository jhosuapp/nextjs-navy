import { CardWrapper } from "@/features/home/components";
import { Container } from "@/shared/components";
import { PageTransition } from "@/shared/layouts";
import Layout from "pages/Layout";

const StaffPage = () => {

    return (
        <Layout 
            title={'Staff | Navy'}
            description={'Staff navy'}
            textPage={'Staff navy'}
            linkPage={'/staff'}
        >
            <PageTransition>
                <Container className="!mt-10" isFirst>
                    <CardWrapper animation={{ delayInit: 0.65, delayEnd: 0.13 }}>
                        <p>gola</p>
                    </CardWrapper>
                </Container>
            </PageTransition>
        </Layout>
    )
};

export default StaffPage;
