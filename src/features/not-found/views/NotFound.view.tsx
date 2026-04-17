import type { JSX } from 'react';
import { FlowersFirstScreen } from '@/features/home/components/parallax/Parallax';
import { Container } from '@/shared/components/container/Container';
import { Content } from '../components';

const NotFoundView = ():JSX.Element => {
    return (
        <Container className="py-10 min-h-[calc(100svh-170px)] md:min-h-[calc(100svh-110px)] flex flex-col items-center justify-center" isFirst>
            <Content />
            <FlowersFirstScreen enableSomeFlowers={ false } />
        </Container>
    )
}


export { NotFoundView }