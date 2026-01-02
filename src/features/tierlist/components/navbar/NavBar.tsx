import { Button, ChipModalities, InputField } from "@/shared/components";

import styles from './navBar.module.css';
import icon from '@/config/assets/svg/icon-search.svg';

const NavBar = ():JSX.Element => {
    return (
        <article className={ styles.navBar }>
            <div className={ styles.navBar__btn }>
                <ChipModalities 
                    modalitie="Overall" 
                    variant="pink" 
                    modalitieImage="award.svg" 
                    isButton
                    showModalitie
                />
                <ChipModalities 
                    modalitie="Sword" 
                    variant="blue" 
                    modalitieImage="sword.webp" 
                    isButton
                />
                <ChipModalities 
                    modalitie="Netherite pot" 
                    variant="purple" 
                    modalitieImage="netherite.webp" 
                    isButton
                />
                <ChipModalities 
                    modalitie="Crystal" 
                    variant="pink" 
                    modalitieImage="crystal.webp" 
                    isButton
                />
            </div>
            <div className={ styles.navBar__search }>
                <Button 
                    text="Información" style={'secondary'} 
                />
                <InputField  
                    placeholder="Search by username"
                />
                <Button 
                    style={'fit'} 
                    iconRight={ icon }
                />
            </div>
        </article>
    )
}

export { NavBar }