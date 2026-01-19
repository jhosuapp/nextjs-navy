import { CardWrappersecondary, Container } from "@/shared/components";
import { CardPartners } from "../components";
import { serversData, streamersData } from "../data";

const PartnersView = ():JSX.Element => {
    return (
        <Container className="!mt-5 lg:!mt-10" isFirst isLast>
            <CardWrappersecondary title="Streamers" text={`${streamersData.length} Partners`} isSmallGrid>
                {streamersData.map((data)=>(
                    <CardPartners data={ data } />
                ))}
            </CardWrappersecondary>
            <CardWrappersecondary title="Servers" text={`${serversData.length} Partners`} isSmallGrid>
                {serversData.map((data)=>(
                    <CardPartners data={ data } />
                ))}
            </CardWrappersecondary>
        </Container>
    )
}

export { PartnersView }