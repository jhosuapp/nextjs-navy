import { Container } from "@/shared/components";
import { NavBar, TierDataByModalitie, TierDataOverall } from "../components";
import { useModalitieStore } from "@/shared/stores";
import { fadeUpMotion } from "@/shared/motion";

const TierlistView = ():JSX.Element => {
    const currentModalitie = useModalitieStore( state => state.currentModalitie );

    console.log(currentModalitie);

    return (
        <Container className="!mt-5 lg:!mt-10" isFirst isLast {...fadeUpMotion(0.7, 0.13)}>
            <NavBar />
            {currentModalitie == 'Overall' ? (
                <TierDataOverall key={ `unify-${currentModalitie}` } />
            ) : (
                <TierDataByModalitie key={ `by-modalitie-${currentModalitie}` } />
            )}
        </Container>
    )
}

export { TierlistView }