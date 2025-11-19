import { AuthProvider } from "@/hooks/useAuth";
import Layout from "../components/Layout";
import GlobalAnalyticsTracker from "@/components/GlobalAnalyticsTracker";
import type { AppProps } from "next/app";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Layout>
        <GlobalAnalyticsTracker />
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}
