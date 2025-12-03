import { Container } from "@/shared/components";
import { TierDataByModalitie } from "../components";

const TierlistView = ():JSX.Element => {
    return (
        <Container className="!mt-5 lg:!mt-10" isFirst isLast>
            <TierDataByModalitie />
        </Container>
    )
}

export { TierlistView }