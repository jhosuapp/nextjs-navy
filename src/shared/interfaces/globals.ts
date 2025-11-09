import { TFunction } from "i18next";
import { TargetAndTransition, VariantLabels } from "framer-motion";

export type Transalations = TFunction<"translation", undefined>;

export type PartialMotionVariants = {
    initial?: TargetAndTransition | VariantLabels | boolean;
    animate?: TargetAndTransition | VariantLabels;
    exit?: TargetAndTransition | VariantLabels;
};