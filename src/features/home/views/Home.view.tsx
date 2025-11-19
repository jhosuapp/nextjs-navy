import { ChipRegions, Container } from "@/shared/components";
import { CardWrapper, Comunity, PlayerHover } from "../components";
import icon from '@/config/assets/svg/icon-angles-up-solid-full.svg';
import iconSecondary from '@/config/assets/svg/icon-angle-up-solid-full.svg';

const HomeView = ():JSX.Element => {
    return (
        <Container className="!mt-10" isFirst>
            <div className="flex flex-col lg:flex-row gap-10 justify-center items-center lg:items-start">
                <div className="flex-1 w-full flex flex-col gap-5">
                    <CardWrapper 
                        title="HIGH RESULTS" 
                        icon={ icon }
                        animation={{ delayInit: 0.65, delayEnd: 0.13 }}
                    >
                        <ChipRegions variant="green" continent="EU" />
                        <ChipRegions variant="purple" continent="AS" />
                    </CardWrapper>
                    <CardWrapper 
                        title="LOW RESULTS" 
                        icon={ iconSecondary } 
                        animation={{ delayInit: 0.67, delayEnd: 0.13 }}
                    >
                        <ChipRegions variant="orange" continent="SA" />
                        <ChipRegions variant="blue" continent="NA" />
                    </CardWrapper>
                </div>
                <div className="w-fit px-10 min-w-96">
                    <PlayerHover username="Yunaez" />
                </div>
                <div className="flex-1 w-full">
                    <Comunity />
                </div>
            </div>
        </Container>
    )
}

export { HomeView }