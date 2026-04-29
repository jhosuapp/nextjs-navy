import type { JSX } from "react";
import { useTranslation } from "next-i18next";
import { Container } from "@/shared/components/container/Container";
import { Results, TotalTests, Hero, VideoModal, FlowersFirstScreen } from "../components";
import { useResumeQuery, useVimeoModal } from '../hooks';

const DEFAULT_VIDEO_ID = 715502900;

const HomeView = ():JSX.Element => {
    const data = useResumeQuery();
    const vimeo = useVimeoModal();
    const { t } = useTranslation("home");

    return (
        <>
            <Container className="!mt-0 lg:!mt-8" isFirst>
                <FlowersFirstScreen />
                <Hero 
                    t={ t }
                    handleOpenVideoModal={ ()=> vimeo.openModal('715502900') }
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
            {/* Video modal */}
            <VideoModal
                vimeo={ vimeo }
                iframeSrc={`https://player.vimeo.com/video/${DEFAULT_VIDEO_ID}?h=6220f41888&title=0&byline=0&portrait=0&speed=0&badge=0&autopause=0&player_id=0&app_id=58479&controls=0`}
                t={ t }
            />
        </>
    )
}

export { HomeView }