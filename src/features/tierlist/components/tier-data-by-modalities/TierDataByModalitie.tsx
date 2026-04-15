import type { JSX } from "react";
import { LoaderSecondary } from "@/shared/components/loader/LoaderSecondary";
import { SwiperWrapper } from "@/shared/components/swiper-wrapper/SwiperWrapper";
import { useTierlistByModalitie } from '../../hooks/useTierlistByModalitieQuery';
import { useModalitieStore } from '@/shared/stores/modalities.store';
import { TierDataByModalitieItem } from "./TierDataByModalitieItem";
import { SwiperSlide } from "swiper/react";
import { ITranslations } from "@/shared/interfaces/globals";

type Props = {
    t: ITranslations;
}

const TierDataByModalitie = ({ t }:Props):JSX.Element | null => {
    const currentModalitie = useModalitieStore(state => state.currentModalitie);
    const tierlistByModalitie = useTierlistByModalitie();

    if (tierlistByModalitie.isLoading) {
        return <LoaderSecondary textLoader={ t('feedback.modalitieLoader') } />
    }
    
    const response = tierlistByModalitie.data;
    const filterByModalitie = response?.data;
    const data = filterByModalitie?.find(item => item.game === currentModalitie)

    if(!data){
        return null
    }

    return (
        <SwiperWrapper 
            usersNumber={ data.total_users } 
            t={ t }
            key={`${currentModalitie}-wrapper`}
        >
            <SwiperSlide key={'t1'}>
                <TierDataByModalitieItem
                    data={ data }
                    t={t}
                    currentModalitie={ currentModalitie }
                    tier='t1'
                    tierNumber={ 1 }
                    delay={{ enter:0, exit:0.6 }}
                    variants="primary"
                />
            </SwiperSlide>
            <SwiperSlide key={'t2'}>
                <TierDataByModalitieItem
                    data={ data }
                    t={t}
                    currentModalitie={ currentModalitie }
                    tier='t2'
                    tierNumber={ 2 }
                    delay={{ enter:0.1, exit:0.5 }}
                    variants="secondary"
                />
            </SwiperSlide>
            <SwiperSlide key={'t3'}>
                <TierDataByModalitieItem
                    data={ data }
                    t={t}
                    currentModalitie={ currentModalitie }
                    tier='t3'
                    tierNumber={ 3 }
                    delay={{ enter:0.2, exit:0.4 }}
                    variants="tertiary"
                />
            </SwiperSlide>
            <SwiperSlide key={'t4'}>
                <TierDataByModalitieItem
                    data={ data }
                    t={t}
                    currentModalitie={ currentModalitie }
                    tier='t4'
                    tierNumber={ 4 }
                    delay={{ enter:0.3, exit:0.3 }}
                    variants="fourth"
                />
            </SwiperSlide>
            <SwiperSlide key={'t5'}>
                <TierDataByModalitieItem
                    data={ data }
                    t={t}
                    currentModalitie={ currentModalitie }
                    tier='t5'
                    tierNumber={ 5 }
                    delay={{ enter:0.4, exit:0.2 }}
                    variants="fifth"
                />
            </SwiperSlide>
        </SwiperWrapper>    
    )
}

export { TierDataByModalitie }