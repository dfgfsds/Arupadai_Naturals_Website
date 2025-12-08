'use client';

import React from 'react';
import Slider from 'react-slick';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useCategories } from '@/context/CategoriesContext';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Categories() {
    const { categories } = useCategories();
    const router = useRouter();
    const categoryCount = categories?.data?.length || 0;

    const settings = {
        dots: false,
        infinite: categoryCount > 3,
        speed: 500,
        slidesToShow: Math.min(categoryCount, 3),
        slidesToScroll: 1,
        arrows: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: Math.min(categoryCount, 2),
                    slidesToScroll: 1,
                    infinite: categoryCount > 2,
                },
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: false,
                },
            },
        ],
    };

    return (
        <section className="py-10 px-4 bg-white">
            <h2 className=" text-3xl font-bold  text--green-900 mb-6 mt-6 text-center ">
                Shop by category
            </h2>
            <div className="flex justify-end mb-5">
                <Link href="/categories">
                    <button className="text-sm px-4 py-1.5 mr-6 border border-green-900 text-green-900 rounded-md shadow-sm hover:shadow-md hover:bg-slate-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400">
                        View all
                    </button>
                </Link>
            </div>

            {/* ✅ If only 1 or 2 categories, show centered cards without stretching */}
            {categoryCount <= 2 ? (
                <div className="flex flex-wrap justify-center gap-6">
                    {categories?.data?.map((item: any, index: number) => (
                        <div
                            key={index}
                            className="bg-[#eef1ff] rounded-lg p-6 flex flex-col md:flex-row items-center justify-between min-h-[300px] w-[350px] md:w-[400px] transition-transform hover:scale-[1.02]"
                        >
                            <div className="flex-1 space-y-4 text-center md:text-left">
                                <h2 className="text-2xl md:text-3xl font-bold text-[#2b2e4a]">
                                    {item?.name}
                                </h2>
                                <span className="text-gray-600">{item?.name}</span>
                                <button
                                    onClick={() => router.push(`/categories/${item?.id}`)}
                                    className="p-3 bg-green-600 hover:bg-green-900 text-white rounded inline-flex items-center justify-center"
                                >
                                    <ArrowRight />
                                </button>
                            </div>

                            <div className="w-[150px] h-[150px] flex items-center justify-center">
                                <Image
                                    src={item?.image || 'https://semantic-ui.com/images/wireframe/image.png'}
                                    alt={item?.title || item?.name}
                                    width={150}
                                    height={150}
                                    className="object-contain rounded-md"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // ✅ If 3 or more, show slider
                <Slider {...settings}>
                    {categories?.data?.map((item: any, index: number) => (
                        <div key={index} className="px-2">
                            <div className="bg-green-100 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between min-h-[300px] transition-transform hover:scale-[1.02]">
                                <div className="flex-1 space-y-4 text-center md:text-left">
                                    <h2 className="text-2xl md:text-3xl font-bold text-[#2b2e4a]">
                                        {item?.name}
                                    </h2>
                                    <span className="text-gray-600">{item?.name}</span>
                                    <button
                                        onClick={() => router.push(`/categories/${item?.id}`)}
                                        className="p-3 bg-green-600 hover:bg-green-900 text-white rounded inline-flex items-center justify-center"
                                    >
                                        <ArrowRight />
                                    </button>
                                </div>
                                <div className="w-[150px] h-[150px] flex items-center justify-center">
                                    <Image
                                        src={item?.image  || 'https://semantic-ui.com/images/wireframe/image.png'}
                                        alt={item?.title || item?.name}
                                        width={150}
                                        height={150}
                                        className="object-contain rounded-md"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            )}
        </section>
    );
}
