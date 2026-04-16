import type { JSX } from "react";
import { motion } from 'framer-motion';
import { Button } from "@/shared/components/button/Button";
import { ChipModalities } from "@/shared/components/chip-modalities/ChipModalities";
import { InputField } from "@/shared/components/input-field/InputField";
import { useNavBar } from "../../hooks";
import { zoomInMotion } from '@/shared/motion/zoomIn.motion';
import { NavBarInformation } from './NavBarInformation';
import { ITranslations } from '@/shared/interfaces/globals';

import styles from './navBar.module.css';
import icon from '@/config/assets/svg/icon-search.svg';

type Props = {
    t: ITranslations;
}

const NavBar = ({ t }:Props):JSX.Element => {
    const { setValue, value, onSubmit } = useNavBar();

    return (
        <article className={ styles.navBar }>
            <div className={ styles.navBar__btn }>
                <ChipModalities 
                    modalitie="Overall" 
                    modalitieText={ t('overall') }
                    variant="pink" 
                    modalitieImage="award.svg" 
                    isButton
                    showModalitie
                />
                <ChipModalities 
                    modalitie="sword" 
                    variant="blue" 
                    modalitieImage="sword.webp" 
                    isButton
                />
                <ChipModalities 
                    modalitie="netherite" 
                    variant="purple" 
                    modalitieImage="netherite.webp" 
                    isButton
                />
                <ChipModalities 
                    modalitie="crystal" 
                    variant="pink" 
                    modalitieImage="crystal.webp" 
                    isButton
                />
            </div>
            <form className={ styles.navBar__search } onSubmit={ onSubmit }>
                <NavBarInformation t={ t } />
                <div className={ styles.navBar__search__block }>
                    <InputField  
                        placeholder={ t('search') }
                        value={ value }
                        type='search'
                        onChange={ (e)=> { setValue(e.target.value) } }
                    />
                    {value && (
                        <motion.div className={ styles.navBar__search__btn } key={`${value.length > 0}-button`} {...zoomInMotion(0,0)}>
                            <Button 
                                style={'fit'} 
                                iconRight={ icon }
                                type='submit'
                            />
                        </motion.div>
                    )}
                </div>
            </form>
        </article>
    )
}

export { NavBar }