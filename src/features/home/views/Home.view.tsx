import { Container } from "@/shared/components";
import { CardWrapper, PlayerHover } from "../components";
import icon from '@/config/assets/svg/icon-angles-up-solid-full.svg';

const HomeView = ():JSX.Element => {
    return (
        <Container className="!mt-10" isFirst>
            <div className="flex">
                <CardWrapper 
                    title="HIGH RESULTS" 
                    icon={ icon }
                    animation={{ delayInit: 0.65, delayEnd: 0.13 }}
                >
                    <p>HIGH RESULTS</p>
                </CardWrapper>
                <PlayerHover />
                <CardWrapper 
                    title="LOW RESULTS" 
                    icon={ icon } 
                    animation={{ delayInit: 0.67, delayEnd: 0.13 }}
                >
                    <p>LOW RESULTS</p>
                </CardWrapper>
            </div>
        </Container>
    )
}

export { HomeView }