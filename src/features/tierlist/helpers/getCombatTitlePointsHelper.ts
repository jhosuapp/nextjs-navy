import { information } from "@/shared/constants";

const getCombatTitleByPoints = (points: number) => {
    const tier = Object.values(information).find(
        (item) =>
            points >= item.min_points &&
            points <= item.max_points
    )

    return {
        title: tier?.title ?? 'Novice',
        img: tier?.img ?? 'rookie.svg'
    }
}

export { getCombatTitleByPoints }