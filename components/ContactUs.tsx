'use client';

import { useState } from 'react';
import axios from 'axios';
import { Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import Breadcrumb from './Breadcrumb';
import ApiUrls from '@/api-endpoints/ApiUrls';
import { useVendor } from '@/context/VendorContext';

const ContactUs = () => {
    const { vendorId } = useVendor();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const [errors, setErrors] = useState({
        email: '',
        mobile: '',
    });

    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMessage] = useState('');

    const breadcrumbItems = [
        { name: 'Home', href: '/' },
        { name: 'Contact Us', href: '/contactUs', isActive: true },
    ];

    // ✅ Email validation function
    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // ✅ Email handler
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const email = e.target.value;
        setFormData({ ...formData, email });

        if (!email) {
            setErrors((prev) => ({ ...prev, email: 'Email is required' }));
        } else if (!validateEmail(email)) {
            setErrors((prev) => ({ ...prev, email: 'Invalid email address' }));
        } else {
            setErrors((prev) => ({ ...prev, email: '' }));
        }
    };

    // ✅ Mobile handler with validation
    const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ''); // allow only digits
        if (value.length <= 10) {
            setFormData({ ...formData, subject: value });
        }

        if (!value) {
            setErrors((prev) => ({ ...prev, mobile: 'Mobile number is required' }));
        } else if (value.length < 10) {
            setErrors((prev) => ({ ...prev, mobile: 'Mobile number must be 10 digits' }));
        } else {
            setErrors((prev) => ({ ...prev, mobile: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (errors.email || errors.mobile) return;

        setLoading(true);
        setSuccessMessage('');

        const payload = {
            name: formData.name,
            email: formData.email,
            contact_number: formData.subject,
            description: formData.message,
            vendor_id: vendorId,
        };

        try {
            const res = await axios.post(ApiUrls?.sendQuote, payload);
            const msg = res?.data?.message || 'Message sent successfully!';
            toast.success(msg);
            setSuccessMessage(msg);
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: '',
            });
        } catch (error: any) {
            console.error(error?.response || error);
            toast.error('Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section>
            <div className="container mx-auto px-4 py-12">
                <Breadcrumb items={breadcrumbItems} />
            </div>

            <div className="py-12 px-4 sm:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {/* Left: Contact Info */}
                    <div className="space-y-10">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">CUSTOMER SERVICE</h3>
                            <div className="flex items-start gap-3 text-sm text-gray-700 mt-2">
                                <Phone size={16} className="text-green-900 mt-1" />
                                <a
                                    href="tel:+917904303676"
                                    className="text-gray-400 hover:text-blue-600 transition"
                                >
                                    +91-7904303676
                                </a>
                            </div>

                            <div className="flex items-start gap-3 text-sm text-gray-700 mt-2">
                                <Mail size={16} className="text-green-900 mt-1" />
                                <a
                                    href="https://mail.google.com/mail/?view=cm&fs=1&to=customercare.arupadainaturals@gmail.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-blue-600 transition"
                                >
                                    customercare.arupadainaturals@gmail.com
                                </a>
                            </div>

                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">STORE LOCATOR</h3>
                            {/* <p className="text-sm text-gray-700">Shop No 2, GF 1/L, Blackers Road</p>
                            <p className="text-sm text-gray-700">Gaiety Palace, Anna Salai, Chennai – 600002</p>
                            <p className="text-sm text-gray-700">
                                (Near Casino Theatre, Next to Ola Electric Store)
                            </p> */}
                            <p className="text-sm text-gray-700">Sivakasi</p>
                            <p className="text-sm text-gray-700">Virudhunagar, TamilNadu – 626189</p>
                            <p className="text-sm text-gray-700"> 
                                India
                            </p>
                        </div>
                    </div>

                    {/* Right: Contact Form */}
                    <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
                            Have a question about a product, our company, or just want to chat? Email us!
                        </h2>
                        <p className="text-gray-600 mb-6 max-w-2xl">
                            We will be glad to assist you in any question and encourage you to share your ideas and
                            improvements with us.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-1">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    placeholder="Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full border border-gray-200 px-4 py-2 rounded focus:outline-none"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-1">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleEmailChange}
                                    className={`w-full border px-4 py-2 rounded focus:outline-none ${errors.email ? 'border-red-500' : 'border-gray-200'
                                        }`}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                                )}
                            </div>

                            {/* Mobile */}
                            <div>
                                <label htmlFor="mobile" className="block text-sm font-semibold text-gray-800 mb-1">
                                    Mobile
                                </label>
                                <input
                                    id="mobile"
                                    type="text"
                                    required
                                    placeholder="Mobile"
                                    value={formData.subject}
                                    onChange={handleMobileChange}
                                    className={`w-full border px-4 py-2 rounded focus:outline-none ${errors.mobile ? 'border-red-500' : 'border-gray-200'
                                        }`}
                                />
                                {errors.mobile ? (
                                    <p className="text-sm text-red-600 mt-1">{errors.mobile}</p>
                                ) : (
                                    formData.subject.length === 10 && (
                                        <p className="text-sm text-green-600 mt-1">
                                            {/* ✅ Mobile number looks good! */}
                                        </p>
                                    )
                                )}
                            </div>

                            {/* Message */}
                            <div>
                                <label htmlFor="message" className="block text-sm font-semibold text-gray-800 mb-1">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    required
                                    rows={4}
                                    placeholder="Message"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full border border-gray-200 px-4 py-2 rounded focus:outline-none"
                                />
                            </div>

                            {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-900 transition disabled:opacity-70"
                            >
                                {loading ? 'Sending...' : 'Submit'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactUs;
