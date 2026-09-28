import { useTranslation } from "next-i18next";
import { ITranslations } from "@/shared/interfaces/globals";
import { TierlistResumeResponse } from "../interfaces";
import { useResumeQuery } from "./useResume.query";

type Props = {
    initialResume: TierlistResumeResponse;
};

type HomeController = {
    t: ITranslations;
    resume: TierlistResumeResponse;
};

const useHomeController = ({ initialResume }: Props): HomeController => {
    const { t } = useTranslation("home");
    const { data: resume } = useResumeQuery(initialResume);

    return { t, resume };
};

export { useHomeController };
