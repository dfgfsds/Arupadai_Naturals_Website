// pages/thank-you.tsx
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function ThankYouPage() {
    const router = useRouter();
    const { id, name, price } = router.query;

    // Fire Purchase Pixel
    useEffect(() => {
        if (id && typeof window !== "undefined" && (window as any).fbq) {
            (window as any).fbq("track", "Purchase", {
                content_name: name,
                content_ids: [id],
                content_type: "product",
                value: price,
                currency: "INR",
            });
        }
    }, [id, name, price]);
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white p-10 rounded-2xl shadow-lg text-center max-w-md">
                <div className="flex justify-center mb-6">
                    <svg
                        className="w-16 h-16 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 
              9 0 0118 0z"
                        />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold mb-4 text-gray-800">
                    Payment Successful 🎉
                </h1>
                <p className="text-gray-600 mb-6">
                    Thank you for your purchase. Your payment has been processed successfully.
                </p>
                <Link
                    href="/profile"
                    className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-900 transition"
                >
                    Back to Orders
                </Link>
            </div>
        </div>
    );
}
