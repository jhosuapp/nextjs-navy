import type { JSX } from "react";
import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";
import { Container } from "@/shared/components/container/Container";
import { Hero } from "../components/hero/Hero";
import { Results } from "../components/results/Results";
import { TotalTests } from "../components/totalt-tests/TotalTests";
import { FlowersFirstScreen } from "../components/parallax/Parallax";
import { useVimeoModal } from '../hooks';
import { TierlistResumeResponse } from "../interfaces";

const VideoModal = dynamic(
    () => import('../components/video-modal/VideoModal').then(m => m.VideoModal),
    { ssr: false, loading: () => null }
);

const DEFAULT_VIDEO_ID = 715502900;

type Props = {
    resume: TierlistResumeResponse;
}

const HomeView = ({ resume }: Props): JSX.Element => {
    const vimeo = useVimeoModal();
    const { t } = useTranslation("home");

    return (
        <>
            <Container className="!mt-0 lg:!mt-8" isFirst>
                <FlowersFirstScreen />
                <Hero
                    t={ t }
                    handleOpenVideoModal={ () => vimeo.openModal('715502900') }
                />
            </Container>
            <Container className="!mt-10 lg:!mt-32">
                <Results
                    lTests={ resume.latest_l_tests }
                    hTests={ resume.latest_h_tests }
                    t={ t }
                />
            </Container>
            <Container className="!mt-32 lg:!mt-52">
                <TotalTests
                    totalTests={ resume.total_tests }
                    t={ t }
                />
            </Container>
            <Container className="!mt-32 lg:!mt-52">
                <p></p>
            </Container>
            <VideoModal
                vimeo={ vimeo }
                iframeSrc={`https://player.vimeo.com/video/${DEFAULT_VIDEO_ID}?h=6220f41888&title=0&byline=0&portrait=0&speed=0&badge=0&autopause=0&player_id=0&app_id=58479&controls=0`}
                t={ t }
            />
        </>
    )
}

export { HomeView }
