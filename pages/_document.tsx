import Document, { Html, Head, Main, NextScript } from 'next/document';
import { roboto } from '@/config/typography';

class MyDocument extends Document {
  render() {

    return (
      <Html 
        className={`${roboto.variable} bg-tertiary`}
        lang='es'
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