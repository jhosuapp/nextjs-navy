import { CardSkin } from "@/shared/components";
import { CardWrapper } from "../card-wrapper/CardWrapper";

import iconSecondary from '@/config/assets/svg/icon-angle-up-solid-full.svg';
import icon from '@/config/assets/svg/icon-angles-up-solid-full.svg';
import { Chip } from "../chip/Chip";

const Results = ():JSX.Element => {
    return (
        <>
            <CardWrapper 
                title="HIGH RESULTS" 
                icon={ icon }
                animation={{ delayInit: 0.65, delayEnd: 0.13 }}
                className="flex flex-col gap-4"
            >
                <Chip text="Última publicaciones" />
                {dummyDataTwo.map((data:any, index)=>(
                    <CardSkin 
                        username={ data.username } 
                        width={ 50 } 
                        height={ 150 } 
                        modalitie={ data.modalitie } 
                        variant={ data.variant } 
                        modalitieImage={ data.modalitieImage } 
                        continent={ data.continent }
                        variantRegions={ data.variantRegions }
                        direction='row'
                        showUsername
                        showRegions
                        key={`${data.username}-${index}`}
                    />
                ))}
            </CardWrapper>
            <CardWrapper 
                title="LOW RESULTS" 
                icon={ iconSecondary } 
                animation={{ delayInit: 0.67, delayEnd: 0.13 }}
                className="flex flex-col gap-4"
            >
                <Chip text="Última publicaciones" />
                {dummyDataTwo.map((data:any, index)=>(
                    <CardSkin 
                        username={ data.username } 
                        width={ 50 } 
                        height={ 150 } 
                        modalitie={ data.modalitie } 
                        variant={ data.variant } 
                        modalitieImage={ data.modalitieImage } 
                        continent={ data.continent }
                        variantRegions={ data.variantRegions }
                        direction='row'
                        showUsername
                        showRegions
                        key={`${data.username}-${index}-${data.continent}`}
                    />
                ))}
            </CardWrapper>
        </>
    )
}

export const dummyDataTwo = [
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
] as any;

export { Results }