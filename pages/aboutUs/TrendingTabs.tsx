"use client";
import { useState, useEffect } from "react";
import TabsData from "./TabsData.json";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import axios from "axios";
import { baseUrl } from "@/api-endpoints/ApiUrls";
import { useVendor } from "@/context/VendorContext";

export default function TrendingTabs() {
    const [activeTab, setActiveTab] = useState("videos");
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5); // default mobile = 5
    const { vendorId } = useVendor();
    const [videos, setVideos] = useState([]);
    // ✅ Detect screen size and adjust items per page
    useEffect(() => {
        const updateItemsPerPage = () => {
            if (window.innerWidth >= 1024) {
                setItemsPerPage(5); // Desktop (lg breakpoint)
            } else {
                setItemsPerPage(5); // Mobile/tablet
            }
        };

        updateItemsPerPage();
        window.addEventListener("resize", updateItemsPerPage);

        return () => window.removeEventListener("resize", updateItemsPerPage);
    }, []);


    // Fetch banners
    const bannerGetApi = async () => {
        try {
            const res = await axios.get(`${baseUrl}/video/?vendorId=${vendorId}`);
            if (res.data) {
                setVideos(res?.data?.videos);
            } else {
                console.warn('Unexpected API response:', res?.data);
            }
        } catch (error) {
            console.log('Error fetching banners:', error);
        }
    };

    useEffect(() => {
        bannerGetApi();
    }, [vendorId]);



    const tabs = [
        // { id: "gallery", label: "Gallery" },
        { id: "videos", label: "Videos" },
        // { id: "customers", label: "Happy Customers" },
    ];

    const getItemsForPage = (items: any[]) => {
        const start = (page - 1) * itemsPerPage;
        return items.slice(start, start + itemsPerPage);
    };

    const items: any =
        activeTab === "gallery"
            ? TabsData.gallery
            : activeTab === "videos"
                ? videos
                : TabsData.customers;

    const totalPages = Math.ceil(items.length / itemsPerPage);
    const getEmbedUrl = (url: any) => {
        if (!url) return "";

        try {
            const parsedUrl = new URL(url);
            let videoId = "";

            // Handle youtu.be short links (e.g. https://youtu.be/abc123XYZ78)
            if (parsedUrl.hostname === "youtu.be") {
                videoId = parsedUrl.pathname.slice(1);
            }
            // Handle normal YouTube links (e.g. https://www.youtube.com/watch?v=abc123XYZ78)
            else if (parsedUrl.searchParams.get("v")) {
                videoId = parsedUrl.searchParams.get("v")!;
            }
            // Handle shorts links (e.g. https://www.youtube.com/shorts/abc123XYZ78)
            else if (parsedUrl.pathname.includes("/shorts/")) {
                videoId = parsedUrl.pathname.split("/shorts/")[1];
            }

            return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
        } catch {
            // fallback if invalid URL
            return url;
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">

            {/* Tabs */}
            <div className="overflow-x-auto scrollbar-hide mb-6">
                <div className="flex gap-4 md:gap-6 border-b border-gray-200 px-2 md:px-0">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setPage(1);
                            }}
                            className={`relative flex-shrink-0 px-4 py-2 font-semibold transition-all whitespace-nowrap ${activeTab === tab.id
                                ? "text--green-900 border-b-2 border--green-900"
                                : "text-gray-500 hover:text--green-900"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                {/* LEFT SIDE: First big video */}
                {items[0] && (
                    <div className="lg:col-span-2 relative overflow-hidden rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl flex">
                        <iframe
                            className="w-full h-[380px] lg:h-[430px] rounded-2xl object-cover"
                            src={getEmbedUrl(items[0]?.thumbnail_url)}
                            title={`YouTube video ${items[0]?.id}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        ></iframe>
                    </div>
                )}

                {/* RIGHT SIDE: Next 4 small videos */}
                <div className="grid grid-cols-2 gap-4 content-between">
                    {items.slice(1, 5).map((item: any) => (
                        <div
                            key={item.id}
                            className="relative overflow-hidden rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                        >
                            <iframe
                                className="w-full h-[200px] rounded-2xl object-cover"
                                src={getEmbedUrl(item?.thumbnail_url)}
                                title={`YouTube video ${item.id}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            ></iframe>
                        </div>
                    ))}
                </div>
            </div>



            {/* Pagination */}
            <div className="flex justify-center mt-8 gap-2 items-center flex-wrap">
                <button
                    onClick={() => page > 1 && setPage(page - 1)}
                    className="px-3 py-2 rounded-full bg-gray-100 hover:bg-blue-100 text-gray-700"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => setPage(i + 1)}
                        className={`px-3 sm:px-4 py-2 rounded-full font-semibold transition ${page === i + 1
                            ? "bg-green-600 text-white shadow-lg"
                            : "bg-gray-100 text-gray-700 hover:bg-blue-100"
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    onClick={() => page < totalPages && setPage(page + 1)}
                    className="px-3 py-2 rounded-full bg-gray-100 hover:bg-blue-100 text-gray-700"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}