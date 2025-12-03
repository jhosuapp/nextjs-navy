import { Container } from "@/shared/components";
import { NavBar, TierDataByModalitie, TierDataOverall } from "../components";
import { useModalitieStore } from "@/shared/stores";
import { fadeUpMotion } from "@/shared/motion";
import { AnimatePresence } from "framer-motion";

const TierlistView = ():JSX.Element => {
    const currentModalitie = useModalitieStore( state => state.currentModalitie );

    return (
        <Container className="!mt-5 lg:!mt-10" isFirst isLast {...fadeUpMotion(0.7, 0.13)}>
            <NavBar />
            <AnimatePresence mode="wait">
                {currentModalitie === 'Overall' ? (
                    <TierDataOverall key={ currentModalitie } />
                ) : (
                    <TierDataByModalitie key={ currentModalitie } />
                )}
            </AnimatePresence>
        </Container>
    )
}

export { TierlistView }