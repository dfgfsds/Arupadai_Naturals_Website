"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCartitemsApi } from "@/api-endpoints/CartsApi";
import { getWishlistApi } from "@/api-endpoints/products";
import { useVendor } from "./VendorContext";

// Context
const WishListContext = createContext<any | undefined>(undefined);

// Provider
export function WishListProvider({ children }: { children: ReactNode }) {
    const { vendorId }: any = useVendor();
    const [getUserId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        setUserId(storedUserId);
    }, []);

    const { data, isLoading } = useQuery({
        queryKey: ["getWishlistData", getUserId, vendorId],
        queryFn: () => getWishlistApi(`user/${getUserId}/vendor/${vendorId}`),
        enabled: !!getUserId && !!vendorId
    });



    return (
        <WishListContext.Provider
            value={{
                wishList: data || [],
                isAuthenticated: !!data,
                wishListLoading: isLoading,
            }}
        >
            {children}
        </WishListContext.Provider>
    );
}

// Hook
export function useWishList() {
    const context = useContext(WishListContext);
    if (!context) {
        throw new Error("useWishList must be used within a WishListProvider");
    }
    return context;
}
