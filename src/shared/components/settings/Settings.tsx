import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { variantsSettingsContent, variantsSettingsBg, variantsSettingsContentMobile } from './variants';
import { useMediaQuery } from '@/shared/hooks';
import { fadeInMotion } from '@/shared/motion';

import icon from '@/config/assets/svg/icon-settings.svg';
import styles from './settings.module.css';

const Settings = ():JSX.Element => {
    const isDesk = useMediaQuery({breakpoint: 991 });
    const [ settings, setSettings ] = useState<boolean>(false);

    const handleClick = ()=>{
        setSettings(!settings);
    }

    return (
        <motion.div {...fadeInMotion(1, 0)}>
            <motion.section 
                className={`${styles.settings} ${settings ? styles.open : styles.closed}`}
                animate={settings ? "open" : "closed"}
                key={'static'}
            >
                {/* Content settings */}
                <motion.article
                    className={ styles.settings__content }
                    variants={ isDesk ? variantsSettingsContent : variantsSettingsContentMobile }
                >
                    <div className={ styles.settings__content__block }>
                        {/* <Switch 
                            text='Dark mode'
                            id='dark_mode'
                        /> */}
                    </div>
                </motion.article>
                {/* Settings */}
                <motion.article
                    className={ styles.settings__handler }
                    onClick={ handleClick }
                >
                    <Image src={ icon } alt='settings' />
                </motion.article>
                {/* Bg */}
                <motion.article
                    className={ styles.settings__bg }
                    onClick={ handleClick }
                    variants={ variantsSettingsBg }
                >
                </motion.article>
            </motion.section>
        </motion.div>
    )
}

export { Settings }