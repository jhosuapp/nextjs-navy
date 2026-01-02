import { SwiperSlide } from 'swiper/react';

import { CardSkin, SwiperWrapper } from "@/shared/components";
import { TierWrapper } from "../tier-wrapper/TierWrapper";

const TierDataByModalitie = ():JSX.Element => {

    return (
        <SwiperWrapper>
            <SwiperSlide>
                <TierWrapper
                    count={200}
                    tier={1}
                    variants="primary"
                    delay={{ enter: 0, exit: 0.6 }}
                >
                    {dummyDataThree.map((data:any, index)=>(
                        <CardSkin
                            className="!justify-between w-full !px-4 !py-3"
                            username={ data.username } 
                            width={ 50 } 
                            height={ 150 } 
                            modalitie={ data.modalitie } 
                            variant={ data.variant } 
                            modalitieImage={ data.modalitieImage } 
                            continent={ data.continent }
                            direction='row'
                            showRegions
                            showUsername
                            showModalities={false}
                            key={`${data.username}-${index}`}
                        />
                    ))}
                </TierWrapper>
            </SwiperSlide>
            <SwiperSlide>
                <TierWrapper
                    count={200}
                    tier={2}
                    variants="secondary"
                    delay={{ enter: 0.1, exit: 0.5 }}
                >
                    {dummyDataThree.map((data:any, index)=>(
                        <CardSkin
                            className="!justify-between w-full !px-4 !py-3"
                            username={ data.username } 
                            width={ 50 } 
                            height={ 150 } 
                            modalitie={ data.modalitie } 
                            variant={ data.variant } 
                            modalitieImage={ data.modalitieImage } 
                            continent={ data.continent }
                            direction='row'
                            showRegions
                            showUsername
                            showModalities={false}
                            key={`${data.username}-${index}`}
                        />
                    ))}
                </TierWrapper>
            </SwiperSlide>
            <SwiperSlide>
                <TierWrapper
                    count={200}
                    tier={3}
                    variants="tertiary"
                    delay={{ enter: 0.2, exit: 0.4 }}
                >
                    {dummyDataThree.map((data:any, index)=>(
                        <CardSkin
                            className="!justify-between w-full !px-4 !py-3"
                            username={ data.username } 
                            width={ 50 } 
                            height={ 150 } 
                            modalitie={ data.modalitie } 
                            variant={ data.variant } 
                            modalitieImage={ data.modalitieImage } 
                            continent={ data.continent }
                            direction='row'
                            showRegions
                            showUsername
                            showModalities={false}
                            key={`${data.username}-${index}`}
                        />
                    ))}
                </TierWrapper>
            </SwiperSlide>
            <SwiperSlide>
                <TierWrapper
                    count={200}
                    tier={4}
                    variants="fourth"
                    delay={{ enter: 0.3, exit: 0.3 }}
                >
                    {dummyDataThree.map((data:any, index)=>(
                        <CardSkin
                            className="!justify-between w-full !px-4 !py-3"
                            username={ data.username } 
                            width={ 50 } 
                            height={ 150 } 
                            modalitie={ data.modalitie } 
                            variant={ data.variant } 
                            modalitieImage={ data.modalitieImage } 
                            continent={ data.continent }
                            direction='row'
                            showRegions
                            showUsername
                            showModalities={false}
                            key={`${data.username}-${index}`}
                        />
                    ))}
                </TierWrapper>
            </SwiperSlide>
            <SwiperSlide>
                <TierWrapper
                    count={200}
                    tier={5}
                    variants="fifth"
                    delay={{ enter: 0.4, exit: 0.2 }}
                >
                    {dummyDataThree.map((data:any, index)=>(
                        <CardSkin
                            className="!justify-between w-full !px-4 !py-3"
                            username={ data.username } 
                            width={ 50 } 
                            height={ 150 } 
                            modalitie={ data.modalitie } 
                            variant={ data.variant } 
                            modalitieImage={ data.modalitieImage } 
                            continent={ data.continent }
                            direction='row'
                            showRegions
                            showUsername
                            showModalities={false}
                            key={`${data.username}-${index}`}
                        />
                    ))}
                </TierWrapper>
            </SwiperSlide>
        </SwiperWrapper>
    )
}


export const dummyDataThree = [
    {
        username: 'dream',
        modalitie: 'Sword',
        variant: 'blue',
        modalitieImage: 'sword.webp',
        continent: 'EU',
        variantRegions: 'green'
    },
    {
        username: 'ichigo',
        modalitie: 'Netherite poth',
        variant: 'purple',
        modalitieImage: 'netherite.webp',
        continent: 'SA',
        variantRegions: 'orange'
    },
    {
        username: 'kaneki',
        modalitie: 'Sword',
        variant: 'blue',
        modalitieImage: 'sword.webp',
        continent: 'NA',
        variantRegions: 'blue'
    },
    {
        username: 'kakashi',
        modalitie: 'Netherite poth',
        variant: 'purple',
        modalitieImage: 'netherite.webp',
        continent: 'AS',
        variantRegions: 'purple'
    },
    {
        username: 'kaneki',
        modalitie: 'Sword',
        variant: 'blue',
        modalitieImage: 'sword.webp',
        continent: 'NA',
        variantRegions: 'blue'
    },
    {
        username: 'kakashi',
        modalitie: 'Netherite poth',
        variant: 'purple',
        modalitieImage: 'netherite.webp',
        continent: 'AS',
        variantRegions: 'purple'
    },
] as any;

export { TierDataByModalitie }