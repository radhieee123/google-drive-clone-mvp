// pages/_app.tsx
import { MockAuthProvider } from "@/contexts/MockAuthContext";
import Layout from "@/components/Layout";
import type { AppProps } from "next/app";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MockAuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </MockAuthProvider>
  );
}
