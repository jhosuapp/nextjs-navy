import { Container } from "@/shared/components";
import { Comunity, PlayerHover, Results, TotalTests } from "../components";
import { useSkinStore } from "@/shared/stores";
import { motion } from 'framer-motion';

import styles from './home.module.css';
import { fadeUpMotion } from "@/shared/motion";

const HomeView = ():JSX.Element => {
    const skin = useSkinStore( state => state.skin);

    return (
        <Container className="!mt-10" isFirst isLast>
            <motion.div className={ styles.homeView__content } {...fadeUpMotion(0,0)}>
                <div className={ styles.homeView__block }>
                    <Results />
                </div>
                <div className={ styles.homeView__block }>
                    <PlayerHover username={ skin } />
                </div>
                <div className={ styles.homeView__block }>
                    <Comunity />
                    <TotalTests />
                </div>
            </motion.div>
        </Container>
    )
}

export { HomeView }