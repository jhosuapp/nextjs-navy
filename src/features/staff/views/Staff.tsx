import type { JSX } from "react";
import { motion } from "framer-motion";
import { CardWrappersecondary } from "@/shared/components/card-wrapper-secondary/CardWrapperSecondary"
import { Container } from "@/shared/components/container/Container"
import { CardStaff } from "../components/card-staff/CardStaff"
import { fadeInMotion } from "@/shared/motion/fadeIn.motion";
import { GroupedStaffResponse } from "../interfaces";

type Props = {
    staff: GroupedStaffResponse;
}

const StaffView = ({ staff }: Props): JSX.Element => {
    return (
        <Container className="!mt-5 lg:!mt-10" isFirst isLast>
            <motion.div {...fadeInMotion(0.5, 1)}>
                {staff.map((group) => (
                    <CardWrappersecondary
                        text={`${group.members.length} members`}
                        title={ group.role_name }
                        key={`group-${group.role_id}`}
                    >
                        {group.members.map((data) => (
                            <CardStaff data={ data } key={`${data.discord_id}-staff`} />
                        ))}
                    </CardWrappersecondary>
                ))}
            </motion.div>
        </Container>
    )
}

export { StaffView }
