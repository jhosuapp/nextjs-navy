import type { JSX } from "react";
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

const StaffView = ({ staff }: Props): JSX.Element => {
    const { t, locale, groups, onlineIds, onlineCount } = useStaffController(staff);

    return (
        <Container className="!mt-5 lg:!mt-10" isFirst isLast>
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
