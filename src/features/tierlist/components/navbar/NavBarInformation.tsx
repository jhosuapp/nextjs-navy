import { useState, type JSX } from "react";
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from "@/shared/components/button/Button"
import { CardWrapper } from "@/shared/components/card-wrapper/CardWrapper"
import { information, informationPoints } from "@/shared/constants";
import { fadeInMotion } from "@/shared/motion/fadeIn.motion";
import { AnglesIcon} from "@/config/assets/icon/AnglesIcon";
import { AnglesIconSecondary } from "@/config/assets/icon/AnglesIcon";
import { TrophyIcon } from "@/config/assets/icon/TrophyIcon";
import { ITranslations } from "@/shared/interfaces/globals";

import styles from './navBar.module.css';

type Props = {
    t: ITranslations;
}

const NavBarInformation = ({ t }:Props):JSX.Element => {
    const [showInfo, setShowInfo] = useState<boolean>(false);
    const [showPoints, setShowPoints] = useState<boolean>(false);

    const handleClick = () => {
        setShowInfo(!showInfo)
    }

    const handleClickPoints = (show: boolean) => {
        setShowPoints(show)
    }

    return (
        <div className={styles.navBarInformation}>
            <Button 
                text={`${showInfo ? t('information.ctaClose') : t('information.cta')} `}
                style="secondary"
                type="button"
                onClick={ handleClick }
            />

            <AnimatePresence mode="wait">
                {showInfo && (
                    <div className={styles.navBarInformation__list}>
                        <CardWrapper classNameParent={styles.navBarInformation__wrapper} isFadeUp={ false } animation={{ delayInit: 0, delayEnd: 0.6 }} key={`${showInfo}-info`}>
                            <div className="flex gap-2 rounded-full p-2 border-purple-300 border-2 border-opacity-30 mb-4">
                                <Button 
                                    text={t('information.titles')}
                                    style="primary"
                                    type="button"
                                    onClick={ ()=> handleClickPoints(false) }
                                    isSmall
                                    className={ `${!showPoints && '!bg-secondary pointer-events-none'}` }
                                />
                                <Button 
                                    text={t('information.points')}
                                    style="primary"
                                    type="button"
                                    onClick={ ()=> handleClickPoints(true) }
                                    isSmall
                                    className={ `${showPoints && '!bg-secondary pointer-events-none'}` }
                                />
                            </div>
                            {showPoints ? (
                                <>
                                    {informationPoints.map((data, index)=>(
                                        <motion.div 
                                            className={ styles.navBarInformationPoints__item } 
                                            {...fadeInMotion(index * 0.25, index * 0.1)} 
                                            key={`points-${data.title}`}
                                        >
                                            <div className={ styles.navBarInformationPoints__block }>
                                                {data.img && (
                                                    <TrophyIcon fill={ data.color } className='w-6' />
                                                )}
                                                <p 
                                                    className="text-lg font-medium"
                                                    style={{ color: data.color }}
                                                >
                                                    { data.title }
                                                </p>
                                            </div>
                                            <div style={{ borderColor: data.color }} className={ styles.navBarInformationPoints__flex }>
                                                <div 
                                                    style={{ borderColor: data.color }}
                                                    className={ styles.navBarInformationPoints__points }
                                                >
                                                    <div style={{ backgroundColor: data.color }}></div>
                                                    <AnglesIcon fill={ data.color } />
                                                    <p style={{ color: data.color }}>{data.high_value} {t('information.points')}</p>
                                                </div>
                                                <div 
                                                    style={{ borderColor: data.color }}
                                                    className={ styles.navBarInformationPoints__points }
                                                >
                                                    <div style={{ backgroundColor: data.color }}></div>
                                                    <AnglesIconSecondary fill={ data.color } />
                                                    <p style={{ color: data.color }}>{data.low_value} {t('information.points')}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </>
                            ) : (
                                <>
                                    {Object.values(information).map((item, index) => (
                                        <motion.div
                                            key={item.title}
                                            className={styles.navBarInformation__item}
                                            style={{ borderColor: item.color }}
                                            {...fadeInMotion(index * 0.25, index * 0.1)}
                                        >
                                            <div className={ styles.navBarInformation__title }>
                                                <img
                                                    src={`/images/${item.img}`}
                                                    alt={item.title}
                                                    className={styles.image}
                                                />
        
                                                <h3 style={{ color: item.color }}>
                                                    {t(`information.${item.title_key}.title`)}
                                                </h3>
                                            </div>
        
                                            <p>{t(`information.${item.title_key}.description`)}</p>
                                        </motion.div>
                                    ))}
                                </>
                            )}
              
                        </CardWrapper>
                    </div>
                )}
            </AnimatePresence>
            
        </div>
    )
}

export { NavBarInformation }