import { Container, CardWrappersecondary, LoaderSecondary } from "@/shared/components"
import { CardBan  } from "../components"
import { useBans } from "../hooks";

const BansView = ():JSX.Element => {
    const response = useBans();

    if(response.isLoading){
        return (
            <Container className="!mt-5 lg:!mt-10" isFirst isLast>
                <LoaderSecondary textLoader="Loading staff team"/>
            </Container>
        )
    }

    const activeBans = response?.data?.active ?? [];
    const inactiveBans = response?.data?.inactive ?? [];

    return (
        <Container className="!mt-5 lg:!mt-10" isFirst isLast>
            <CardWrappersecondary title={ `Active bans` } text={`${activeBans.length} Users`}>
                {activeBans.map((data, index)=>(
                    <CardBan 
                        key={ `${data.nick}-${index}` }
                        data={ data }
                        />
                    ))}
            </CardWrappersecondary>
            {inactiveBans.length && (
                <CardWrappersecondary title={ `Inactive bans` } text={`${inactiveBans.length} Users`}>
                    <>
                    </>
                    {/* <CardBan 
                        key={ `${data.nick}-${index}` }
                        data={ data }
                        variantStatus="inactive"
                    /> */}
                </CardWrappersecondary>
            )}
        </Container>
    )
}

export { BansView }