import { CardWrappersecondary, Container } from "@/shared/components"
import { CardStaff } from "../components"

const StaffView = ():JSX.Element => {
    return (
        <Container className="!mt-5 lg:!mt-10" isFirst isLast>
            <CardWrappersecondary text="6 miembros" title="Owners">
                <CardStaff />
                <CardStaff />
                <CardStaff />
                <CardStaff />
                <CardStaff />
                <CardStaff />
            </CardWrappersecondary>
            <CardWrappersecondary text="3 miembros" title="Mods">
                <CardStaff />
                <CardStaff />
                <CardStaff />
            </CardWrappersecondary>
            <CardWrappersecondary text="3 miembros" title="Owners">
                <CardStaff />
                <CardStaff />
                <CardStaff />
            </CardWrappersecondary>
        </Container>
    )
}

export { StaffView }