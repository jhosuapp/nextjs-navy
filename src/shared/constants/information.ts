type InformationItem = {
    min_points: number
    max_points: number
    description: string
    title: string
    title_key: string
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
    legend: {
        min_points: 140,
        max_points: 1000,
        description: 'Obtained 140+ total points.',
        title: 'Legend',
        title_key: 'legend',
        img: 'Icono_Leyenda.png',
        color: '#6BCB8D'
    },
    master: {
        min_points: 100,
        max_points: 139,
        description: 'Obtained 100+ total points.',
        title: 'Master',
        title_key: 'master',
        img: 'Icono_Maestro.webp',
        color: '#45C5D9'
    },
    expert: {
        min_points: 50,
        max_points: 99,
        description: 'Obtained 50+ total points.',
        title: 'Expert',
        title_key: 'expert',
        img: 'Icono_Experto.webp',
        color: '#DFA5F3'
    },
    veteran: {
        min_points: 25,
        max_points: 49,
        description: 'Obtained 25+ total points.',
        title: 'Veteran',
        title_key: 'veteran',
        img: 'Icono_Veterano.webp',
        color: '#D6D2E0'
    },
    apprentice: {
        min_points: 10,
        max_points: 24,
        description: 'Obtained 10+ total points.',
        title: 'Apprentice',
        title_key: 'apprentice',
        img: 'Icono_Aprendiz.webp',
        color: '#F8AE3E'
    },
    novice: {
        min_points: 0,
        max_points: 9,
        description: 'Starting rank for players with less than 10 points.',
        title: 'Novice',
        title_key: 'novice',
        img: 'Icono_Novato.webp',
        color: '#F8B07E'
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