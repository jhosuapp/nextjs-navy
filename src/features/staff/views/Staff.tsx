import { CardWrappersecondary, Container } from "@/shared/components"
import { CardStaff } from "../components"
import { useStaff } from "../hooks";

const StaffView = ():JSX.Element => {

    const response = useStaff();

    return (
        <Container className="!mt-5 lg:!mt-10" isFirst isLast>
            {response.data?.map((group)=>(
                <CardWrappersecondary text={`${group.members.length} members`} title={ group.role_name } key={`group-${group.role_id}`}>
                    {group.members?.map((data)=>(
                        <CardStaff data={ data } />
                    ))}
                </CardWrappersecondary>
            ))}
        </Container>
    )
}

export { StaffView }