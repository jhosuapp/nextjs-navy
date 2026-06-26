import Image from 'next/image';
import { memo, useState, type JSX } from 'react';
import { motion } from 'framer-motion';
import { variantsSettingsContent, variantsSettingsBg } from './settings.variants';
import { useMediaQuery } from '@/shared/hooks/useMediaquery';
import { fadeInMotion } from '@/shared/motion/fadeIn.motion';
import { Switch } from '../switch/Switch';
import { useTranslation } from 'next-i18next';
import { LanguageSwitcher } from '../language-switcher/LanguageSwitcher';

import icon from '@/config/assets/svg/icon-settings.svg';
import styles from './settings.module.css';

const Settings = memo(():JSX.Element | null => {
    const isDesk = useMediaQuery({ breakpoint: 1024 });
    const [ settings, setSettings ] = useState<boolean>(false);
    const { t } = useTranslation('common');

    const handleClick = ()=>{
        setSettings(!settings);
    }

    // On mobile the settings live inside the hamburger menu (HeaderSettings),
    // so the floating gear panel is hidden to declutter the view.
    if (!isDesk) return null;

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
                    variants={ variantsSettingsContent }
                >
                    <div className={ styles.settings__content__block }>
                        <div className={ styles.settings__item }>
                            <p>{ t('switchs.lang') }</p>
                            <LanguageSwitcher hasMobileStyle />
                        </div>
                        <Switch 
                            text={ t('switchs.lightMode') }
                            id='light_mode'
                        />
                        <Switch 
                            text={ t('switchs.disableParticles') }
                            id='disable_particles'
                        />
                        <Switch 
                            text={ t('switchs.invertColors') }
                            id='invert_colors'
                        />
                        <Switch 
                            text={ t('switchs.grayContrast') }
                            id='gray_contrast'
                        />
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
})

Settings.displayName = 'Settings';

export { Settings }