import type { JSX } from "react";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import { Container } from "@/shared/components";
import { Results, TotalTests } from "../components";

const FlowersFirstScreen = dynamic(() => import("../components/parallax/Parallax").then(m => m.FlowersFirstScreen), { ssr: false });
const Hero = dynamic(() => import("../components/hero/Hero").then(m => m.Hero), { ssr: false });

import { useResumeQuery } from '../hooks';


const HomeView = ():JSX.Element => {
    const data = useResumeQuery();
    const { t } = useTranslation("home");

    return (
        <>
            <Container className="!mt-0 lg:!mt-8" isFirst>
                <FlowersFirstScreen />
                <Hero 
                    t={ t }
                />
            </Container>
            <Container className="!mt-10 lg:!mt-32">
                <Results 
                    lTests={ data?.data?.latest_l_tests ?? [] }
                    hTests={ data?.data?.latest_h_tests ?? [] } 
                    isLoad={ data.isLoading } 
                    t={ t }
                />
            </Container>
            <Container className="!mt-32 lg:!mt-52">
                <TotalTests
                    totalTests={ data?.data?.total_tests as any  } 
                    isLoad={ data.isLoading } 
                    t={ t }
                />
            </Container>
            <Container className="!mt-32 lg:!mt-52">
                <p></p>
            </Container>
        </>
    )
}

export { HomeView }