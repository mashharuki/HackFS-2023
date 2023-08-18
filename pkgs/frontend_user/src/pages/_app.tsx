import Footer from '@/Components/common/Footer';
import Header from '@/Components/common/Header';
import '@/css/App.css';
import "@/css/index.css";
import { createPolybaseObject } from "@/utils/polybase";
import { PolybaseProvider } from "@polybase/react";
import { AppProps } from "next/app";


/**
 * App Component
 */
export default function App({ Component, pageProps }: AppProps) {
  // create polybase object
  const polybase = createPolybaseObject();

  return (
    <PolybaseProvider polybase={polybase}>
      <Header/>
      <Component {...pageProps} />
      <Footer/>
    </PolybaseProvider>
  );
}