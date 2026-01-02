export const REGION_VARIANT_BY_CONTINENT = {
    EU: "green",
    SA: "orange",
    AS: "blue",
    NA: "purple",
} as const  

export type Continents = keyof typeof REGION_VARIANT_BY_CONTINENT
export type RegionsVariants =
  (typeof REGION_VARIANT_BY_CONTINENT)[Continents]