import { Container } from "@/shared/components";
import { Comunity, PlayerHover, Results, TotalTests } from "../components";
import { useSkinStore } from "@/shared/stores";
import { motion } from 'framer-motion';
import { fadeUpMotion } from "@/shared/motion";

import styles from './home.module.css';

const HomeView = ():JSX.Element => {
    const skin = useSkinStore( state => state.skin);

    return (
        <Container className="!mt-5 lg:!mt-10" isFirst isLast>
            <motion.div className={ styles.homeView__content } {...fadeUpMotion(0,0)}>
                <div className={ styles.homeView__block }>
                    <Results />
                </div>
                <motion.div className={ styles.homeView__player } {...fadeUpMotion(0.7, 0.13)}>
                    <PlayerHover username={ skin } />
                </motion.div>
                <div className={ styles.homeView__block }>
                    <Comunity />
                    <TotalTests />
                </div>
            </motion.div>
        </Container>
    )
}

export { HomeView }