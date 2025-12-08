// context/VendorContext.tsx
'use client';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type VendorContextType = {
  vendorId: string | null;
  setVendorId: (id: string) => void;
};

const VendorContext = createContext<VendorContextType | undefined>(undefined);

export const VendorProvider = ({ children }: { children: ReactNode }) => {
  const [vendorId, setVendorId] = useState<string | null>(null);


  useEffect(() => {
    const storedId:any=136;
    if (storedId) setVendorId(storedId);
  }, []);

  return (
    <VendorContext.Provider value={{ vendorId, setVendorId }}>
      {children}
    </VendorContext.Provider>
  );
};

export const useVendor = () => {
  const context = useContext(VendorContext);
  if (!context) throw new Error('useVendor must be used within a VendorProvider');
  return context;
};
