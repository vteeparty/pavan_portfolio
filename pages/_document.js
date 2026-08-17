import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="Pavan Teeparty — DevOps & Cloud Engineer. 6 years building resilient AWS/Azure infrastructure, CI/CD pipelines, and Kubernetes clusters." />
        <meta name="theme-color" content="#06080d" />
        <meta property="og:title" content="Pavan Teeparty | DevOps & Cloud Engineer" />
        <meta property="og:description" content="Explore how I design, build, and operate cloud-native infrastructure at scale." />
        <meta property="og:type" content="website" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
