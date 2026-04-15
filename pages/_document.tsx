import Document, { Html, Head, Main, NextScript } from 'next/document';
import Script from "next/script";
import { roboto } from '@/config/typography';

class MyDocument extends Document {
  render() {

    return (
      <Html 
        className={`${roboto.variable} bg-tertiary`}
        lang='es'
      >
        <Head>
          {/* <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-32SX28Q9K2"
            strategy="lazyOnload"
          />
          <Script id="google-analytics" strategy="lazyOnload">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-32SX28Q9K2');
            `}
          </Script> */}
        </Head>
        <body>
          <Main />
          <div id="portal-modal" />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;