import { Button, CardSkin, Divider } from "@/shared/components";
import { CardWrapper } from "../card-wrapper/CardWrapper";

import icon from '@/config/assets/svg/icon-discord.svg';
import styles from './comunity.module.css';
import { Title } from "../title/Title";

const Comunity = ():JSX.Element => {
    return (
        <CardWrapper>

            {/* Comunity discord */}
            <div className={ styles.comunity__cta }>
                <Title text='¿Quieres ser testeado?' className={ styles.comunity__title } />
                <Button 
                    icon={ icon }
                    text="Unirse a Discord" style={'secondary'} 
                />
            </div>

            {/* Comunity members */}
            <div className={ styles.comunity__content }>
                <Divider />
                <Title text='Comunidad' />
                <Divider />
                <div className={ styles.comunity__item }>
                    <p>Miembros totales</p>
                    <p>5500</p>
                </div>
                <div className={ styles.comunity__item }>
                    <p>Miembros conectados</p>
                    <p>500 <span></span></p>
                </div>
            </div>

            <div className={ styles.comunity__tests }>
                <Divider />
                <Title text='Testers activos' />
                <Divider />
                <div className={ styles.comunity__tests__flex }>
                    {dummyData.map((data:any)=>(
                        <CardSkin username={ data.username } width={ 50 } height={ 150 } modalitie={ data.modalitie } variant={ data.variant } modalitieImage={ data.modalitieImage } />
                    ))}
                </div>
            </div>

        </CardWrapper>
    )
}

export const dummyData = [
    {
        username: 'makima',
        modalitie: 'Sword',
        variant: 'blue',
        modalitieImage: 'sword.webp'
    },
    {
        username: 'reze',
        modalitie: 'Netherite poth',
        variant: 'purple',
        modalitieImage: 'netherite.webp'
    },
    {
        username: 'yunaez',
        modalitie: 'Sword',
        variant: 'blue',
        modalitieImage: 'sword.webp'
    },
    {
        username: 'naruto',
        modalitie: 'Netherite poth',
        variant: 'purple',
        modalitieImage: 'netherite.webp'
    },
    {
        username: 'sasuke',
        modalitie: 'Sword',
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