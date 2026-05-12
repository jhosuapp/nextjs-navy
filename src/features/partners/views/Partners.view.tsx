import type { JSX } from "react";
import { useTranslation } from "next-i18next";
import { CardWrappersecondary } from "@/shared/components/card-wrapper-secondary/CardWrapperSecondary";
import { Container } from "@/shared/components/container/Container";
import { CardPartners } from "../components/card-partners/CardPartners";
import { serversData, streamersData } from "../data";

const PartnersView = ():JSX.Element => {
    const { t } = useTranslation("partners");

    return (
        <Container className="!mt-5 lg:!mt-10" isFirst isLast>
            <CardWrappersecondary title={ t('streamers') } text={`${streamersData.length} ${ t('partners') }`} isSmallGrid key={`streamers`}>
                {streamersData.map((data)=>(
                    <CardPartners t={ t } data={ data } key={ `${data.name}-streamers` } />
                ))}
            </CardWrappersecondary>
            <CardWrappersecondary title={ t('servers') } text={`${serversData.length} ${ t('partners') }`} isSmallGrid key={`partners`}>
                {serversData.map((data)=>(
                    <CardPartners t={ t } data={ data } key={ `${data.name}-partners` } />
                ))}
            </CardWrappersecondary>
        </Container>
    )
}

export { PartnersView }