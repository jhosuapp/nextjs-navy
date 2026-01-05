import { SwiperSlide } from 'swiper/react';

import { CardSkin, LoaderSecondary, SwiperWrapper } from "@/shared/components";
import { TierWrapper } from "../tier-wrapper/TierWrapper";
import { useTierlistByModalitie } from '../../hooks/useTierlistByModalitieQuery';
import { useModalitieStore } from '@/shared/stores';
import { isSummaryResponse } from '../../helpers';
import { TIERS_CONFIG } from '../../constants';

const TierDataByModalitie = ():JSX.Element => {
    const { tierlistByModalitie } = useTierlistByModalitie();
    const currentModalitie = useModalitieStore(state => state.currentModalitie);

    if (tierlistByModalitie.isLoading) {
        return <LoaderSecondary textLoader="Loading players" />
    }
    
    const response = tierlistByModalitie.data
    
    if (!response) return null
    
    if (!isSummaryResponse(response)) {
        return null
    }
    
    const filterByModalitie = response.data
    const data = filterByModalitie.find(item => item.game === currentModalitie)

    if(!data){
        return null
    }

    return (
        <SwiperWrapper usersNumber={ data.total_users } key={`${currentModalitie}-wrapper`}>
            {TIERS_CONFIG.map(({ key, tier, variant, delay }) => (
                <SwiperSlide key={key}>
                    <TierWrapper
                        count={data?.tiers?.[key]?.length ?? 0}
                        tier={tier}
                        variants={variant}
                        delay={delay}
                        key={`${currentModalitie}-tier-wrapper`}
                    >
                        {data?.tiers?.[key]?.map((item, index) => (
                            <CardSkin
                                key={`${item.nick}-${index}`}
                                className="!justify-between w-full !px-4 !py-3"
                                username={item.nick}
                                width={50}
                                height={150}
                                continent={item.region}
                                direction="row"
                                showRegions
                                showUsername
                                showModalities={false}
                            />
                        ))}
                    </TierWrapper>
                </SwiperSlide>
            ))}
        </SwiperWrapper>    
    )
}

export { TierDataByModalitie }