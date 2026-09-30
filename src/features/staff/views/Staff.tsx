import { useSyncExternalStore, type JSX } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { CardWrappersecondary } from "@/shared/components/card-wrapper-secondary/CardWrapperSecondary"
import { Container } from "@/shared/components/container/Container"
import { CardStaff } from "../components/card-staff/CardStaff"
import { fadeInMotion } from "@/shared/motion/fadeIn.motion";
import { useStaffController } from "../hooks";
import { GroupedStaffResponse } from "../interfaces";

import styles from './staff.module.css';

type Props = {
    staff: GroupedStaffResponse;
}

const subscribeNoop = (): (() => void) => () => {};

const StaffView = ({ staff }: Props): JSX.Element => {
    const isClient = useSyncExternalStore(subscribeNoop, () => true, () => false);
    const { t, locale, groups, onlineIds, onlineCount, playerHostRef, playerState, prepareSong, toggleSong, stopSong } = useStaffController(staff);

    return (
        <Container className="!mt-5 lg:!mt-10" isFirst isLast>
            {/* Reproductor de Spotify oculto; lo controlan los chips de canción de las cards.
                Va en un portal a <body>: con un ancestro con `transform` (animaciones de
                página) `position: fixed` dejaría de ser relativo a la pantalla y Chrome
                congelaría el iframe al quedar fuera de ella. */}
            {isClient && createPortal(
                <div ref={ playerHostRef } className={ styles.staff__player } aria-hidden="true" />,
                document.body
            )}
            {onlineCount > 0 && (
                <motion.p className={ styles.staff__online } {...fadeInMotion(0.3, 0)} role="status">
                    <span aria-hidden="true" />
                    { t('onlineNow', { count: onlineCount }) }
                </motion.p>
            )}
            <motion.div {...fadeInMotion(0.5, 1)}>
                {groups.map((group) => (
                    <CardWrappersecondary
                        text={ t('members', { count: group.members.length }) }
                        title={ group.role_name }
                        key={`group-${group.role_name}`}
                    >
                        {group.members.map((data) => (
                            <CardStaff
                                data={ data }
                                isOnline={ onlineIds.has(data.discord_id) }
                                songState={ data.song && playerState.trackId === data.song.id ? playerState : null }
                                onPrepareSong={ prepareSong }
                                onToggleSong={ toggleSong }
                                onStopSong={ stopSong }
                                locale={ locale }
                                t={ t }
                                key={`${data.discord_id}-staff`}
                            />
                        ))}
                    </CardWrappersecondary>
                ))}
            </motion.div>
        </Container>
    )
}

export { StaffView }
