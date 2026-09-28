export type LegalDoc = 'tyc' | 'pdp';

export type LegalSection = {
    /** Sufijo de la clave i18n: `<doc>.sections.<id>` */
    id: string;
    /** Número de párrafos (`.p1` … `.pN`) que tiene la sección */
    paragraphs: number;
    /** Número de viñetas opcionales (`.items.item1` … `.itemN`) */
    items?: number;
};
