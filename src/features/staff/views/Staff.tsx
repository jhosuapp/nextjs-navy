import { Container } from "@/shared/components"
import { CardStaff } from "../components"

const StaffView = ():JSX.Element => {
    return (
        <Container className="!mt-5 lg:!mt-10" isFirst isLast>
            <CardStaff />
        </Container>
    )
}

export { StaffView }