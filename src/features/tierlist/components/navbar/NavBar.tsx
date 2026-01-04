import { motion } from 'framer-motion';
import { Button, ChipModalities, InputField } from "@/shared/components";
import { userNavBar } from "../../hooks";
import { zoomInMotion } from '@/shared/motion';

import styles from './navBar.module.css';
import icon from '@/config/assets/svg/icon-search.svg';
import { NavBarInformation } from './NavBarInformation';

const NavBar = ():JSX.Element => {
    const { setValue, value, onSubmit } = userNavBar();

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
            <form className={ styles.navBar__search } onSubmit={ onSubmit }>
                <NavBarInformation />
                <div className={ styles.navBar__search__block }>
                    <InputField  
                        placeholder="Search by username"
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