import Document, { Html, Head, Main, NextScript } from 'next/document';
import { minecraft, roboto, blockletter, aeonik } from '@/config/typography';

class MyDocument extends Document {
  render() {

    return (
      <Html 
        className={`${minecraft.variable} ${roboto.variable} ${blockletter.variable} ${aeonik.variable} bg-tertiary`}
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