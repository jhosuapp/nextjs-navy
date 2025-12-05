import { Container, CardWrappersecondary } from "@/shared/components"
import { CardBan  } from "../components"

const BansView = ():JSX.Element => {
    return (
        <Container className="!mt-5 lg:!mt-10" isFirst isLast>
            <CardWrappersecondary title={ `Castigos activos (${4})` } text={`${3} Usuarios`}>
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
            </CardWrappersecondary>
            <CardWrappersecondary title={ `Castigos inactivos (${4})` } text={`${3} Usuarios`}>
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
            </CardWrappersecondary>
        </Container>
    )
}

export { BansView }