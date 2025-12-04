import { Container } from "@/shared/components"
import { CardStaff } from "../components"
import { CardStaffWrapper } from "../components/card-staff-wrapper/CardStaffWrapper"

const StaffView = ():JSX.Element => {
    return (
        <Container className="!mt-5 lg:!mt-10" isFirst isLast>
            <CardStaffWrapper>
                <CardStaff />
                <CardStaff />
                <CardStaff />
                <CardStaff />
                <CardStaff />
                <CardStaff />
                <CardStaff />
                <CardStaff />
                <CardStaff />
                <CardStaff />
                <CardStaff />
                <CardStaff />
                <CardStaff />
                <CardStaff />
                <CardStaff />
                <CardStaff />
                <CardStaff />
            </CardStaffWrapper>
        </Container>
    )
}

export { StaffView }