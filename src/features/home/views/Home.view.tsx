import type { JSX } from "react";
import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";
import { Container } from "@/shared/components/container/Container";
import { Results, TotalTests, Hero, VideoModal, FlowersFirstScreen } from "../components";
import { useResumeQuery, useVimeoModal } from '../hooks';

const DEFAULT_VIDEO_ID = 818507172;

const HomeView = ():JSX.Element => {
    const data = useResumeQuery();
    const vimeo = useVimeoModal({ defaultVideoId: DEFAULT_VIDEO_ID });
    const { t } = useTranslation("home");

    return (
        <>
            <Container className="!mt-0 lg:!mt-8" isFirst>
                <FlowersFirstScreen />
                <Hero 
                    t={ t }
                />
                              <button
                className="open-modal-ia"
                onClick={() => vimeo.openModal('818507172')}
            >
                Ver video
            </button>
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
                vimeo={vimeo}
                iframeSrc={`https://player.vimeo.com/video/${DEFAULT_VIDEO_ID}?h=6220f41888&amp;title=0&amp;byline=0&amp;portrait=0&amp;speed=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479`}
                locale="es"
            />
        </>
    )
}

export { HomeView }