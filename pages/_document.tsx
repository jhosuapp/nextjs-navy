import Document, { Html, Head, Main, NextScript } from 'next/document';
import { minecraft, roboto, blockletter, aeonik } from '@/config/typography';

class MyDocument extends Document {
  render() {
    const { locale } = this.props.__NEXT_DATA__ || { locale: 'es' };

    console.log(locale);

    return (
      <Html 
        lang={locale} 
        className={`${minecraft.variable} ${roboto.variable} ${blockletter.variable} ${aeonik.variable}`}
      >
        <Head />
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