import "@/styles/globals.css";
import Head from "next/head";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CategoriesProvider } from "@/context/CategoriesContext";
import { UserProvider } from "@/context/UserContext";
import { CartItemProvider } from "@/context/CartItemContext";
import { ProductsProvider } from "@/context/ProductsContext";
import Layout from "@/components/Layout";
import { VendorProvider } from "@/context/VendorContext";
import type { AppProps } from "next/app";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AnimatedCursor from "@/components/AnimatedCursor";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Loading from "@/components/Loading";
import { useRouter } from "next/router";
import FloatingCallButton from "@/components/FloatingCallButton";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    const applyClickEffect = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches("button, a, .custom-cursor")) {
        target.classList.add("cursor-click");
        setTimeout(() => {
          target.classList.remove("cursor-click");
        }, 200);
      }
    };

    document.addEventListener("mousedown", applyClickEffect);
    return () => {
      document.removeEventListener("mousedown", applyClickEffect);
    };
  }, []);

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
    <>
      <Layout>
        {/* <AnimatedCursor /> */}
        {isLoading && <Loading />}
        <Component {...pageProps} />
           <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            style: { background: 'green', color: '#fff' },
          },
          error: {
            style: { background: 'red', color: '#fff' },
          },
        }}
      />
        <FloatingCallButton />
        <FloatingWhatsApp />
      </Layout>
    </>
  );
}
