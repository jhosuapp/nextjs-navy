import { Button, CardSkin, CardWrapper, Divider } from "@/shared/components";
import { Title } from "../title/Title";

import icon from '@/config/assets/svg/icon-discord.svg';
import styles from './comunity.module.css';

const Comunity = ():JSX.Element => {
    return (
        <CardWrapper animation={{ delayInit: 0.65, delayEnd: 0.13 }}>

            {/* Comunity discord */}
            <div className={ styles.comunity__cta }>
                <Title text='Do you want to take the test?' className={ styles.comunity__title } />
                <Button 
                    onClick={ ()=> window.open('https://discord.gg/navyy') }
                    icon={ icon }
                    text="Join Discord" style={'secondary'} 
                />
            </div>

            {/* Comunity members */}
            <div className={ styles.comunity__content }>
                <Divider />
                <Title text='Community' />
                <Divider />
                <div className={ styles.comunity__item }>
                    <p>Total Members</p>
                    <p>+6500</p>
                </div>
                {/* <div className={ styles.comunity__item }>
                    <p>Miembros conectados</p>
                    <p>500 <span></span></p>
                </div> */}
            </div>

            <div className={ styles.comunity__tests }>
                <Divider />
                <Title text='Active testers' />
                <Divider />
                <div className={ styles.comunity__tests__flex }>
                    {dummyData.map((data:any, index)=>(
                        <CardSkin username={ data.username } width={ 50 } height={ 150 } modalitie={ data.modalitie } variant={ data.variant } modalitieImage={ data.modalitieImage } key={`${data.username}-${index}-${data.modalitie}`} />
                    ))}
                </div>
            </div>

        </CardWrapper>
    )
}

export const dummyData = [
    {
        username: 'YunaEz',
        modalitie: 'Sword',
        variant: 'blue',
        modalitieImage: 'sword.webp'
    },
    {
        username: 'ValeriaEz',
        modalitie: 'Netherite poth',
        variant: 'purple',
        modalitieImage: 'netherite.webp'
    },
    {
        username: 'jhosuapp',
        modalitie: 'Sword',
        variant: 'blue',
        modalitieImage: 'sword.webp'
    },
    {
        username: 'toallero',
        modalitie: 'Sword',
        variant: 'blue',
        modalitieImage: 'sword.webp'
    },
    {
        username: 'DarkD3ad',
        modalitie: 'Crystal',
        variant: 'blue',
        modalitieImage: 'sword.webp'
    },
    {
        username: 'MyTentation',
        modalitie: 'Crystal',
        variant: 'pink',
        modalitieImage: 'crystal.webp'
    },
] as any;

export { Comunity }