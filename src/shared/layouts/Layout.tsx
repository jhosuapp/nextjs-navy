import { ReactNode } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { roboto } from "@/config/typography";
import { Footer, Header } from "@/shared/layouts";
import { useUserInteraction } from "@/shared/hooks/useUserInteraction";

const ChatBotView = dynamic(() => import('@/features/chat-bot/views/ChatBot.view').then(mod => mod.ChatBotView), { ssr: false } );
const FloatingDots = dynamic(() => import('@/shared/components/floating-dots/FloatingDots').then(mod => mod.FloatingDots), { ssr: false });
const Settings = dynamic(() => import('@/shared/components/settings/Settings').then(mod => mod.Settings), { ssr: false });
const Cursor = dynamic(() => import('@/shared/components/cursor/Cursor').then(mod => mod.Cursor), { ssr: false });

type Props = {
  children?: ReactNode;
  title: string;
  description: string;
  url?: string;
  image?: string;
  textPage: string;
  linkPage: string;
  enableBot?: boolean;
  hasNoIndex?: boolean;
};


const Layout = ({ 
    children, 
    title, 
    description, 
    image = '', 
    url = "https://navytiers.com/images/og-image.png", 
    textPage, 
    linkPage,
    enableBot = true,
    hasNoIndex = false,
}: Props) => {
    const shouldLoadChat = useUserInteraction();

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta name="description" content={description} />
                <meta name="keywords" content="minecraft pvp tier list, minecraft practice server, navy minecraft, minecraft rankings, kitpvp tierlist" />
                <meta name="author" content="Navy" />
                <link rel="canonical" href={`https://navytiers.com${url}`} />
                
                {/* Open Graph */}
                <meta property="og:locale" content="es_ES" />
                <meta property="og:site_name" content="Navy" />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={`https://navytiers.com${url}`} />
                <meta property="og:image" content={image} />
                <meta property="og:image:alt" content="Navy Minecraft PvP Tier List" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={image} />

                {hasNoIndex ? (
                    <meta name="robots" content="noindex, follow" />
                ) : (
                    <meta name="robots" content="index, follow" />
                )}
                
                <meta name="theme-color" content="#1e1e1e" />
                <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    "name": "Navy",
                    "url": `https://navytiers.com${url}`
                })}
                </script>
            </Head>


            <main className={`relative ${roboto.variable} bg-tertiary pt-10 w-full block`}>
                <FloatingDots />
                <div className="relative z-10 w-full block">
                    <Cursor />
                    <div className="relative z-20 w-full block">
                        <Header />
                        {children}
                    </div>
                </div>
            </main>

            {enableBot && <ChatBotView />}
            <Settings />

            <Footer textPage={ textPage } linkPage={ linkPage } />
        </>
    )
};

export default Layout;