import Image from 'next/image';
import { motion } from 'framer-motion';
import { useModalStore, useSkinStore } from '@/shared/stores';
import { ChipModalities, ModalWrapper, Skin3d } from '@/shared/components';

import styles from './modalUser.module.css';
import iconMedal from '@/config/assets/svg/icon-medal.svg';
import iconCrown from '@/config/assets/svg/icon-crown.svg';
import { useUserByNameQuery } from '@/shared/hooks';

const ModalUser = ():JSX.Element => {
    const setShowModal = useModalStore(state => state.setShowModal);
    const username = useSkinStore(state => state.skin);
    const user = useUserByNameQuery({ username });

    if(user.isLoading){
        return (
            <>
            </>
        )
    }

    const info = user?.data?.data;
    const games = info?.games;

    return (
        <ModalWrapper
            callBackClose={ ()=> setShowModal(false)  }
        >
            <motion.div className={ styles.modalUser__card }>
                <div className={ styles.modalUser__3d }>
                    <Image className={ styles.modalUser__crown } src={ iconCrown } alt='Icon crown' />
                    <p className={ styles.modalUser__name }>
                        <Image className={ styles.modalUser__medal } src={ iconMedal } alt='Icon medal' />
                        <span>{ username }</span>
                    </p>
                    <Skin3d username={ username } walk autoRotate={false} />
                </div>
                <div className={ styles.modalUser__info }>
                    <h3 className={ styles.modalUser__info__stats }>Stats</h3>
                    <p>
                        <span>Position:</span>
                        <span>{ info.position }</span>
                    </p>
                    <p>
                        <span>Points:</span>
                        <span>{ info.points }</span>
                    </p>
                    <p>
                        <span>Region:</span>
                        <span>{ info.region }</span>
                    </p>
                    <h3 className={ styles.modalUser__info__stats }>Tiers</h3>
                    <div className={ styles.modalUser__tier }>
                        <ChipModalities 
                            modalitie="Sword" 
                            variant="blue" 
                            modalitieImage="sword.webp" 
                            tier={ games?.sword?.tier }
                            disabled={ !games.sword }
                        />
                        <ChipModalities 
                            modalitie="Netherite pot" 
                            variant="purple" 
                            modalitieImage="netherite.webp" 
                            tier={ games?.netherite?.tier }
                            disabled={ !games.netherite }
                        />
                        <ChipModalities 
                            modalitie="Crystal" 
                            variant="pink" 
                            modalitieImage="crystal.webp" 
                            tier={ games?.crystal?.tier }
                            disabled={ !games.crystal }
                        />
                    </div>
                </div>
            </motion.div>
        </ModalWrapper>
    )
}

export { ModalUser }