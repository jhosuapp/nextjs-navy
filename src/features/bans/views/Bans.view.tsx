import { Container } from "@/shared/components"
import { Card, CardsWrapper } from "../components"

const BansView = ():JSX.Element => {
    return (
        <Container className="!mt-5 lg:!mt-10" isFirst>
            <CardsWrapper title={ `Castigos activos (${4})` }>
                <Card 
                    username="danjoh_0409"
                />
                <Card 
                    username="danjoh_0409"
                />
                <Card 
                    username="danjoh_0409"
                />
                <Card 
                    username="danjoh_0409"
                />
            </CardsWrapper>
            <CardsWrapper title={ `Castigos inactivos (${4})` }>
                <Card 
                    username="danjoh_0409"
                    variantStatus="inactive"
                />
                <Card 
                    username="danjoh_0409"
                    variantStatus="inactive"
                />
                <Card 
                    username="danjoh_0409"
                    variantStatus="inactive"
                />
                <Card 
                    username="danjoh_0409"
                    variantStatus="inactive"
                />
            </CardsWrapper>
        </Container>
    )
}

export { BansView }