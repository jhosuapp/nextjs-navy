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
            <div className={ styles.homeView__content }>
                <div className={ styles.homeView__block }>
                    <Results />
                </div>
                <motion.div className="w-fit px-10 min-w-96" {...fadeUpMotion(0.7, 0.13)}>
                    <PlayerHover username={ skin } />
                </motion.div>
                <div className={ styles.homeView__block }>
                    <Comunity />
                    <TotalTests />
                </div>
            </div>
        </Container>
    )
}

export { HomeView }