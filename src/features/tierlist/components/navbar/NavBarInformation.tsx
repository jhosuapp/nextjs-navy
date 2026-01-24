import { useState } from "react";
import { AnimatePresence, motion } from 'framer-motion';
import { Button, CardWrapper } from "@/shared/components"
import { information, informationPoints } from "@/shared/constants";


import styles from './navBar.module.css';
import { fadeInMotion } from "@/shared/motion";
import Image from "next/image";
import { AnglesIcon, AnglesIconSecondary, TrophyIcon } from "@/config/assets/icon";

const NavBarInformation = ():JSX.Element => {
    const [showInfo, setShowInfo] = useState<boolean>(false);

    const handleClick = () => {
        setShowInfo(!showInfo)
    }

    return (
        <div className={styles.navBarInformation}>
            <Button 
                text={`${showInfo ? 'Close' : 'Information'} `}
                style="secondary"
                type="button"
                onClick={ handleClick }
            />

            <AnimatePresence mode="wait">
                {showInfo && (
                    <div className={styles.navBarInformation__list}>
                        <CardWrapper classNameParent={styles.navBarInformation__wrapper} isFadeUp={ false } animation={{ delayInit: 0, delayEnd: 0.6 }} key={`${showInfo}-info`}>
                            {/* {Object.values(information).map((item, index) => (
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
                                            {item.title}
                                        </h3>
                                    </div>

                                    <p>{item.description}</p>
                                </motion.div>
                            ))} */}
                            {informationPoints.map((data)=>(
                                <div className={ styles.navBarInformationPoints__item }>
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
                                            <p style={{ color: data.color }}>{data.high_value} Points</p>
                                        </div>
                                        <div 
                                            style={{ borderColor: data.color }}
                                            className={ styles.navBarInformationPoints__points }
                                        >
                                            <div style={{ backgroundColor: data.color }}></div>
                                            <AnglesIconSecondary fill={ data.color } />
                                            <p style={{ color: data.color }}>{data.low_value} Points</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardWrapper>
                    </div>
                )}
            </AnimatePresence>
            
        </div>
    )
}

export { NavBarInformation }