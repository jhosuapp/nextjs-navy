import { HomeView } from "@/features";
import { PageTransition } from "@/shared/layouts";
import Layout from "./Layout";
import { paths } from "@/shared/constants";

const HomePage = () => {
    return (
        <Layout
            title={'Navy | Servidor de Discord para tests de nivel en Minecraft'}
            description={'Navy es un servidor de Discord donde evaluamos el nivel de jugadores de Minecraft en distintas modalidades, tanto premium como no premium, mediante pruebas justas y estructuradas.'}
            textPage={'Tierlist'}
            linkPage={paths.tierlist}
        >
            <PageTransition>
                <HomeView />
            </PageTransition>
        </Layout>
    )
};

export default HomePage;
