'use client'

import React, { useEffect, useState } from 'react'
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import axios from 'axios'
import { baseUrl } from '@/api-endpoints/ApiUrls'
import { useVendor } from '@/context/VendorContext'

// const reviews = [
//     {
//         stars: 5,
//         text: `Having the distressing experience with some online shops before decided to say “THANK YOU” to all personnel of this store. You are not only friendly but deliver really good products in the shortest possible terms. In a word, I am absolutely happy with my purchase and the service. Everything was perfect!`,
//         name: 'Virginia Ubert',
//     },
//     {
//         stars: 5,
//         text: `Fast delivery and the product quality is amazing! Customer support was responsive and polite.`,
//         name: 'Jonathan Wells',
//     },
//     {
//         stars: 4,
//         text: `Good experience overall, would purchase again. A bit slow delivery but worth the wait.`,
//         name: 'Sandra Kim',
//     },
// ]

export default function ReviewCarousel() {
    const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
        loop: true,
        slides: { perView: 1, spacing: 10 },
    })

    const { vendorId } = useVendor();
    const [reviews, setReviews] = useState<any[]>([]);
    const [perView, setPerView] = useState(3);

    const staticImages = [
        "https://randomuser.me/api/portraits/women/44.jpg",
        "https://randomuser.me/api/portraits/men/32.jpg",
        "https://randomuser.me/api/portraits/women/68.jpg",
        "https://randomuser.me/api/portraits/men/55.jpg",
        "https://randomuser.me/api/portraits/women/12.jpg",
        "https://randomuser.me/api/portraits/men/41.jpg",
        "https://randomuser.me/api/portraits/women/70.jpg",
        "https://randomuser.me/api/portraits/men/85.jpg",
    ];



    const reviewsGetApi = async () => {
        try {
            const res = await axios.get(`${baseUrl}/testimonial/?vendor_id=${vendorId}`);
            if (res?.data) {
                const reviewsWithImages = res?.data?.testimonials?.map((review: any, index: number) => ({
                    ...review,
                    // img: staticImages[index % staticImages.length],
                }));
                setReviews(reviewsWithImages);
                setPerView(reviewsWithImages.length > 3 ? 3 : reviewsWithImages.length);
            }
        } catch (error) {
            // console.log('Error fetching testimonials:', error);
        }
    };

    useEffect(() => {
        reviewsGetApi();
    }, [vendorId]);


    return (
        <section className="py-12 px-4 bg-white relative">
            {reviews?.length > 0 && (
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-10">
                        <h3 className="text-3xl font-bold text--green-900 tracking-wide mb-4">
                            What Our Customers Say
                        </h3>
                        <span className="text-gray-500 text-sm sm:text-base">
                            Real experiences from our valued customers
                        </span>
                    </div>

                    {reviews?.length ? (
                        <div className="relative">
                            {/* Carousel */}
                            <div ref={sliderRef} className="keen-slider p-1">
                                {reviews
                                    .filter((review: any) => review?.verified_status === true) // ✅ show only verified
                                    .map((review, idx) => (
                                        <div
                                            key={idx}
                                            className="keen-slider__slide bg-white rounded-xl shadow-md border p-6 sm:p-8 flex items-start gap-5 hover:shadow-xl transition-all duration-300"
                                        >
                                            {/* 📝 Review Content */}
                                            <div className="flex flex-col">
                                                <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 tracking-wide">
                                                    {review?.title}
                                                </h4>
                                                <span className="text-gray-600 leading-relaxed text-sm sm:text-base italic mb-3">
                                                    "{review?.description}"
                                                </span>
                                                {review?.name && (
                                                    <span className="text-sm text-gray-700 font-semibold mt-auto">
                                                        — {review?.name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            {/* 🔹 Left Arrow */}
                            <button
                                onClick={() => instanceRef.current?.prev()}
                                className="absolute left-[-45px] top-1/2 transform -translate-y-1/2 bg-[#f4f0e8] hover:bg-[#e5dbc9] text-black p-2 rounded-full shadow-md"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            {/* 🔹 Right Arrow */}
                            <button
                                onClick={() => instanceRef.current?.next()}
                                className="absolute right-[-45px] top-1/2 transform -translate-y-1/2 bg-[#f4f0e8] hover:bg-[#e5dbc9] text-black p-2 rounded-full shadow-md"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        ""
                    )}

                </div>
            )}
        </section>
    );


}
