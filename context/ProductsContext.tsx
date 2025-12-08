"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { getProductApi } from "../api-endpoints/products";
import { useQuery } from "@tanstack/react-query";
import { useVendor } from "./VendorContext";

interface ProductsContextType {
  products: { data: any[] };
  isAuthenticated: boolean;
  isLoading: boolean;
}

const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined
);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const { vendorId } = useVendor();

  const { data, isLoading }: any = useQuery({
    queryKey: ["getProductData", vendorId],
    queryFn: () => getProductApi(`?vendor_id=${vendorId}`),
    enabled: !!vendorId,
  });


  const [products, setProducts] = useState<{ data: any }>({ data: [] });

  React.useEffect(() => {
    if (data) {
      // filter status === true
      const activeProducts = Array.isArray(data?.data)
        ? data?.data?.filter((item: any) => item?.status === true)
        : [];
      setProducts({ data: activeProducts });
    }
  }, [data]);



  return (
    <ProductsContext.Provider
      value={{
        products,
        isAuthenticated: products.data.length > 0,
        isLoading,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}

