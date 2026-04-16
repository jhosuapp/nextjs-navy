import type { JSX } from "react";
import { motion } from "framer-motion";
import { LoaderSecondary } from "@/shared/components/loader/LoaderSecondary"
import { CardWrappersecondary } from "@/shared/components/card-wrapper-secondary/CardWrapperSecondary"
import { Container } from "@/shared/components/container/Container"
import { CardStaff } from "../components"
import { useStaff } from "../hooks";
import { fadeInMotion } from "@/shared/motion/fadeIn.motion";

const StaffView = ():JSX.Element => {
    const response = useStaff();

    if(response.isLoading){
        return (
            <Container className="!mt-5 lg:!mt-10" isFirst isLast>
                <LoaderSecondary textLoader="Loading staff team"/>
            </Container>
        )
    }

    return (
        <Container className="!mt-5 lg:!mt-10" isFirst isLast>
            <motion.div {...fadeInMotion(0.5, 1)}>
                {response.data?.map((group)=>(
                    <CardWrappersecondary text={`${group.members.length} members`} title={ group.role_name } key={`group-${group.role_id}-${response.isLoading}`}>
                        {group.members?.map((data)=>(
                            <CardStaff data={ data } key={`${data.discord_id}-staff`} />
                        ))}
                    </CardWrappersecondary>
                ))}
            </motion.div>
        </Container>
    )
}

export { StaffView }