import React, { ReactNode } from "react";
import Head from "next/head";
import { minecraft, roboto,  } from "@/config/typography";
import { Cursor, FloatingDots, Settings } from "@/shared/components";
import { Footer, Header } from "@/shared/layouts";
import { ToastContainer } from 'react-toastify';
import { ChatBotView } from "@/features";

type Props = {
  children?: ReactNode;
  title: string;
  description: string;
  url?: string;
  image?: string;
  textPage: string;
  linkPage: string;
};


const Layout = ({ children, title, description, image = '', url = "https://navytiers.com/images/og-image.png", textPage, linkPage }: Props) => (
    <>
        <Head>
            <title>{title}</title>
            <meta charSet="utf-8" />
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <meta name="description" content={description} />
            <meta name="keywords" content="minecraft pvp tier list, minecraft practice server, navy minecraft, minecraft rankings, kitpvp tierlist" />
            <meta name="author" content="Navy" />
            <link rel="canonical" href={`https://navytiers.com${url}`} />
            <link rel="preconnect" href="https://www.youtube.com" />
            <link rel="preconnect" href="https://www.google.com" />
            <link rel="dns-prefetch" href="https://www.youtube.com" />
            <link rel="dns-prefetch" href="https://i.ytimg.com" />
            
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

            <meta name="robots" content="index, follow" />
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


        <main className={`relative ${roboto.variable} ${minecraft.variable} bg-tertiary min-h-svh pt-10 w-full block`}>
            <FloatingDots />
            <div className="relative z-10 w-full block">
                <Cursor />
                <div className="relative z-20 w-full block">
                    <Header />
                    {children}
                    <ToastContainer />
                </div>
            </div>
        </main>

        <ChatBotView />

        <Settings />

        <Footer textPage={ textPage } linkPage={ linkPage } />
    </>
);

export default Layout;