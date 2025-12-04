import { Container } from "@/shared/components"
import { CardBan, CardsWrapper } from "../components"

const BansView = ():JSX.Element => {
    return (
        <Container className="!mt-5 lg:!mt-10" isFirst>
            <CardsWrapper title={ `Castigos activos (${4})` }>
                <CardBan 
                    username="danjoh_0409"
                />
                <CardBan 
                    username="danjoh_0409"
                />
                <CardBan 
                    username="danjoh_0409"
                />
                <CardBan 
                    username="danjoh_0409"
                />
            </CardsWrapper>
            <CardsWrapper title={ `Castigos inactivos (${4})` }>
                <CardBan 
                    username="danjoh_0409"
                    variantStatus="inactive"
                />
                <CardBan 
                    username="danjoh_0409"
                    variantStatus="inactive"
                />
                <CardBan 
                    username="danjoh_0409"
                    variantStatus="inactive"
                />
                <CardBan 
                    username="danjoh_0409"
                    variantStatus="inactive"
                />
            </CardsWrapper>
        </Container>
    )
}

export { BansView }