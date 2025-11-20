export type ModalitiesVariants = 'purple' | 'pink' | 'blue';
export type ModalitieImage = 'sword.webp' | 'netherite.webp' | 'crystal.webp';
export type Modalitie = 'Netherite pot' | 'Crystal' | 'Sword';

export type ModalitieItem = {
    variant: ModalitiesVariants;
    modalitieImage: ModalitieImage;
    modalitie: Modalitie;
}