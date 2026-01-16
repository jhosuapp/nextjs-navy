import { CardWrappersecondary, Container } from "@/shared/components"
import { CardPartners } from "../components"

const PartnersView = ():JSX.Element => {
    return (
        <Container className="!mt-5 lg:!mt-10" isFirst isLast>
            <CardWrappersecondary title="Our Partners" text="10 partners" isSmallGrid>
                <CardPartners />
                <CardPartners />
                <CardPartners />
                <CardPartners />
            </CardWrappersecondary>
        </Container>
    )
}

export { PartnersView }