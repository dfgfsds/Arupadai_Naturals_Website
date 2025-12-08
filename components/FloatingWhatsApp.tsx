    'use client';

    import React, { useEffect, useState } from 'react';
    import { FaWhatsapp } from 'react-icons/fa';
    import { usePathname } from 'next/navigation';
    import { getVendorDeliveryDetailsApi } from '@/api-endpoints/authendication';
    import { useQuery } from '@tanstack/react-query';
    import { useVendor } from '@/context/VendorContext';

    const FloatingWhatsApp: React.FC = () => {
        const pathname = usePathname();
        const [isMobile, setIsMobile] = useState(false);
        const { vendorId } = useVendor();

        const getVendorDeliveryDetailsData: any = useQuery({
            queryKey: ['getVendorDeliveryDetailsData', vendorId],
            queryFn: () => getVendorDeliveryDetailsApi(`${vendorId}`),
            enabled: !!vendorId
        })
        const floatingCallData = getVendorDeliveryDetailsData?.data?.data?.vendor_site_details?.vendor_floating_icon;

        useEffect(() => {
            const checkMobile = () => setIsMobile(window.innerWidth < 640);
            checkMobile(); // initial check
            window.addEventListener('resize', checkMobile);
            return () => window.removeEventListener('resize', checkMobile);
        }, []);

        const phoneNumber = '917904303676';
        const message = encodeURIComponent('Hello! I am interested in your services.');

        // Check if on productLandingPage slug route
        const isProductPage = pathname?.startsWith('/productLandingPage/');

        const bottomClass = isProductPage && isMobile ? 'bottom-20' : 'bottom-5';

        return (
            <>
                {floatingCallData?.whatsapp?.value && floatingCallData?.whatsapp?.status === true && (
                    <a
                        href={`https://wa.me/${floatingCallData?.whatsapp?.value}?text=${message}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`fixed bottom-20 md:bottom-7 ${floatingCallData?.whatsapp?.alignment?.split('-')[1]}-5 z-50 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-900 transition-colors duration-300 `}
                    >
                        <FaWhatsapp className="w-6 h-6" />
                    </a>
                )}
            </>
        );
    };

    export default FloatingWhatsApp;
