import type { JSX } from "react";
import { useTranslation } from "next-i18next";
import { Container } from "@/shared/components/container/Container";
import { NavBar } from "../components/navbar/NavBar";
import { TierDataByModalitie } from "../components/tier-data-by-modalities/TierDataByModalitie";
import { TierDataOverall } from "../components/tier-data-overall/TierDataOverall";
import { useModalitieStore } from "@/shared/stores/modalities.store";
import { fadeUpMotion } from "@/shared/motion/fadeUp.motion";


const TierlistView = ():JSX.Element => {
    const currentModalitie = useModalitieStore( state => state.currentModalitie );
    const { t } = useTranslation("tierlist");

    return (
        <Container className="!mt-5 lg:!mt-10" isFirst isLast {...fadeUpMotion(0.7, 0.13)}>
            <NavBar t={ t } />
            {currentModalitie == 'Overall' ? (
                <TierDataOverall t={ t } key={ `unify-${currentModalitie}` } />
            ) : (
                <TierDataByModalitie t={ t } key={ `by-modalitie-${currentModalitie}` } />
            )}
        </Container>
    )
}

export { TierlistView }