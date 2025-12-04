import Image from 'next/image';
import { motion } from 'framer-motion';
import { useModalStore, useSkinStore } from '@/shared/stores';
import { ChipModalities, ModalWrapper, Skin3d } from '@/shared/components';

import styles from './modalUser.module.css';
import iconMedal from '@/config/assets/svg/icon-medal.svg';
import iconCrown from '@/config/assets/svg/icon-crown.svg';

const ModalUser = ():JSX.Element => {
    const setShowModal = useModalStore(state => state.setShowModal);
    const userName = useSkinStore(state => state.skin);

    return (
        <ModalWrapper
            callBackClose={ ()=> setShowModal(false)  }
        >
            <motion.div className={ styles.modalUser__card }>
                <div className={ styles.modalUser__3d }>
                    <Image className={ styles.modalUser__crown } src={ iconCrown } alt='Icon crown' />
                    <p className={ styles.modalUser__name }>
                        <Image className={ styles.modalUser__medal } src={ iconMedal } alt='Icon medal' />
                        <span>{ userName }</span>
                    </p>
                    <Skin3d username={ userName } walk autoRotate={false} />
                </div>
                <div className={ styles.modalUser__info }>
                    <h3 className={ styles.modalUser__info__stats }>Stats</h3>
                    <p>
                        <span>Posición:</span>
                        <span>1234</span>
                    </p>
                    <p>
                        <span>Puntos:</span>
                        <span>123</span>
                    </p>
                    <p>
                        <span>Región:</span>
                        <span>SA</span>
                    </p>
                    <h3 className={ styles.modalUser__info__stats }>Tiers</h3>
                    <div className={ styles.modalUser__tier }>
                        <ChipModalities 
                            modalitie="Sword" 
                            variant="blue" 
                            modalitieImage="sword.webp" 
                            tier={ 'lt1' }
                            />
                        <ChipModalities 
                            modalitie="Netherite pot" 
                            variant="purple" 
                            modalitieImage="netherite.webp" 
                            tier={ 'lt4' }
                            />
                        <ChipModalities 
                            modalitie="Crystal" 
                            variant="pink" 
                            modalitieImage="crystal.webp" 
                            tier={ 'lt5' }
                        />
                    </div>
                </div>
            </motion.div>
        </ModalWrapper>
    )
}

export { ModalUser }