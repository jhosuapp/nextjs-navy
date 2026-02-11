import { CardWrappersecondary, Container } from "@/shared/components";
import { CardPartners } from "../components";
import { serversData, streamersData } from "../data";

const PartnersView = ():JSX.Element => {
    return (
        <Container className="!mt-5 lg:!mt-10" isFirst isLast>
            <CardWrappersecondary title="Streamers" text={`${streamersData.length} Partners`} isSmallGrid key={`streamers`}>
                {streamersData.map((data)=>(
                    <CardPartners data={ data } key={ `${data.name}-streamers` } />
                ))}
            </CardWrappersecondary>
            <CardWrappersecondary title="Servers" text={`${serversData.length} Partners`} isSmallGrid key={`partners`}>
                {serversData.map((data)=>(
                    <CardPartners data={ data } key={ `${data.name}-partners` } />
                ))}
            </CardWrappersecondary>
        </Container>
    )
}

export { PartnersView }