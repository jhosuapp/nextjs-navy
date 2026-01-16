import { CardWrappersecondary, Container } from "@/shared/components";
import { CardPartners } from "../components";
import { dataDummy } from "../data";

const PartnersView = ():JSX.Element => {
    return (
        <Container className="!mt-5 lg:!mt-10" isFirst isLast>
            <CardWrappersecondary title="Our Partners" text={`${dataDummy.length} Partners`} isSmallGrid>
                {dataDummy.map((data)=>(
                    <CardPartners data={ data } />
                ))}
            </CardWrappersecondary>
        </Container>
    )
}

export { PartnersView }