export type ModalitiesVariants = 'purple' | 'pink' | 'blue';
export type ModalitieImage = 'sword.webp' | 'netherite.webp' | 'crystal.webp' | 'award.svg';
export type Modalitie = 'netherite' | 'crystal' | 'sword' | 'Overall';

export type ModalitieItem = {
    variant: ModalitiesVariants;
    modalitieImage: ModalitieImage;
    modalitie: Modalitie;
}