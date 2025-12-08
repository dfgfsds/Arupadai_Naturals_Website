import { GetServerSideProps } from "next";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { formatDate, slugConvert } from "../../../lib/utils";
import axios from "axios";
import { baseUrl } from "@/api-endpoints/ApiUrls";
import Head from "next/head";

interface Blog {
    id: number;
    title: string;
    content: string;
    banner_url: string;
    created_at: string;
    author: string;
    description: string;
}

interface BlogDetailProps {
    blog: Blog | null;
}

export default function BlogDetail({ blog }: BlogDetailProps) {
    if (!blog) {
        return <div className="text-center py-20">Blog not found</div>;
    }

    return (
        <div className="max-w-4xl mx-auto py-16 px-6">
            <Head>
                <title>{`${blog.title} | BMC`}</title>
                <meta
                    name="description"
                    content={blog.description?.slice(0, 160) || blog.content.slice(0, 160)}
                />
                <meta property="og:title" content={blog.title} />
                <meta
                    property="og:description"
                    content={blog.description?.slice(0, 160) || blog.content.slice(0, 160)}
                />
                <meta property="og:image" content={blog.banner_url} />
                <meta property="og:type" content="article" />
                <meta property="og:site_name" content="BMC" />
            </Head>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{blog.title}</h1>
            <div className="text-sm text-gray-400 mb-6">
                {formatDate(blog.created_at)} · by {blog.author}
            </div>

            <div className="relative w-full h-96 mb-8">
                <Image
                    src={blog.banner_url}
                    alt={blog.title}
                    height={500}
                    width={800}
                    className="object-cover rounded-lg"
                />
            </div>

            <div dangerouslySetInnerHTML={{ __html: blog?.content }} className="quill-content" />
        </div>
    );
}

// ✅ SSR fetching
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.params as { id: string };

    try { 
        // fetch blogs by vendor (if vendor is fixed, you can hardcode or fetch via context/session)
        const vendorId = 136; // replace with dynamic vendorId if needed
        const response = await axios.get(`https://test-ecomapi.justvy.in/blog/?vendor_id=${vendorId}`);
        const blogs: Blog[] = response.data?.blogs || [];

        const found = blogs.find((b) => slugConvert(b.title) === id);

        return {
            props: {
                blog: found || null,
            },
        };
    } catch (error) {
        console.error("Error fetching blog:", error);
        return {
            props: {
                blog: null,
            },
        };
    }
};


