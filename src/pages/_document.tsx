import NextDocument, { Html, Head, Main, NextScript } from 'next/document';

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="es-AR">
        <Head>
          <meta
            name="Description"
            content="Abaco arquitectos es una empresa dedicada al diseño y contrucción de viviendas, etc."
          />
          
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}