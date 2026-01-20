import { Container } from "@/shared/components";
import { Comunity, PlayerHover, Results, TotalTests } from "../components";
import { useSkinStore } from "@/shared/stores";
import { motion } from 'framer-motion';
import { fadeUpMotion } from "@/shared/motion";

import styles from './home.module.css';
import { useResumeQuery } from "../hooks";

const HomeView = ():JSX.Element => {
    const skin = useSkinStore( state => state.skin);
    const data = useResumeQuery();

    return (
        <Container className="!mt-5 lg:!mt-10" isFirst isLast>
            <motion.div className={ styles.homeView__content } {...fadeUpMotion(0,0)}>
                <div className={ styles.homeView__block }>
                    <Results 
                        lTests={ data?.data?.latest_l_tests }
                        hTests={ data?.data?.latest_h_tests } 
                        isLoad={ data.isLoading } 
                    />
                </div>
                <motion.div className={ styles.homeView__player } {...fadeUpMotion(0.7, 0.13)}>
                    <PlayerHover username={ skin } />
                </motion.div>
                <div className={ styles.homeView__block }>
                    <Comunity />
                    <TotalTests 
                        totalTests={ data?.data?.total_tests } 
                        isLoad={ data.isLoading } 
                    />
                </div>
            </motion.div>
        </Container>
    )
}

export { HomeView }