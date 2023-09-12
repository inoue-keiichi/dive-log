import Layout from "@/components/Layout";
import styles from "@/styles/Home.module.css";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Head>
        <title>Dive Log</title>
        <meta name="description" content="Let's log your diving memories!" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Component {...pageProps} />
      </main>
    </Layout>
  );
}
