"use client";

import Link from "next/link";
import { Phone } from "lucide-react"; // or react-icons if u prefer
import { useVendor } from "@/context/VendorContext";
import { useQuery } from "@tanstack/react-query";
import { getVendorDeliveryDetailsApi } from "@/api-endpoints/authendication";

interface FloatingCallButtonProps {
    phoneNumber?: string;
}

export default function FloatingCallButton({
    phoneNumber = "+917904303676",
}: FloatingCallButtonProps) {
        const { vendorId } = useVendor();
    const getVendorDeliveryDetailsData: any = useQuery({
        queryKey: ['getVendorDeliveryDetailsData', vendorId],
        queryFn: () => getVendorDeliveryDetailsApi(`${vendorId}`),
        enabled: !!vendorId
    })
    const floatingCallData = getVendorDeliveryDetailsData?.data?.data?.vendor_site_details?.vendor_floating_icon;

    return (
        <>
         {floatingCallData?.call?.value && floatingCallData?.call?.status === true &&(
        <Link
            href={`tel:${floatingCallData?.call?.value}`}
            className={`fixed bottom-36 md:bottom-24 ${floatingCallData?.call?.alignment?.split('-')[1]}-5 z-50 flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-gradient-to-r from-green-600 to-green-900 text-white shadow-lg border border-green-900 transition-transform duration-300 hover:scale-110 hover:shadow-2xl`}
            aria-label="Call Us"
        >
            {/* Optional pulsing ring effect */}
            {/* <span className="absolute w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-green-600 opacity-75 animate-ping"></span> */}

            <Phone size={22} className="sm:size-6 relative z-10" />
        </Link>
         )}
        </>
    );
}
