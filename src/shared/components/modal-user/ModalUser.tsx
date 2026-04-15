import type { JSX } from "react";
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChipModalities, ModalWrapper, Skin3d } from '@/shared/components';

import styles from './modalUser.module.css';
import iconMedal from '@/config/assets/svg/icon-medal.svg';
import iconCrown from '@/config/assets/svg/icon-crown.svg';
import { useModalUser } from '@/shared/hooks';
import { CrownIcon, MedalIcon } from '@/config/assets/icon';
import { TierlistUser } from "@/features/tierlist/interfaces";


const ModalUser = ():JSX.Element => {

    const { 
        setShowModal,
        username,
        user,
        info,
        games,
        t
    } = useModalUser();

    if(user.isLoading || user?.data?.data == null){
        return (
            <>
            </>
        )
    }

    const { position, points, region } = info as TierlistUser;
    const isTop = position <= 3;
    const colorsPositions = ['#facc15', '#9ca3af', '#fb923c'];

    return (
        <ModalWrapper
            callBackClose={ ()=> setShowModal(false)  }
        >
            <motion.div className={ styles.modalUser__card }>
                <div className={ styles.modalUser__3d }>
                    {isTop ? (
                        <CrownIcon />
                    ) : (
                        <Image className={ styles.modalUser__crown } src={ iconCrown } alt='Icon crown' />
                    )}
                    <p className={ styles.modalUser__name }>
                        {isTop ? (
                            <MedalIcon className={ styles.modalUser__medal } fill={colorsPositions[position - 1] ?? 'white'} />
                        ) : (
                            <Image className={ styles.modalUser__medal } src={ iconMedal } alt='Icon medal' />
                        )}
                        <span>{ username }</span>
                    </p>
                    <Skin3d username={ username } walk autoRotate={false} />
                </div>
                <div className={ styles.modalUser__info }>
                    <h3 className={ styles.modalUser__info__stats }>{t('modal.stats')}</h3>
                    <p>
                        <span>{t('modal.position')}:</span>
                        <span>{ position }</span>
                    </p>
                    <p>
                        <span>{t('modal.points')}:</span>
                        <span>{ points }</span>
                    </p>
                    <p>
                        <span>{t('modal.region')}:</span>
                        <span>{ region }</span>
                    </p>
                    <h3 className={ styles.modalUser__info__stats }>Tiers</h3>
                    <div className={ styles.modalUser__tier }>
                        <ChipModalities 
                            modalitie="sword" 
                            variant="blue" 
                            modalitieImage="sword.webp" 
                            tier={ games?.sword?.tier }
                            disabled={ !games?.sword }
                        />
                        <ChipModalities 
                            modalitie="netherite" 
                            variant="purple" 
                            modalitieImage="netherite.webp" 
                            tier={ games?.netherite?.tier }
                            disabled={ !games?.netherite }
                        />
                        <ChipModalities 
                            modalitie="crystal" 
                            variant="pink" 
                            modalitieImage="crystal.webp" 
                            tier={ games?.crystal?.tier }
                            disabled={ !games?.crystal }
                        />
                    </div>
                </div>
            </motion.div>
        </ModalWrapper>
    )
}

export { ModalUser }