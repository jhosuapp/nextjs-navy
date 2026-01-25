import Document, { Html, Head, Main, NextScript } from 'next/document';
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { minecraft, roboto, blockletter, aeonik } from '@/config/typography';

class MyDocument extends Document {
  render() {

    return (
      <Html 
        className={`${minecraft.variable} ${roboto.variable} ${blockletter.variable} ${aeonik.variable} bg-tertiary`}
      >
        <Head>
          {/* Google Analytics */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-32SX28Q9K2"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-32SX28Q9K2');
            `}
          </Script>
        </Head>
        <body>
          <Main />
          <div id="portal-modal" />
          <SpeedInsights/>
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;