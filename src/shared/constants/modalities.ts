import { ModalitieItem } from "../interfaces/modalities.interface";

export const modalities: Record<string, ModalitieItem> = {
    netherite: {
        variant: 'purple',
        modalitie: 'Netherite pot',
        modalitieImage: 'netherite.webp',
    },
    crystal: {
        variant: 'pink',
        modalitie: 'Crystal',
        modalitieImage: 'crystal.webp'
    },
    sword: {
        variant: 'blue',
        modalitie: 'Sword',
        modalitieImage: 'sword.webp'
    }
}