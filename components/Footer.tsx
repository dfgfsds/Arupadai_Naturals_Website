'use client';
import React, { useEffect, useState } from 'react';
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter, Youtube } from 'lucide-react';
import Link from 'next/link';
import { getVendorDeliveryDetailsApi } from '@/api-endpoints/authendication';
import { useQuery } from '@tanstack/react-query';
import { useVendor } from '@/context/VendorContext';
import { FaLinkedin } from 'react-icons/fa';
import axios from 'axios';
import { baseUrl } from '@/api-endpoints/ApiUrls';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { useCategories } from '@/context/CategoriesContext';

const Footer = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState({ title: '', description: '' })
    const { vendorId } = useVendor();
    const [submitted, setSubmitted] = useState(false);
    const { user, setUser }: any = useUser();
    const router = useRouter();
    const [testimonialData, setTestimonialData] = useState<any>()
    const [getUserId, setUserId] = useState<string | null>(null);
    const { categories }: any = useCategories();

    const getVendorDeliveryDetailsData: any = useQuery({
        queryKey: ['getVendorDeliveryDetailsData', vendorId],
        queryFn: () => getVendorDeliveryDetailsApi(`${vendorId}`),
        enabled: !!vendorId
    })
    const socialMediaData = getVendorDeliveryDetailsData?.data?.data?.vendor_site_details?.social_media_icon;

    useEffect(() => {
        setUserId(localStorage.getItem('userId'));
    }, []);

    const handleFormChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        try {
            await axios.post(`${baseUrl}/testimonial/`, { ...form, vendor: vendorId, verified_status: false, created_by: user?.data?.name ? user?.data?.name : 'user', user: getUserId })
            setSubmitted(true)
            setTimeout(() => {
                setIsModalOpen(false)
                setForm({ title: '', description: '' })
                setSubmitted(false)
            }, 1500)
        } catch (err) {
            console.error(err)
            alert('Error submitting testimonial')
        }
    }

    const testimonialGetApi = async () => {
        try {
            const res: any = await axios.get(`${baseUrl}/testimonial/?user_id=${user?.data?.id}&vendor_id=${vendorId}`);
            if (res?.data) {
                setTestimonialData(res?.data?.testimonials);
            } else {
                console.warn('Unexpected API response:', res.data);
            }
        } catch (error) {
            // console.log('Error fetching banners:', error);
        }
    };

    useEffect(() => {
        testimonialGetApi();
    }, [user?.data?.id]);

    return (
        <>
            {!testimonialData?.length && (
                <section className="bg-gray-100 py-16 px-6 md:px-12 lg:px-20">
                    <div className="max-w-7xl mx-auto text-center">
                        <h2 className="text-3xl font-bold text-green-500 mb-4">What Our Customers Say!</h2>
                        <p className="text-gray-600 mb-8">
                            We love to hear from our customers. Share your experience with us!
                        </p>

                        <button
                            onClick={() => {
                                getUserId ?
                                    setIsModalOpen(true)
                                    :
                                    router.push('/login');
                            }}
                            className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-900 transition mb-6"
                        >
                            Write a Testimonial
                        </button>
                    </div>
                </section>
            )}
            <footer className="mt-8 bg-gray-50">
                {/* Newsletter Section */}
                {/* <div className="bg-blue-50 py-12 px-6 md:px-12 lg:px-20">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Stay Updated with Our Latest News</h2>
                        <p className="text-gray-600 max-w-md mx-auto md:mx-0">
                            Subscribe to our newsletter for exclusive offers and updates. Unsubscribe anytime via our contact info in the legal notice.
                        </p>
                    </div>
                    <div className="flex w-full md:w-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="px-4 py-3 rounded-l-lg border border-gray-200 w-full md:w-96 focus:outline-none focus:ring-2 focus:ring--green-900 transition duration-200"
                        />
                        <button
                            type="button"
                            className="bg-green-600 hover:bg-green-900 text-white px-6 py-3 rounded-r-lg font-medium transition duration-200"
                        >
                            Subscribe
                        </button>
                    </div>
                </div>
            </div> */}

                {/* Footer Bottom Section */}
                <div className="bg-green-600 text-gray-200 py-12 px-6 md:px-12 lg:px-16">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {/* Your Account */}
                        <div>
                            <h3 className="text-white text-lg font-semibold mb-5">About Us</h3>
                            {/* <ul className="space-y-3 text-gray-300">
                            <li><a href="#" className="hover:text-blue-400 transition duration-200">Personal Info</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition duration-200">Orders</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition duration-200">Credit Slips</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition duration-200">Addresses</a></li>
                        </ul> */}
                            <p>At Arupadai Naturals, we believe in harnessing the power of nature to nourish and care for your skin. Our range of natural and organic products is carefully crafted to provide you healthy complexion.</p>
                        </div>

                        {/* Customer Service */}
                        <div>
                            <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 flex-shrink-0 mt-1" />
                                    <span>
                                        Arupadai Naturals <br />
                                        +91 79043 03676 <br />
                                        Sivakasi-626189 <br />
                                        Virudhunagar, TamilNadu <br />
                                        India
                                    </span>
                                </li>
                                {/* <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5" />
                                <span>+91-7904303676</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5" />
                                <span>arupadainaturals@gmail.com</span>
                            </li> */}
                                <li className="flex items-center gap-3">
                                    <a href="tel:+917904303676" className="flex items-center gap-3 hover:text-white transition">
                                        <Phone className="h-5 w-5" />
                                        <span>+91-7904303676</span>
                                    </a>
                                </li>

                                <li className="flex items-center gap-3">
                                    <a
                                        href="https://mail.google.com/mail/?view=cm&fs=1&to=arupadainaturals@gmail.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 hover:text-white transition"
                                    >
                                        <Mail className="h-5 w-5" />
                                        <span>arupadainaturals@gmail.com</span>
                                    </a>
                                </li>

                            </ul>
                        </div>

                        {/* Guarantees */}
                        <div>
                            <h3 className="text-white text-lg font-semibold mb-5">Policy pages</h3>
                            <ul className="space-y-3 text-gray-300">
                                <li>
                                    <Link href="/terms-conditions" className="hover:text-white transition-colors">Terms And Conditions</Link>
                                </li>
                                <li>
                                    <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                                </li>
                                <li>
                                    <Link href="/refund-and-cancellation-policy" className="hover:text-white transition-colors">Refund and Cancellation Policy</Link>
                                </li>
                                <li>
                                    <Link href="/shipping-delivery-policy" className="hover:text-white transition-colors">Shipping & Delivery Policy</Link>
                                </li>
                            </ul>
                        </div>

                        {/* Our Company */}
                        <div>
                            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/" className="hover:text-white transition-colors">Home</Link>
                                </li>
                                <li>
                                    <Link href="/products" className="hover:text-white transition-colors">Shop</Link>
                                </li>
                                <li>
                                    <Link href="/profile" className="hover:text-white transition-colors">My Account</Link>
                                </li>
                                <li>
                                    <Link href="/blog" className="hover:text-white transition-colors">Blogs</Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Social Media Section */}
                    <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-6">
                        <p className="text-white text-sm">
                            © {new Date().getFullYear()}{' '}
                            <a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                className=" hover:underline"
                            >
                                Arupadai Naturals.in
                            </a>. All rights reserved.
                        </p>
                        <div className="flex space-x-6">
                            {socialMediaData?.facebook?.url && socialMediaData?.facebook?.status === true && (
                                <a
                                    href={socialMediaData?.facebook?.url}
                                    target='_blank' className="bg-slate-100 p-2 hover:scale-110 transition-transform rounded-full text-[#000] ">
                                    <Facebook size={16} />
                                </a>
                            )}
                            {socialMediaData?.twitter?.url && socialMediaData?.twitter?.status === true && (
                                <a
                                    href={socialMediaData?.twitter?.url}
                                    target='_blank' className="bg-slate-100 p-2 rounded-full text-[#000] hover:scale-110 transition-transform">
                                    <Twitter size={16} />
                                </a>
                            )}
                            {socialMediaData?.youtube?.url && socialMediaData?.youtube?.status === true && (
                                <a
                                    href={socialMediaData?.youtube?.url}
                                    target='_blank' className="bg-slate-100 p-2 rounded-full text-[#000] hover:scale-110 transition-transform">
                                    <Youtube size={16} />
                                </a>
                            )}
                            {socialMediaData?.instagram?.url && socialMediaData?.instagram?.status === true && (
                                <a
                                    href={socialMediaData?.instagram?.url}
                                    target='_blank' className="bg-slate-100 p-2 rounded-full text-[#000] hover:scale-110 transition-transform">
                                    <Instagram size={16} />
                                </a>
                            )}
                            {socialMediaData?.linkedin?.url && socialMediaData?.linkedin?.status === true && (
                                <a
                                    href={socialMediaData?.linkedin?.url}
                                    target='_blank' className="bg-slate-100 p-2 rounded-full text-[#000] hover:scale-110 transition-transform">
                                    <FaLinkedin size={16} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </footer>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-[9999] overflow-auto">
                    <div className="bg-white rounded-xl shadow-lg max-w-lg w-full mt-24 p-6 relative">
                        {/* Close Button */}
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>

                        <h3 className="text-2xl font-semibold mb-4 text-center">Share Your Feedback</h3>

                        {submitted ? (
                            <div className="text-center text-green-600 font-medium py-6">
                                ✅ Thank you for your feedback!
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    name="title"
                                    value={form.title}
                                    onChange={handleFormChange}
                                    placeholder="Your Name"
                                    required
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                />
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleFormChange}
                                    placeholder="Write your testimonial..."
                                    rows={4}
                                    required
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                />
                                <button type="submit" className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-900 transition">Submit</button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Footer;
