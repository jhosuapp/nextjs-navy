type InformationItem = {
    min_points: number
    max_points: number
    description: string
    title: string
    img: string
    color: string
}

type InformationsPointsItem = {
    img?: boolean;
    title: string;
    high_value: number;
    low_value: number;
    color: string;
}

export const information: Record<string, InformationItem> = {
    combat_grandmaster: {
        min_points: 400,
        max_points: 1000,
        description: 'Obtained 400+ total points.',
        title: 'Combat Grandmaster',
        img: 'combat_grandmaster.webp',
        color: 'rgb(253, 224, 71)'
    },
    combat_master: {
        min_points: 250,
        max_points: 399,
        description: 'Obtained 250+ total points.',
        title: 'Combat Master',
        img: 'combat_master.webp',
        color: 'rgb(253, 224, 71)'
    },
    combat_ace: {
        min_points: 100,
        max_points: 249,
        description: 'Obtained 100+ total points.',
        title: 'Combat Ace',
        img: 'combat_ace.svg',
        color: 'rgb(253, 164, 175)'
    },
    combat_specialist: {
        min_points: 50,
        max_points: 99,
        description: 'Obtained 50+ total points.',
        title: 'Combat Specialist',
        img: 'combat_specialist.svg',
        color: 'rgb(216, 180, 254)'
    },
    combat_cadet: {
        min_points: 20,
        max_points: 49,
        description: 'Obtained 20+ total points.',
        title: 'Combat Cadet',
        img: 'combat_cadet.svg',
        color: 'rgb(196, 181, 253)'
    },
    combat_novice: {
        min_points: 10,
        max_points: 19,
        description: 'Obtained 10+ total points.',
        title: 'Combat Novice',
        img: 'combat_novice.svg',
        color: 'rgb(196, 181, 253)'
    },
    rookie: {
        min_points: 0,
        max_points: 9,
        description: 'Starting rank for players with less than 10 points.',
        title: 'Rookie',
        img: 'rookie.svg',
        color: 'rgb(209, 213, 219)'
    },
}

export const informationPoints: InformationsPointsItem[] = [
    {
        img: true,
        title: 'Tier 1',
        high_value: 60,
        low_value: 45,
        color: '#f0b857'
    },
    {
        img: true,
        title: 'Tier 2',
        high_value: 30,
        low_value: 20,
        color: '#a9b1b9'
    },
]