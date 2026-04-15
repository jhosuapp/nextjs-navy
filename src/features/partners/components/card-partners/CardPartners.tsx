import { memo, useState, type JSX } from "react";
import Image from "next/image";
import { CardWrapper } from "@/shared/components/card-wrapper/CardWrapper";
import { PartnersItem } from "../../interface";
import { ITranslations } from "@/shared/interfaces/globals";

import styles from './cardPartners.module.css';

type Props = {
    data: PartnersItem;
    t: ITranslations;
}

const CardPartners = memo(({ data, t }: Props): JSX.Element => {
    const [copiedHref, setCopiedHref] = useState<string | null>(null);

    const handlerCopy = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        navigator.clipboard.writeText(href);
        setCopiedHref(href);
        setTimeout(() => {
            setCopiedHref(null);
        }, 3000);
    };

    return (
        <CardWrapper classNameParent={styles.cardPartners}>
            <div className={styles.cardPartners__content}>
                <div className={styles.cardPartners__image}>
                    <picture>
                        <Image 
                            src={data.img} 
                            alt={data.name} 
                            width={96}
                            height={96}
                            sizes="96px"
                        />
                    </picture>
                </div>
                <div className={styles.cardPartners__info}>
                    <h3>{data.name}</h3>
                    <p>{t(data.description)}</p>
                </div>
                <div className={styles.cardPartners__networks}>
                    {data.networks.map((network) => (
                        <a
                            key={network.href}
                            href={network.href}
                            target="_blank"
                            onClick={(e) => network.hasTooltip && handlerCopy(e, network.href)}
                            rel="noopener noreferrer"
                        >
                            {network.hasTooltip && (
                                <div className={styles.cardPartners__tooltip}>
                                    {copiedHref === network.href
                                        ? t('card.ipCopied')
                                        : t('card.copyIp')
                                    }
                                </div>
                            )}
                            <Image 
                                src={network.src} 
                                alt={network.alt} 
                                width={20} 
                            />
                        </a>
                    ))}
                </div>
            </div>
        </CardWrapper>
    );
});

export { CardPartners }