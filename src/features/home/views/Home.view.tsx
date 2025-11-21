import { Container } from "@/shared/components";
import { Comunity, PlayerHover, Results, TotalTests } from "../components";
import { useSkinStore } from "@/shared/stores";

import styles from './home.module.css';

const HomeView = ():JSX.Element => {
    const skin = useSkinStore( state => state.skin);

    return (
        <Container className="!mt-10" isFirst>
            <div className={ styles.homeView__content }>
                <div className={ styles.homeView__block }>
                    <Results />
                </div>
                <div className="w-fit px-10 min-w-96">
                    <PlayerHover username={ skin } />
                </div>
                <div className={ styles.homeView__block }>
                    <Comunity />
                    <TotalTests />
                </div>
            </div>
        </Container>
    )
}

export { HomeView }