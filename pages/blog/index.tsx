"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { formatDate, slugConvert } from "../../lib/utils";
import Link from "next/link";
import { useVendor } from "@/context/VendorContext";
import { baseUrl } from "@/api-endpoints/ApiUrls";

interface Blog {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  banner_url?: string;
  created_at: string;
  author: string;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const { vendorId } = useVendor();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/blog/?vendor_id=${vendorId}`
        );
        setBlogs(response.data?.blogs || []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [vendorId]);

  return (
    <section className="bg-white py-16 px-6 md:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Blog</h2>
          <p className="text-gray-500">
            Tips, trends, and advice for all things desktop, gaming, and IT
            accessories.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading blogs...</p>
        ) : blogs.length === 0 ? (
          <p className="text-center text-gray-500">No blogs found.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog: any) => (
              <div
                key={blog.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col"
              >
                {/* Image */}
                <div className="relative w-full h-56">
                  <Image
                    src={blog.banner_url || blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-between flex-grow p-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                      {blog.excerpt}
                    </p>
                  </div>

                  <div className="mt-6">
                    <div className="text-xs text-gray-400">
                      {formatDate(blog.created_at)} · by {blog.author}
                    </div>
                    <Link
                      href={`/blog/${slugConvert(blog?.title)}`}
                      className="inline-block mt-2 text--green-900 hover:underline font-medium text-sm"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
