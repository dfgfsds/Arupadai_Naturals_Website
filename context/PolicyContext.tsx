"use client";
import { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { getVendorSitePoliciesApi } from "@/api-endpoints/authendication";
import { useVendor } from "./VendorContext";

const PolicyContext = createContext<any | undefined>(undefined);

export function PolicyProvider({ children }: any) {
    const { vendorId } = useVendor();

    const { data, isLoading, error } = useQuery({
        queryKey: ["getVendorSitePoliciesApi", vendorId],
        queryFn: () => getVendorSitePoliciesApi(`${vendorId}/`),
        enabled: !!vendorId
    });

    return (
        <PolicyContext.Provider
            value={{
                policy: data || [],
                isAuthenticated: !!data,
                isLoading,
                error,
            }}
        >
            {children}
        </PolicyContext.Provider>
    );
}

export function usePolicy() {
    const context = useContext(PolicyContext);
    if (context === undefined) {
        throw new Error("usePolicy must be used within a PolicyProvider");
    }
    return context;
}
