import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { Container } from "@/shared/components";
import { NavBar, TierDataByModalitie, TierDataOverall } from "../components";
import { useModalitieStore } from "@/shared/stores";
import { fadeUpMotion } from "@/shared/motion";


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