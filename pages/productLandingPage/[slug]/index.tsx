'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Heart, ShoppingCart, Eye, ArrowLeft, Minus, Plus, ShoppingBasket, ArrowBigRight, ArrowBigRightDash, ArrowRight } from 'lucide-react';
import { InvalidateQueryFilters, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProductApi, getProductVariantCartItemUpdate } from '@/api-endpoints/products';
import { useProducts } from '@/context/ProductsContext';
import { useEffect, useRef, useState } from 'react';
import { useCartItem } from '@/context/CartItemContext';
import { deleteCartitemsApi, getAddressApi, getCartApi, postApplyCouponApi, postCartCreateApi, postCartitemApi, postPaymentApi, updateCartitemsApi } from '@/api-endpoints/CartsApi';
import { useVendor } from '@/context/VendorContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useUser } from '@/context/UserContext';
import { getDeliveryChargeApi, patchUserSelectAddressAPi, postCreateUserAPi } from '@/api-endpoints/authendication';
import { useForm } from 'react-hook-form';
import { baseUrl } from "../../../api-endpoints/ApiUrls"
import addresses from "../../../api-endpoints/ApiUrls"
import Head from 'next/head';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Script from "next/script";

export default function ProductLandingPage() {
    const router = useRouter();
    // const params = useParams();
    // const { params } = useParams<any>() ?? {};
      const params = useParams();
    const slug = params?.slug;
    const { products, isAuthenticated, isLoading }: any = useProducts();
    const queryClient = useQueryClient();
    const { vendorId } = useVendor();
    const [selectedVariant, setSelectedVariant] = useState<any | null>(
        products?.variants && products?.variants?.length > 0 ? products?.variants[0] : null
    );
    const [mobileModal, setMobileModal] = useState(false);
    const [mobileNumber, setMobileNumber] = useState('');
    const [loadingMobile, setLoadingMobile] = useState(false);
    const [signInmodal, setSignInModal] = useState<boolean>(false);
    const [localQty, setLocalQty] = useState<number>(1);
    const { setUser, user }: any = useUser();
    const [selectedAddressId, setSelectedAddressId] = useState<string>();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<any>();
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [userId, setUserId] = useState<any>(null);
    const [cartId, setCartId] = useState<string | null>(null);
    const { register, handleSubmit, setValue, reset, watch, clearErrors, formState: { errors } } = useForm();
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [userExists, setUserExists] = useState<any>(null); // null initially
    const [registeringUserData, setRegisteringUserData] = useState<any>(null); // to hold values from address form
    const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
    const { refetchCart } = useCartItem();
    const [showFailureModal, setShowFailureModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [deliveryInfo, setDeliveryInfo] = useState<any>(null);

    const inputClass = "w-full border border-gray-300 px-4 py-1 rounded";
    if (!userExists) {
        setValue('contact_number', mobileNumber)
    }

    const pincode = watch('postal_code');

    useEffect(() => {
        const fetchAddressByPincode = async () => {
            if (pincode && pincode.length === 6) {
                try {
                    const res = await axios.get(`${baseUrl}/pincode/?pincode=${pincode}`);
                    if (res.data.success) {
                        const { district_name, state_name } = res.data.pincode;
                        setValue('city', district_name);
                        setValue('state', state_name);
                        clearErrors(['state', 'city']);
                    }
                } catch (err) {
                    console.error('Error fetching district/state:', err);
                }
            }
        };

        fetchAddressByPincode();
    }, [pincode, setValue]);

    function slugConvert(name: string) {
        return name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')         // Replace spaces with hyphens
            .replace(/[^\w-]+/g, '');     // Remove non-word characters except hyphens
    }
    const productDetails = products?.data?.find((item: any) => slugConvert(item.name) === slug);

    // Fire ViewContent Pixel
    useEffect(() => {
        if (productDetails && typeof window !== "undefined" && (window as any).fbq) {
            (window as any).fbq("track", "ViewContent", {
                content_name: productDetails.name,
                content_ids: [productDetails.id],
                content_type: "product",
                value: productDetails.price,
                currency: "INR",
            });
        }
    }, [productDetails]);


    const handleAddCart = async (id: any, qty: any) => {
        const payload = {
            cart: localStorage.getItem('cartId') ? Number(localStorage.getItem('cartId')) : '',
            product: id,
            user: localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : '',
            vendor: vendorId,
            quantity: qty,
            created_by: localStorage.getItem('userName') ? localStorage.getItem('userName') : 'user'
        }
        try {
            // const response = await postCartitemApi(``, payload)
            const response = await axios.post(`${baseUrl}/api/cart_items/`, payload)
            if (response) {
                // toast.success('Product added in cart!')
                queryClient.invalidateQueries(['getProductData'] as InvalidateQueryFilters);
            }
        } catch (error: any) {
            console.log(error?.response);
            toast.error(error?.response?.data?.message || 'Something went wrong!')

        }
    }

    const handleMobileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingMobile(true);
        try {
            const response = await axios.get(
                `${baseUrl}/get-user-by-email-or-contact-role-vendor-id/`,
                {
                    params: {
                        vendorId,
                        contactNumber: mobileNumber,
                        roleName: 'User'
                    }
                }
            );
            const data = response.data;

            if (data?.user) {
                setUser(data?.user);
                setUserId(data?.user?.id);
                setUserExists(true);
                // toast.success('User found!');
                localStorage.setItem('userId', data?.user?.id);
                localStorage.setItem('userName', data?.user?.name);
                localStorage.setItem('contact_number', data?.user?.contact_number);
                const updateApi = await getCartApi(`user/${data?.user?.id}/`);
                if (updateApi) {
                    localStorage.setItem('cartId', updateApi?.data[0]?.id);
                }
                // ✅ Add to cart right after user is verified
                await handleAddCart(productDetails?.id, localQty);
                getDeliveryCharge();
                setMobileModal(false);
                setShowAddressModal(true);
                // optionally store or redirect or call next step
            } else {
                // toast.error('No user found!');
                setUserExists(false); // <- important
                setShowAddressModal(true); // open address form
            }
        } catch (error) {

            // toast.error(error?.response?.data?.message || 'API error');
            console.error(error);
            setUserExists(false);
            // Add details form button
            setMobileModal(false);
            setShowAddressModal(true);
        } finally {
            setLoadingMobile(false);
        }
    };

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        setUserId(storedUserId);
        const storedCartId = localStorage.getItem('cartId');
        setCartId(storedCartId);
    }, []);

    const { data: address, isLoading: addressLoading } = useQuery({
        queryKey: ['getAddressData', userId],
        queryFn: () => getAddressApi(`user/${userId}`),
        enabled: !!userId
    });

    const getDeliveryCharge = async () => {

        try {
            const userIdFix = user?.data?.id || userId;
            if (!userIdFix) throw new Error("User ID not found");
            const res = await axios.get(`${baseUrl}/vendor-site-payment-delivery-partner-details/${vendorId}/`)
            setDeliveryInfo(res.data[0]);
            console.log(res?.data[0]?.own_delivery_charge, "delivery");

        } catch (error) {
            console.error("Error fetching delivery charge:", error);
        }
    }

    useEffect(() => {
        getDeliveryCharge()
    }, [userId])

    useEffect(() => {
        if (userId && vendorId && cartId && user?.contact_number) {
            getDeliveryCharge();
        }
    }, [cartId, userId, vendorId, user?.contact_number, selectedAddressId]);

    useEffect(() => {
        if (address?.data?.length) {
            const selected = address?.data?.find((address: any) => address?.selected_address === true);
            if (selected?.id) {
                setSelectedAddressId(String(selected?.id));
            }
        }
    }, [address]);

    const handleSelectAddress = async (id: any) => {
        try {
            const upadetApi = await patchUserSelectAddressAPi(`user/${userId}/address/${id?.id}`, { updated_by: user?.data?.name || 'user' });
            if (upadetApi) {
                queryClient.invalidateQueries(['getAddressData'] as InvalidateQueryFilters);
                getDeliveryCharge()
            }
        } catch (error) {
        }
    }

    const RAZOR_PAY_KEY = 'rzp_live_zprl8eteDSWOEX';
    const placeOrder = async () => {
        try {
            const userId = user?.data?.id || localStorage.getItem('userId');
            if (!userId) throw new Error("User ID not found");
            if (!selectedAddressId) throw new Error("No address selected");

            const payload = {
                user_id: parseInt(userId),
                vendor_id: vendorId,
                customer_phone: user?.data?.contact_number || localStorage.getItem('contact_number'),
            };
            const response = await axios.post(`${baseUrl}/prepaid-pay-now/`, payload);
            const { payment_order_id, final_price } = response.data;

            const options = {
                key: RAZOR_PAY_KEY,
                amount: final_price * 100,
                currency: "INR",
                name: "Brilliant Memory Computers",
                description: "Order Payment",
                order_id: payment_order_id,
                handler: function (response: any) {
                    console.log("Payment Success:", response);
                    refetchCart();
                    setShowSuccessModal(true);

                    setTimeout(() => {
                        setShowSuccessModal(false);
                        router.push(
                            `/thank-you?id=${productDetails.id}&name=${productDetails.name}&price=${productDetails.price}`
                        )
                    }, 5000);
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                    contact: user?.contact_number,
                },
                notes: {
                    address: "Selected Address",
                },
                theme: {
                    color: "#2563EB",
                },
            };

            const razor = new (window as any).Razorpay(options);
            razor.open();

        } catch (error) {
            console.error("Error placing order:", error);
            setShowFailureModal(true);
            setTimeout(() => {
                setShowFailureModal(false);
                router.push("/cart");
            }, 5000);
        }
    };


    const relatedProducts = products?.data?.filter((product: any) => product?.category === productDetails?.category)
        ?.slice(0, 4)

    const onSubmit = async (formData: any) => {
        try {
            if (userExists === false) {
                const userPayload = {
                    name: formData.name,
                    email: formData.email_address,
                    contact_number: formData.contact_number,
                    vendor: vendorId,
                    created_by: 'user',
                    profile_image: '',
                    password: formData.email_address
                };
                const userResponse = await postCreateUserAPi(userPayload);
                const newUser = userResponse?.data?.user;
                setUser(newUser);
                setUserId(newUser.id);
                // save user in localStorage
                localStorage.setItem('userId', newUser?.id);
                localStorage.setItem('userName', newUser?.name);
                localStorage.setItem('contact_number', newUser?.contact_number);

                // Create cart
                const cartRes = await postCartCreateApi('', {
                    user: newUser?.id,
                    vendor: vendorId,
                    created_by: newUser?.name,
                });
                localStorage.setItem('cartId', cartRes?.data?.id);
                setCartId(cartRes?.data?.id);
            }
            const addressPayload = {
                ...formData,
                customer_name: formData.name,
                user: localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : '',
                vendor: vendorId,
                selected_address: true,
                created_by: 'User'
            };
            delete formData.password,
                await axios.post(`${addresses?.addresses}`, addressPayload);
            toast.success('Address saved successfully!');
            setUserExists(true);
            queryClient.invalidateQueries(['getAddressData'] as InvalidateQueryFilters);
            await handleAddCart(productDetails?.id, localQty);
            // ✅ Fire Meta Pixel Purchase event here
            if (typeof (window as any).fbq === "function") {
                (window as any).fbq("track", "Purchase", {
                    currency: "INR",
                    value: 15000.0 // You can replace with dynamic value if needed
                });
            }
            setIsAddingNewAddress(false); // Reset to show address list
            setShowAddressModal(true); // Keep modal open to show address list
            reset();
            getDeliveryCharge();
            // Optional: reload address list or move to payment
        } catch (error) {
            toast.error('Failed to save address or register user');
            console.error(error);
        }
    };

    const handleBuyNow = () => {
        // Open your modal
        setMobileModal(true);

        // Fire Meta Pixel Lead event
        if (typeof (window as any).fbq === "function") {
            (window as any).fbq("track", "Lead");
        }
    };
    const sliderSettings = {
        autoplay: true,
        dots: true,
        arrows: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    if (isLoading) {
        return (


            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row gap-6 animate-pulse">

                    {/* Left side image skeleton */}
                    <div className="w-full md:w-1/3 h-48 md:h-64 bg-gray-300 rounded"></div>

                    {/* Right side content skeleton */}
                    <div className="flex flex-col flex-1 space-y-4">
                        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-300 rounded w-full"></div>
                        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                        <div className="h-10 bg-gray-300 rounded w-32 mt-4"></div>
                    </div>

                </div>
            </div>
        );
    }

    return (
        <>
            {/* Meta Pixel Script */}
            <Script
                id="meta-pixel"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1109896044650887');
          fbq('track', 'PageView');
          `,
                }}
            />

            <noscript>
                <img
                    height="1"
                    width="1"
                    style={{ display: "none" }}
                    src="https://www.facebook.com/tr?id=1109896044650887&ev=PageView&noscript=1"
                />
            </noscript>

            <div className=" mx-auto px-4 py-6 md:py-12">

                <div className="grid grid-cols-1  md:grid-cols-2 gap-8">
                    {/* Left - Product Image + Thumbnails */}
                    <div className="w-full">
                        {productDetails?.image_urls?.length > 1 ? (
                            <Slider {...sliderSettings}>
                                {productDetails?.image_urls?.map((url: string, index: number) => (
                                    <div key={index} className="p-2">
                                        <Image
                                            src={url}
                                            alt={`product-${index}`}
                                            width={500}
                                            height={500}
                                            className="w-full h-auto object-contain rounded border mx-auto"
                                        />
                                    </div>
                                ))}
                            </Slider>
                        ) : (
                            <Image
                                src={productDetails?.image_urls[0]}
                                alt="product"
                                width={500}
                                height={500}
                                className="w-full h-auto object-contain rounded border mx-auto"
                            />
                        )}
                    </div>

                    {/* Right - Product Info */}
                    <div className="w-full">
                        <h1 className="text-xl md:text-2xl font-semibold border-b-2 border-gray-500 capitalize mb-5">
                            {productDetails?.name}
                        </h1>

                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 flex-wrap">
                            <div className="text-xl md:text-2xl font-bold text--green-900 py-2">
                                {formatPrice(Number(productDetails?.price))}
                            </div>

                            {productDetails?.price === productDetails?.discount ||
                                productDetails?.discount === 0 ||
                                productDetails?.discount === "" ? null : (
                                <span className="text-lg md:text-xl font-bold text-gray-600 py-2 line-through">
                                    {formatPrice(Number(productDetails?.discount))}
                                </span>
                            )}
                        </div>

                        <ul className="mt-6 mb-3 space-y-2 text-sm text-gray-700 border-y py-2 border-gray-200">
                            <li>
                                <strong>Brand:</strong> {productDetails?.brand_name}
                            </li>
                            <li>
                                <strong>Availability: </strong>
                                <span
                                    className={`font-semibold ${productDetails?.stock_quantity === 0 || productDetails?.status === false
                                        ? "text--green-900"
                                        : "text-green-600"
                                        }`}
                                >
                                    {productDetails?.stock_quantity === 0 || productDetails?.status === false
                                        ? "Out Of Stock"
                                        : "In Stock"}
                                </span>
                            </li>
                        </ul>

                        <div className="text-sm text-orange-600 font-medium mt-1">
                            🔥 Hurry! Only 49 left in stock.
                        </div>

                        {/* Quantity */}
                        <div className="mt-4">
                            <label className="block text-md font-bold text-black mb-2">Quantity</label>
                            <div className="flex items-center w-full max-w-[180px]">
                                <button
                                    className="h-10 w-10 border border-input rounded-l"
                                    onClick={() => setLocalQty((prev) => Math.max(1, prev - 1))}
                                >
                                    <Minus className="h-4 w-4 mx-auto" />
                                </button>

                                <div className="text-gray-800 flex-1 h-10 border-t border-b border-input flex items-center justify-center font-medium">
                                    {localQty}
                                </div>

                                <button
                                    className="h-10 w-10 border border-input rounded-r"
                                    onClick={() => setLocalQty((prev) => prev + 1)}
                                >
                                    <Plus className="h-4 w-4 mx-auto" />
                                </button>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="mt-6 flex flex-col sm:flex-row gap-3">
                            <button
                                className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-900 flex items-center justify-center gap-2 w-full sm:w-auto"
                                onClick={handleBuyNow}
                            >
                                <ShoppingBasket size={18} /> Buy Now
                            </button>
                        </div>
                    </div>
                </div>

                <div className='mt-6 max-w-6xl mx-auto'>
                    <h2 className='text-md font-bold'>Description:</h2>
                    <div dangerouslySetInnerHTML={{ __html: productDetails?.description }} className="quill-content text-gray-600 mt-2 " />
                </div>

                <div className="mt-5 border-t pt-5">
                    <h2 className="text-xl font-bold mb-4">Also avaliable products:</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts?.map((product: any, idx: number) => (
                            <div className="bg-white relative h-[400px] rounded-md group hover:shadow-[0_0_20px_rgba(0,0,0,0.15)] overflow-hidden transition-all duration-300">
                                {/* Product Image */}
                                <div className="relative p-4">
                                    <Image
                                        src={product?.image_urls[0]}
                                        alt={product?.name}
                                        width={280}
                                        height={280}
                                        className="h-52 w-full object-contain mx-auto"
                                    />
                                </div>
                                {/* Divider */}
                                <span className="block w-full h-[1px] bg-blue-100" />
                                {/* Product Name */}
                                <h3 className="text-base font-medium text-gray-800 truncate px-4 mt-4 text-center">
                                    <Link
                                        href={`/productLandingPage/${slugConvert(product.name)}`}
                                        className="hover:text--green-900 transition"
                                    >
                                        <p className="text-center font-medium truncate">{product.name}</p>
                                    </Link>
                                </h3>
                                {/* Price */}
                                <div className="text-center mt-3">
                                    <p className="text--green-900 text-xl font-semibold">₹{product?.price}</p>
                                </div>
                                <div className="flex justify-center mt-4">
                                    <button
                                        onClick={() => (router.push(`/productLandingPage/${slugConvert(product.name)}`))}
                                        className="w-[80%] bg-green-600 hover:bg-black hover:text-white text-white py-2 rounded-md font-medium shadow-sm transition-all duration-200"
                                    >
                                        <span className="flex justify-center">
                                            View Product <span className="ml-2 mt-1 align-middle"><Eye size={16} /></span>
                                        </span>
                                    </button>
                                </div>


                            </div>
                        ))}
                    </div>
                </div>

                {/* new section */}
                <section className="relative bg-gradient-to-r from-blue-50 to-blue-100 my-12 py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto text-center">

                        {/* Heading */}
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-800 mb-4 sm:mb-6">
                            Why Choose <span className="text--green-900">Brilliant Memory Computers (BMC)?</span>
                        </h2>

                        {/* Paragraph */}
                        <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto mb-12">
                            At BMC, we believe powerful technology shouldn’t come with a heavy price tag.
                            Our refurbished laptops are tested, reliable, and budget-friendly.
                            Plus, every laptop comes with a 1-year warranty for complete peace of mind.
                            Whether you’re a student, professional, or business, we’ve got the perfect laptop for you.
                        </p>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">

                            {/* Feature 1 */}
                            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition duration-300">
                                <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-blue-100 mb-4">
                                    <img src="https://cdn-icons-png.flaticon.com/512/1828/1828640.png" className="w-8" alt="Refurbished" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold text-blue-900 mb-2">Refurbished & Fully Tested</h3>
                                <p className="text-gray-600 text-sm sm:text-base">Every laptop undergoes strict quality checks to ensure reliability.</p>
                            </div>

                            {/* Feature 2 */}
                            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition duration-300">
                                <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-blue-100 mb-4">
                                    <img src="https://cdn-icons-png.flaticon.com/512/2721/2721289.png" className="w-8" alt="Savings" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold text-blue-900 mb-2">Huge Savings</h3>
                                <p className="text-gray-600 text-sm sm:text-base">Save big compared to buying brand-new laptops.</p>
                            </div>

                            {/* Feature 3 */}
                            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition duration-300">
                                <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-blue-100 mb-4">
                                    <img src="https://cdn-icons-png.flaticon.com/512/726/726488.png" className="w-8" alt="Warranty" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold text-blue-900 mb-2">1-Year Warranty</h3>
                                <p className="text-gray-600 text-sm sm:text-base">Enjoy peace of mind with warranty & after-sales support.</p>
                            </div>

                            {/* Feature 4 */}
                            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition duration-300">
                                <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-blue-100 mb-4">
                                    <img src="https://cdn-icons-png.flaticon.com/512/891/891462.png" className="w-8" alt="Free Goodies" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold text-blue-900 mb-2">Free Goodies</h3>
                                <p className="text-gray-600 text-sm sm:text-base">Every laptop comes with exclusive free goodies just for you.</p>
                            </div>

                        </div>
                    </div>
                </section>

                <section className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from--green-900 to--green-900 overflow-hidden">
                    <div className="max-w-5xl mx-auto text-center relative z-10">

                        {/* Heading */}
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 animate-bounce">
                            Your Perfect Laptop Awaits 🚀
                        </h2>

                        {/* Paragraph */}
                        <p className="text-base sm:text-lg md:text-xl text-white/90 mb-10 px-2 sm:px-0">
                            Don’t wait for seasonal sales. At
                            <span className="font-bold"> BMC </span>, every day is a deal day.
                            Stocks are limited — grab yours now!
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                            <button onClick={handleBuyNow}
                                className="relative inline-block px-8 sm:px-10 py-3 sm:py-4 text-lg sm:text-xl font-bold text-white bg-gradient-to-r from--green-900 via--green-900 to--green-900 rounded-lg shadow-xl hover:scale-105 hover:shadow-2xl transition transform duration-300">
                                Buy Now 🛒
                                <span className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                            </button>
                            <a href={`tel:+917904303676`}
                                className="inline-block px-8 sm:px-10 py-3 sm:py-4 font-semibold text-emerald-700 text-lg sm:text-xl bg-white rounded-lg shadow hover:scale-105 transition transform duration-300">
                                Contact Us 📞
                            </a>
                        </div>

                    </div>

                    {/* Background Effects */}
                    <div className="absolute -top-20 -left-20 w-64 sm:w-80 h-64 sm:h-80 bg-white/10 rounded-full blur-3xl animate-spin-slow"></div>
                    <div className="absolute -bottom-20 -right-16 w-72 sm:w-96 h-72 sm:h-96 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
                </section>

                <section className="relative bg-blue-50 mt-12 py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#6b4f1a] mb-4">
                            Frequently Asked Questions (FAQ)
                        </h2>
                        <p className="text-gray-700 text-base sm:text-lg px-2 sm:px-0">
                            Have questions about our refurbished laptops? We’ve got you covered.
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-4">

                        <details className="bg-white rounded-2xl shadow-md p-5 sm:p-6 group">
                            <summary className="flex justify-between items-center font-semibold text-blue-900 cursor-pointer list-none text-base sm:text-lg">
                                Are refurbished laptops reliable?
                                <span className="transition-transform duration-300 group-open:rotate-45 text-xl sm:text-2xl">+</span>
                            </summary>
                            <p className="mt-3 text-gray-600 text-sm sm:text-base">
                                Yes! Every laptop is thoroughly tested, cleaned, and restored to ensure it works like new. At BMC, we also provide a 1-year warranty for peace of mind.
                            </p>
                        </details>

                        <details className="bg-white rounded-2xl shadow-md p-5 sm:p-6 group">
                            <summary className="flex justify-between items-center font-semibold text-blue-900 cursor-pointer list-none text-base sm:text-lg">
                                What is the difference between refurbished and second-hand laptops?
                                <span className="transition-transform duration-300 group-open:rotate-45 text-xl sm:text-2xl">+</span>
                            </summary>
                            <p className="mt-3 text-gray-600 text-sm sm:text-base">
                                Second-hand laptops are sold “as is.” Refurbished laptops are professionally tested, repaired, and quality-checked before being resold, making them far more reliable.
                            </p>
                        </details>

                        <details className="bg-white rounded-2xl shadow-md p-5 sm:p-6 group">
                            <summary className="flex justify-between items-center font-semibold text-blue-900 cursor-pointer list-none text-base sm:text-lg">
                                Will the laptop look new?
                                <span className="transition-transform duration-300 group-open:rotate-45 text-xl sm:text-2xl">+</span>
                            </summary>
                            <p className="mt-3 text-gray-600 text-sm sm:text-base">
                                Most refurbished laptops are in excellent condition with only minor cosmetic signs of use (if any). The performance is tested to ensure smooth working.
                            </p>
                        </details>

                        <details className="bg-white rounded-2xl shadow-md p-5 sm:p-6 group">
                            <summary className="flex justify-between items-center font-semibold text-blue-900 cursor-pointer list-none text-base sm:text-lg">
                                What about warranty and support?
                                <span className="transition-transform duration-300 group-open:rotate-45 text-xl sm:text-2xl">+</span>
                            </summary>
                            <p className="mt-3 text-gray-600 text-sm sm:text-base">
                                BMC offers a 1-year warranty and after-sales support on all refurbished laptops. So you’re covered in case of any issues.
                            </p>
                        </details>

                        <details className="bg-white rounded-2xl shadow-md p-5 sm:p-6 group">
                            <summary className="flex justify-between items-center font-semibold text-blue-900 cursor-pointer list-none text-base sm:text-lg">
                                Why should I buy a refurbished laptop instead of a new one?
                                <span className="transition-transform duration-300 group-open:rotate-45 text-xl sm:text-2xl">+</span>
                            </summary>
                            <p className="mt-3 text-gray-600 text-sm sm:text-base">
                                Refurbished laptops give you high performance at a fraction of the cost. You can save big while still enjoying branded, reliable laptops with warranty protection.
                            </p>
                        </details>

                    </div>
                </section>



                {/* Related Products */}


                {/* Details */}


                {mobileModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center px-4">
                        <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative">
                            <button
                                className="absolute top-2 right-3 text-gray-500 hover:text-gray-800"
                                onClick={() => setMobileModal(false)}
                            >
                                &times;
                            </button>
                            <h2 className="text-xl font-bold mb-4">Enter Your Mobile Number</h2>
                            <form onSubmit={handleMobileSubmit} className="space-y-4">
                                <input
                                    type="tel"
                                    value={mobileNumber}
                                    onChange={(e) => {
                                        const input = e.target.value;
                                        // Allow only digits and limit to 10 characters
                                        if (/^\d{0,10}$/.test(input)) {
                                            setMobileNumber(input);
                                        }
                                    }}
                                    placeholder="Please enter mobile number"
                                    className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring--green-900"
                                    required
                                    maxLength={10}
                                    pattern="^\d{10}$"
                                    title="Enter a valid 10-digit mobile number"
                                />
                                <button
                                    type="submit"
                                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-900"
                                    disabled={loadingMobile}
                                >
                                    {loadingMobile ? 'Checking...' : 'Submit'}
                                </button>
                            </form>

                        </div>
                    </div>
                )}

            </div>

            {showAddressModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-[999] flex justify-center px-4 overflow-auto">
                    <div className="bg-white mt-4 max-w-lg p-6 rounded shadow-lg relative max-h-[90vh] overflow-y-auto w-full">
                        <button
                            className="absolute top-2 right-3 text-gray-500 hover:text-gray-800"
                            onClick={() => {
                                setShowAddressModal(false);
                                setIsAddingNewAddress(false); // Reset form view on close
                            }}
                        >
                            &times;
                        </button>

                        {/* ✅ Show form directly if no address or isAddingNewAddress is true */}
                        {(!userExists || address?.data?.length === 0 || isAddingNewAddress) ? (
                            <>
                                <h2 className="text-xl font-bold mb-4 flex gap-3">
                                    <ArrowLeft onClick={() => setIsAddingNewAddress(false)} className='mt-1 cursor-pointer' size={18} /> Add Shipping Address</h2>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    {/* Name */}
                                    <div>
                                        <label className="block mb-1 font-medium text-xs">Name</label>
                                        <input
                                            type="text"
                                            {...register('name', { required: 'Name is required' })}
                                            placeholder="Name"
                                            className={`${inputClass} ${errors.name ? 'border-red-500' : ''}`}
                                        />
                                        {typeof errors.name?.message === 'string' && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block mb-1 font-medium text-xs">Email</label>
                                        <input
                                            type="email"
                                            {...register('email_address', { required: 'Email is required' })}
                                            placeholder="Email"
                                            className={`${inputClass} ${errors.email_address ? 'border-red-500' : ''}`}
                                        />
                                        {typeof errors.email_address?.message === 'string' && <p className="text-red-500 text-xs mt-1">{errors.email_address.message}</p>}
                                    </div>

                                    {/* Contact Number */}
                                    <div>
                                        <label className="block mb-1 font-medium text-xs">Mobile Number</label>
                                        <input
                                            type="text"
                                            {...register('contact_number', {
                                                required: 'Mobile number is required',
                                                pattern: {
                                                    value: /^[0-9]{10}$/,
                                                    message: 'Enter a valid 10-digit number',
                                                },
                                            })}
                                            placeholder="Mobile Number"
                                            maxLength={10}
                                            className={`${inputClass} ${errors.contact_number ? 'border-red-500' : ''}`}
                                        />
                                        {typeof errors.contact_number?.message === 'string' && <p className="text-red-500 text-xs mt-1">{errors.contact_number.message}</p>}
                                    </div>

                                    {/* Address Line 1 */}
                                    <div>
                                        <label className="block mb-1 font-medium text-xs">Address Line 1</label>
                                        <textarea
                                            {...register('address_line1', { required: 'Address Line 1 is required' })}
                                            placeholder="Address Line 1"
                                            className={`${inputClass} ${errors.address_line1 ? 'border-red-500' : ''}`}
                                            rows={4}
                                        />
                                        {typeof errors.address_line1?.message === 'string' && <p className="text-red-500 text-xs mt-1">{errors.address_line1.message}</p>}
                                    </div>

                                    {/* Address Line 2 (Hidden) */}
                                    <input
                                        {...register('address_line2')}
                                        placeholder="Address Line 2"
                                        className={`${inputClass} hidden`}
                                    />

                                    {/* Landmark (Optional) */}
                                    <div>
                                        <label className="block mb-1 font-medium text-xs">Landmark <span className="text-gray-400 text-sm">(optional)</span></label>
                                        <input
                                            {...register('landmark')}
                                            placeholder="Landmark"
                                            className={inputClass}
                                        />
                                    </div>

                                    {/* Postal Code */}
                                    <div>
                                        <label className="block mb-1 font-medium text-xs">Postal Code</label>
                                        <input
                                            {...register('postal_code', { required: 'Postal code is required' })}
                                            placeholder="Postal Code"
                                            className={`${inputClass} ${errors.postal_code ? 'border-red-500' : ''}`}
                                        />
                                        {typeof errors.postal_code?.message === 'string' && <p className="text-red-500 text-xs mt-1">{errors.postal_code.message}</p>}
                                    </div>

                                    {/* City */}
                                    <div>
                                        <label className="block mb-1 font-medium text-xs">City</label>
                                        <input
                                            {...register('city', { required: 'City is required' })}
                                            placeholder="City"
                                            className={`${inputClass} ${errors.city ? 'border-red-500' : ''}`}
                                        />
                                        {typeof errors.city?.message === 'string' && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                                    </div>

                                    {/* State */}
                                    <div>
                                        <label className="block mb-1 font-medium text-xs">State</label>
                                        <input
                                            {...register('state', { required: 'State is required' })}
                                            placeholder="State"
                                            className={`${inputClass} ${errors.state ? 'border-red-500' : ''}`}
                                        />
                                        {typeof errors.state?.message === 'string' && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
                                    </div>

                                    {/* Country */}
                                    <div>
                                        <label className="block mb-1 font-medium text-xs">Country</label>
                                        <input
                                            {...register('country', { required: 'Country is required' })}
                                            placeholder="Country"
                                            defaultValue='India'
                                            className={`${inputClass} ${errors.country ? 'border-red-500' : ''}`}
                                        />
                                        {typeof errors.country?.message === 'string' && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
                                    </div>

                                    {/* Address Type */}
                                    <div>
                                        <label className="block mb-1 font-medium text-xs">Address Type</label>
                                        <select
                                            {...register('address_type', { required: 'Please select an address type' })}
                                            className={`${inputClass} ${errors.address_type ? 'border-red-500' : ''}`}
                                        >
                                            <option value="">Select Address Type</option>
                                            <option value="Home">Home</option>
                                            <option value="Work">Work</option>
                                        </select>
                                        {typeof errors.address_type?.message === 'string' && <p className="text-red-500 text-xs mt-1">{errors.address_type.message}</p>}
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="w-full text-center bg-green-600 text-white py-2 rounded hover:bg-green-900"
                                    >
                                        <span className='flex gap-2 justify-center'>Next <ArrowRight className='mt-1' size={18} /></span>
                                    </button>
                                </form>
                            </>
                        ) : (
                            <>
                                {/* ✅ Address List */}
                                <h3 className="font-semibold text-lg mb-4">Select a Shipping Address:</h3>
                                <div className="space-y-3">
                                    {address?.data
                                        ?.slice() // create a shallow copy to avoid mutating original data
                                        .sort((a: any, b: any) => a.address_line1.localeCompare(b.address_line1))
                                        .map((address: any) => (
                                            <label
                                                key={address.id}
                                                className="flex items-start gap-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition"
                                            >
                                                <input
                                                    type="radio"
                                                    name="selectedAddress"
                                                    value={address.id}
                                                    checked={selectedAddressId == address.id}
                                                    onChange={() => handleSelectAddress(address)}
                                                    className="mt-1 accent--green-900 focus:ring--green-900 h-4 w-4 border-gray-300 rounded"
                                                />

                                                <div className="flex flex-col space-y-1 text-gray-800">
                                                    <span className="font-semibold">{address.address_type}</span>
                                                    <span>{address.address_line1}</span>
                                                    <span>
                                                        {address.city}, {address.state} - {address.postal_code}
                                                    </span>
                                                </div>
                                            </label>
                                        ))}
                                </div>


                                {/* ✅ Add new address CTA */}
                                <button
                                    className="mt-4 text--green-900 hover:underline"
                                    onClick={() => setIsAddingNewAddress(true)} // show the form
                                >
                                    + Add New Address
                                </button>

                                {deliveryInfo && (
                                    <div className="bg-white rounded-md shadow p-4 mt-4 space-y-2">
                                        <h3 className="text-xl font-semibold border-b pb-2">Payment Details</h3>
                                        <div className="flex justify-between text-gray-700">
                                            <span>Subtotal:</span>
                                            <span className="font-medium text-black">{formatPrice(productDetails?.price * localQty)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-700">
                                            <span>Delivery Charge:</span>
                                            <span className="font-medium text-black">{formatPrice(deliveryInfo?.own_delivery_charge)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-700">
                                            <span>Total Price:</span>
                                            <span className="font-medium text-black">{formatPrice(Number(deliveryInfo?.own_delivery_charge) + Number(productDetails?.price * localQty))}</span>
                                        </div>
                                    </div>
                                )}

                                <button className="w-full mt-10 p-2 flex gap-2 justify-center bg-green-600 cursor-pointer hover:bg-green-900 text-white font-bold" onClick={placeOrder}>Proceed to Checkout</button>
                                <span className='text-red-500 p-2'>{errorMessage}</span>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
