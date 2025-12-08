"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCartitemsApi } from "@/api-endpoints/CartsApi";

// Context
const CartItemContext = createContext<any | undefined>(undefined);

// Provider
export function CartItemProvider({ children }: { children: ReactNode }) {
    const [cartId, setCartId] = useState<string | null>(null);

    useEffect(() => {
        const storedCartId = localStorage.getItem('cartId');
        setCartId(storedCartId);
    }, []);

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["getCartitemsData", cartId],
        queryFn: () => getCartitemsApi(`/${cartId}`),
        enabled: !!cartId,
    });

    return (
        <CartItemContext.Provider
            value={{
                cartItem: data || [],
                isAuthenticated: !!data,
                isLoading,
                refetchCart: refetch, // ⬅️ Expose refetch as `refetchCart`
            }}
        >
            {children}
        </CartItemContext.Provider>
    );
}

// Hook
export function useCartItem() {
    const context = useContext(CartItemContext);
    if (!context) {
        throw new Error("useCartItem must be used within a CartItemProvider");
    }
    return context;
}
