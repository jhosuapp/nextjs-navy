export type PartnersNetwork = {
    href: string;
    src: string;
    alt: string;
    hasTooltip?: boolean;
}

export type PartnersItem = {
    name: string;
    description: string;
    img: string;
    networks: PartnersNetwork[]
}