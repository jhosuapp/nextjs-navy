import { minecraft, roboto, blockletter, aeonik } from "@/config/typography";
import Head from "next/head";
import React, { ReactNode } from "react";
import { Cursor, Particles } from "@/shared/components";
import { Header } from "@/shared/layouts";

type Props = {
  children?: ReactNode;
  title: string;
  description: string;
  url?: string;
  image?: string;
  isDark?: boolean;
  isDarkBg?: boolean;
  textPage: string;
  linkPage: string;
};


const Layout = ({ children, title, description, image = '', url = "https://www.navy.com", isDark, isDarkBg, textPage, linkPage }: Props) => (
    <>
        <Head>
            <title>{title}</title>
            <meta charSet="utf-8" />
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <meta name="description" content={description} />
            <meta name="keywords" content="minecraft pvp, servidor minecraft, navy, minecraft en español, kitpvp, practice, combate minecraft" />
            <meta name="author" content="Navy" />
            <link rel="canonical" href={url} />
            
            {/* Open Graph */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={image} />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            <meta name="robots" content="index, follow" />
            <meta name="theme-color" content="#1e1e1e" />
        </Head>

        <Cursor />


        <Header />

        <main className={`relative ${aeonik.variable} ${minecraft.variable} ${roboto.variable} ${blockletter.variable} bg-tertiary min-h-svh pt-10`}>
            <Particles />
            {children}
        </main>

    </>
);

export default Layout;