import { Container } from "@/shared/components";
import { AnimatedCounter, FlowersFirstScreen, Hero, Results, TotalTests } from "../components";

import styles from './home.module.css';
import { useResumeQuery } from '../hooks';


const HomeView = ():JSX.Element => {
    const data = useResumeQuery();
    const counters = [
        { value: 150, label: 'Proyectos', suffix: '+' },
        { value: 98, label: 'Clientes Felices', suffix: '%' },
        { value: 24, label: 'Premios', suffix: '' }
    ];
      


    return (
        <>
            <Container className="!mt-0 lg:!mt-8" isFirst>
                <FlowersFirstScreen />
                <Hero />
            </Container>
            <Container className="!mt-10 lg:!mt-32">
                <Results 
                    lTests={ data?.data?.latest_l_tests }
                    hTests={ data?.data?.latest_h_tests } 
                    isLoad={ data.isLoading } 
                />
            </Container>
            <Container className="!mt-32 lg:!mt-52">
                <TotalTests
                    totalTests={ data?.data?.total_tests } 
                    isLoad={ data.isLoading } 
                />
            </Container>
            <Container className="!mt-32 lg:!mt-52">
                <p></p>
            </Container>
            {/* <Container className="!mt-5 lg:!mt-10" isFirst isLast>
                <motion.div className={ styles.homeView__content } {...fadeUpMotion(0,0)}>
                    <div className={ styles.homeView__block }>
                        
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
            </Container> */}
        </>
    )
}

export { HomeView }