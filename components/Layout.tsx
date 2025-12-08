import Header from "./Header";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { CartItemProvider } from "@/context/CartItemContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, useEffect, useState } from "react";
import { VendorProvider } from "@/context/VendorContext";
import { CategoriesProvider } from "@/context/CategoriesContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { UserProvider } from "@/context/UserContext";
import ScrollToTop from "./ScrollToTop";
import Loading from "./Loading";
import { PolicyProvider } from "@/context/PolicyContext";
import BottomNavBar from "./BottomNavBar";
import { WishListProvider } from "@/context/WishListContext";

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const [queryClient] = useState(() => new QueryClient());
    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setShowHeader(false); // hide on scroll down
            } else {
                setShowHeader(true); // show on scroll up
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    return (
        <div className="min-h-screen custom-cursor">
            <Suspense fallback={<Loading />}>
                <QueryClientProvider client={queryClient}>
                    <VendorProvider>
                        <WishListProvider>
                            <PolicyProvider>
                                <CategoriesProvider>
                                    <ProductsProvider>
                                        <UserProvider>
                                            <CartItemProvider>
                                                <div className={`fixed w-full z-[999] transition-transform duration-300 ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
                                                    <Header />
                                                    <Navbar />
                                                </div>
                                                <main className="pt-[130px]">
                                                    {/* <Loading /> */}
                                                    {children}
                                                </main>
                                                <BottomNavBar />
                                                <Footer />
                                            </CartItemProvider>
                                        </UserProvider>
                                    </ProductsProvider>
                                </CategoriesProvider>
                            </PolicyProvider>
                        </WishListProvider>
                    </VendorProvider>
                </QueryClientProvider>
            </Suspense>
            <ScrollToTop />
        </div>
    );
}
