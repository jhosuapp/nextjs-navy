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
        min_points: 140,
        max_points: 1000,
        description: 'Obtained 140+ total points.',
        title: 'Legend',
        img: 'Icono_Leyenda.png',
        color: 'rgb(253, 224, 71)'
    },
    combat_master: {
        min_points: 100,
        max_points: 139,
        description: 'Obtained 100+ total points.',
        title: 'Master',
        img: 'Icono_Maestro.webp',
        color: 'rgb(253, 224, 71)'
    },
    combat_ace: {
        min_points: 50,
        max_points: 99,
        description: 'Obtained 50+ total points.',
        title: 'Expert',
        img: 'Icono_Experto.webp',
        color: 'rgb(253, 164, 175)'
    },
    combat_specialist: {
        min_points: 25,
        max_points: 49,
        description: 'Obtained 25+ total points.',
        title: 'Veteran',
        img: 'Icono_Veterano.webp',
        color: 'rgb(216, 180, 254)'
    },
    combat_novice: {
        min_points: 10,
        max_points: 24,
        description: 'Obtained 10+ total points.',
        title: 'Apprentice',
        img: 'Icono_Aprendiz.webp',
        color: 'rgb(196, 181, 253)'
    },
    rookie: {
        min_points: 0,
        max_points: 9,
        description: 'Starting rank for players with less than 10 points.',
        title: 'Novice',
        img: 'Icono_Novato.webp',
        color: 'rgb(209, 213, 219)'
    },
}

export const informationPoints: InformationsPointsItem[] = [
    {
        img: true,
        title: 'Tier 1',
        high_value: 70,
        low_value: 50,
        color: '#f0b857'
    },
    {
        img: true,
        title: 'Tier 2',
        high_value: 40,
        low_value: 30,
        color: '#a9b1b9'
    },
    {
        img: true,
        title: 'Tier 3',
        high_value: 20,
        low_value: 10,
        color: '#d59161'
    },
    {
        img: true,
        title: 'Tier 4',
        high_value: 7,
        low_value: 5,
        color: '#b1c0cc'
    },
    {
        img: true,
        title: 'Tier 5',
        high_value: 2,
        low_value: 1,
        color: '#b1c0cc'
    },
]