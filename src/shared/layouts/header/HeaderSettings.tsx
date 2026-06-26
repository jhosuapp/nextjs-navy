import type { JSX } from "react";
import { useTranslation } from "next-i18next";
import { Switch } from "@/shared/components/switch/Switch";

import styles from './header.module.css';


const HeaderSettings = ():JSX.Element => {
    const { t } = useTranslation("common");

    return (
        <div className={ styles.headerSettings }>
            <p className={ styles.headerSettings__title }>{ t('switchs.title') }</p>
            <Switch text={ t('switchs.lightMode') }        id='light_mode' />
            <Switch text={ t('switchs.disableParticles') } id='disable_particles' />
            <Switch text={ t('switchs.invertColors') }     id='invert_colors' />
            <Switch text={ t('switchs.grayContrast') }     id='gray_contrast' />
        </div>
    )
}

export { HeaderSettings }
