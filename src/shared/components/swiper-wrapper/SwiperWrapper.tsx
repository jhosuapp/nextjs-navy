import { ReactNode, useRef, type JSX } from 'react';
import { Swiper } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { motion } from 'framer-motion';
import { fadeInMotion } from '@/shared/motion/fadeIn.motion';
import { ITranslations } from '@/shared/interfaces/globals';

import 'swiper/css';
import 'swiper/css/navigation';

import styles from './swiperWrapper.module.css';

type Props = {
    children: ReactNode;
    usersNumber: number;
    t: ITranslations;
}

const SwiperWrapper = ({ children, usersNumber, t }:Props):JSX.Element => {
    const swiperRef = useRef<any>(null);

    return (
        <>
            <Swiper
                spaceBetween={30}
                slidesPerView={1.2}
                pagination={{ clickable: true }}
                modules={[Navigation]}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                }}
                breakpoints={{
                    640: {
                        slidesPerView: 1.2,
                    },
                    768: {
                        slidesPerView: 2.2,
                    },
                    1024: {
                        slidesPerView: 3.2,
                    },
                    1280: {
                        slidesPerView: 4.2,
                    },
                }}
            >
                { children }
            </Swiper>
            <motion.div className={ styles.swiperWrapper__navigation } {...fadeInMotion(0.6, 0)}>
                <p>{t('feedback.totalUsers', { usersNumber })}</p>
                <div>
                    <motion.button
                        whileTap={{ scale: 0.95 }} 
                        whileHover={{ scale: 1.05 }}
                        onClick={() => swiperRef.current?.slidePrev()}
                        className={ styles.swiperWrapper__navigation_btn }
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.95 }} 
                        whileHover={{ scale: 1.05 }}
                        onClick={() => swiperRef.current?.slideNext()}
                        className={ styles.swiperWrapper__navigation_btn }
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </motion.button>
                </div>
            </motion.div>
        </>
    )
}

export { SwiperWrapper }