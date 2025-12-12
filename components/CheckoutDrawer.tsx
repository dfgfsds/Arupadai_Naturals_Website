'use client';

import { getDeliveryChargeApi, patchUserSelectAddressAPi } from '@/api-endpoints/authendication';
import { deleteCouponApi, getAddressApi, getAllCouponsApi, getAppliedCouponDataApi, postApplyCouponApi } from '@/api-endpoints/CartsApi';
import { InvalidateQueryFilters, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Loader2, MapPin, X } from 'lucide-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useVendor } from '@/context/VendorContext';
import { useUser } from '@/context/UserContext';
import { useCartItem } from '@/context/CartItemContext';
import Image from 'next/image';
import check from "../public/check.png";
import { baseUrl } from '@/api-endpoints/ApiUrls';

interface CheckoutSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    subtotal: any;
}

const CheckoutDrawer = ({ isOpen, onClose, subtotal }: CheckoutSidebarProps) => {


    const [getUserName, setUserName] = useState<string | null>(null);
    const [getCartId, setCartId] = useState<string | null>(null);
    const [selectedAddressId, setSelectedAddressId] = useState<string>();
    const [paymentValue, setPaymentValue] = useState('')
    const [deliveryInfo, setDeliveryInfo] = useState<any>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showFailureModal, setShowFailureModal] = useState(false);
    const queryClient = useQueryClient();
    const router = useRouter();
    const { vendorId } = useVendor()
    const { user } = useUser();
    const [code, setCode] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const [error, setError] = useState('');
    const [couponLoader, setCouponloader] = useState(false);
    const [DeliveryChargeValue, setDeliveryChargeValue] = useState<any>()
    const [addressError, setAddressError] = useState<any>('');
    const { refetchCart } = useCartItem();

    const [userId, setUserId] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState("");

    useEffect(() => {
        try {
            const storedUserId = localStorage.getItem('userId');
            const storedCartId = localStorage.getItem('cartId');
            const storedUserName = localStorage.getItem('userName');

            setUserName(storedUserName);
            setUserId(storedUserId);
            setCartId(storedCartId);
            setUserId(storedUserId);

        } catch (e) {
            console.error("Failed to access localStorage", e);
        }
    }, []);


    useEffect(() => {
        setUserName(user?.data?.name);
        setUserId(user?.data?.id);
    }, [user]);

    const { data, isLoading }: any = useQuery({
        queryKey: ['getAddressData', userId],
        queryFn: () => getAddressApi(`user/${userId}`)
    });

    useEffect(() => {
        if (data?.data?.length) {
            const selected = data?.data?.find((address: any) => address?.selected_address === true);
            if (selected?.id) {
                setSelectedAddressId(String(selected?.id));
            }
        }
    }, [data]);

    const handleSelectAddress = async (id: any) => {
        try {
            const upadetApi = await patchUserSelectAddressAPi(`user/${userId}/address/${id?.id}`, { updated_by: getUserName || 'User' })
            if (upadetApi) {
                queryClient.invalidateQueries(['getAddressData'] as InvalidateQueryFilters);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getDeliveryCharge = async () => {

        try {
            const userId = user?.data?.id;
            if (!userId) throw new Error("User ID not found");
            const res = await axios.get(`${baseUrl}/vendor-site-payment-delivery-partner-details/${vendorId}/`)
            setDeliveryInfo(res.data[0]);
            console.log(res?.data[0]?.own_delivery_charge, "delivery");

        } catch (error) {
            console.error("Error fetching delivery charge:", error);
        }
    }

    useEffect(() => {
        getDeliveryCharge()
    }, [paymentMethod])
    // getAppliedCouponDataApi
    const getAppliedCouponData: any = useQuery({
        queryKey: ['getAppliedCouponDataData', userId],
        queryFn: () => getAppliedCouponDataApi(`?user_id=${userId}`),
        enabled: !!userId
    })

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError('');
        setIsChecking(true);

        const payload = {
            user_id: Number(userId),
            coupon_code: code,
            vendor_id: vendorId,
            updated_by:
                getUserName && getUserName.trim().toLowerCase() !== "null" && getUserName.trim() !== ""
                    ? getUserName
                    : "user",
        };

        try {
            const updateApi = await postApplyCouponApi("", payload);
            if (updateApi) {
                queryClient.invalidateQueries(['getAppliedCouponDataData'] as InvalidateQueryFilters);
                fetchCartAndDeliveryCharge();
                setError('');
            }
        } catch (error: any) {
            setError(error?.response?.data?.error || "Failed to apply coupon. Please try again.");
        } finally {
            setIsChecking(false);
        }
    };

    const fetchCartAndDeliveryCharge = async () => {
        try {
            if (user?.data?.contact_number && userId && vendorId) {
                const deliveryResponse: any = await getDeliveryChargeApi('', {
                    user_id: userId,
                    vendor_id: vendorId,
                    payment_mode: paymentMethod,
                    customer_phone: user?.data?.contact_number,
                });

                if (deliveryResponse) {
                    setDeliveryChargeValue(deliveryResponse?.data);
                    setAddressError(null);
                }
            }
        } catch (error: any) {
            setAddressError(error?.response?.data?.error || "Something went wrong, Please try again later");
        }
    };

    useEffect(() => {
        if (getCartId) {
            fetchCartAndDeliveryCharge();
        }
    }, [getCartId, userId, vendorId, user?.data?.contact_number, paymentMethod]);
    const RAZOR_PAY_KEY = 'rzp_live_RhbuaTm188iTRs';

    const handleCouponSubmit = async (e: any) => {
        e.preventDefault();
        setError('');
        setIsChecking(true);

        const payload = {
            user_id: Number(userId),
            coupon_code: code,
            vendor_id: vendorId,
            updated_by: getUserName || 'user'
        };

        try {
            const updateApi = await postApplyCouponApi("", payload);
            if (updateApi) {
                fetchCartAndDeliveryCharge();
                getDeliveryCharge();
                queryClient.invalidateQueries(['getAllCouponsData'] as InvalidateQueryFilters);
            }
        } catch (error: any) {
            setError(error?.response?.data?.error || "Failed to apply coupon. Please try again.");
        } finally {
            setIsChecking(false);
        }
    };

    const placeOrder = async () => {
        try {
            const userId = user?.data?.id;
            if (!userId) throw new Error("User ID not found");
            if (!selectedAddressId) throw new Error("No address selected");

            const payload = {
                user_id: parseInt(userId),
                vendor_id: vendorId,
                customer_phone: user?.data?.contact_number,
            };

            if (paymentMethod === "cod") {
                const response = await axios.post(`${baseUrl}/cod-pay-now/`, payload);
                console.log("COD Order placed:", response.data);
                refetchCart();
                setShowSuccessModal(true);

                setTimeout(() => {
                    setShowSuccessModal(false);
                    router.push("/profile?tab=Orders");
                }, 5000);
            } else {
                const response = await axios.post(`${baseUrl}/prepaid-pay-now/`, payload);
                const { payment_order_id, final_price } = response.data;

                const options = {
                    key: RAZOR_PAY_KEY,
                    amount: final_price * 100,
                    currency: "INR",
                    name: "Arupadai Naturals",
                    description: "Order Payment",
                    order_id: payment_order_id,
                    handler: function (response: any) {
                        console.log("Payment Success:", response);
                        refetchCart();
                        setShowSuccessModal(true);

                        setTimeout(() => {
                            setShowSuccessModal(false);
                            router.push("/orders");
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
                        color: "#16A34A",
                    },
                };

                const razor = new (window as any).Razorpay(options);
                razor.open();
            }
        } catch (error) {
            console.error("Error placing order:", error);
            setShowFailureModal(true);
            setTimeout(() => {
                setShowFailureModal(false);
                router.push("/cart");
            }, 5000);
        }
    };

    function formatPrice(price: number): string {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
        }).format(price);
    }

    // getAllCouponsData
    const getAllCouponsData: any = useQuery({
        queryKey: ['getAllCouponsData', vendorId],
        queryFn: () => getAllCouponsApi(`?vendor_id=${vendorId}`),
        // enabled: !!vendorId
    })
    const availableCoupons = getAllCouponsData?.data?.data?.data

    const handleRemoveCoupon = async () => {
        setCouponloader(true);
        try {
            const updateAPi = await deleteCouponApi(`${getCartId}/coupon/${getAppliedCouponData?.data?.data?.applied_coupons[0]?.coupon_id}/remove/`, { updated_by: getUserName ? getUserName : 'user' })
            if (updateAPi) {
                fetchCartAndDeliveryCharge();
                setCouponloader(false);
                queryClient.invalidateQueries(['getAppliedCouponDataData'] as InvalidateQueryFilters);
                setError('');
                setCode('');
            }
        } catch (error) {

        }
    }


    if (!isOpen) return null;

    return (
        <>
            {/* Sidebar Drawer */}
            <div
                className={`fixed overflow-x-scroll top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-lg transform transition-transform duration-300 z-[10001] ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold">Checkout</h2>
                    <X className="cursor-pointer" onClick={onClose} />
                </div>

                <div className="p-4 space-y-6">

                    {data?.data?.length ? (
                        <div className="space-y-2">
                            <p className="mt-2 inline-block text-sm text--green-900 hover:text-[#6b4f1a] cursor-pointer flex justify-end"
                                onClick={() => { router.push('/profile?tab=Address') }}>Manage address</p>
                            {data?.data
                                ?.map((address: any) => (
                                    <label
                                        key={address.id}
                                        className={`flex items-start p-3 rounded-lg border cursor-pointer
                                 ${selectedAddressId === address.id ? 'border--green-900 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                                    >
                                        <input
                                            type="radio"
                                            name="deliveryAddress"
                                            value={address.id}
                                            checked={selectedAddressId === String(address.id)}
                                            onChange={() => { handleSelectAddress(address) }}
                                            className="mt-1 h-4 w-4 text--green-900 border-gray-300 focus:ring--green-900"
                                        />
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">
                                                {address.street}
                                                {address.isDefault && (
                                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                        Default
                                                    </span>
                                                )}
                                            </p>
                                            <p className="text-sm text-gray-800">
                                                {address.address_type}
                                            </p>
                                            <p className="text-sm text-gray-800">
                                                {address.email_address} | {address.contact_number}
                                            </p>
                                            <p className="text-sm text-black">
                                                {address.city}, {address.state} {address.zipCode}
                                            </p>
                                        </div>
                                    </label>
                                ))}
                        </div>
                    ) : (

                        <div className="text-center p-4 bg-gray-50 rounded-lg mb-3">
                            <MapPin className="mx-auto h-8 w-8 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-600">No delivery address found</p>
                            <p className="mt-2 inline-block text-sm text--green-900 hover:text-[#6b4f1a] cursor-pointer"
                                onClick={() => {
                                    router.push('/profile?tab=addresses')
                                }
                                    //  setOpenMoadl(!openModal)
                                }
                            >
                                Add a delivery address
                            </p>
                        </div>

                    )}
                    {/* Payment Method */}
                    {/* <div className="mb-4">
                        <label className="block text-black mb-2 font-medium text-sm font-squares">Payment Method</label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full p-2 rounded-md  border border-gray-600"
                        >
                            <option value="">Prepaid</option>
                            <option value="cod">Cash on Delivery (COD)</option>
                        </select>
                    </div> */}

                    {getAppliedCouponData?.data?.data?.applied_coupons?.length ? (
                        <>
                            <div className="bg-green-50 p-4 rounded-lg space-y-2 flex justify-between">
                                <div className=''>
                                    <p className="text-sm text-green-700 font-bold mb-2">
                                        Applied Coupon: {getAppliedCouponData?.data?.data?.data[0]?.code}
                                    </p>

                                    <p className="text-sm text-green-700 font-bold">
                                        Discount Amount: ₹{getAppliedCouponData?.data?.data?.applied_coupons[0]?.discount || 0}
                                    </p>
                                </div>
                                <button
                                    onClick={handleRemoveCoupon}
                                    className="text-[#a5291b] border-red-300 hover:bg-red-50"
                                >
                                    Remove Coupon
                                </button>
                            </div>
                        </>
                    ) : (
                        <div>
                            <h2 className="text-lg font-semibold mb-1">Coupon</h2>
                            <div className="flex items-center gap-2 mb-2">
                                <input
                                    type="text"
                                    placeholder="Discount code"
                                    className={`bg-white w-full p-2 ${error ? 'border-[#a5291b] shadow-md border-2 rounded-md' : 'border-gray-300'}`}
                                    value={code}
                                    onChange={(e: any) => setCode(e.target.value.toUpperCase())}
                                />
                                <button disabled={!code || isChecking} onClick={handleCouponSubmit} className="whitespace-nowrap bg-green-600 hover:bg-green-900 p-2 rounded-md text-white font-bold ">

                                    {isChecking ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        'Apply'
                                    )}
                                </button>
                            </div>
                            {error && (
                                <p className="text-sm text-[#a5291b]">{error ? error : 'Coupon not found!'}</p>
                            )}

                            {availableCoupons
                                ?.filter((coupon: any) => {
                                    if (!coupon?.allowed_users?.length) return true;
                                    return coupon?.allowed_users?.includes(userId);
                                })
                                ?.map((coupon: any) => (
                                    <div
                                        key={coupon.id}
                                        onClick={() => {
                                            setCode(coupon?.code);
                                            // handleSelectCoupon(coupon?.code); // ✅ auto apply on click
                                        }}
                                        className="cursor-pointer border mb-1 border-gray-200 bg-white rounded-lg p-3 hover:bg-gray-50 transition-all"
                                    >
                                        <div className="flex justify-between">
                                            <span className="font-bold text-[#b39e49]">{coupon?.code}</span>
                                            <span className="text-sm text-gray-600">
                                                {coupon?.discount_type === "percentage"
                                                    ? `${coupon?.discount_value}% OFF`
                                                    : `₹${coupon?.flat_discount} OFF`}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500">{coupon?.description}</p>
                                    </div>
                                ))}
                        </div>
                    )}


                    {/* Delivery Charge */}
                    <div className="border-t pt-4">

                    </div>
                    <>
                        <div className="border-t pt-4 space-y-2">
                            <p className="text-sm flex justify-between">
                                <span>Sub Total:</span>
                                <span className="font-semibold">{formatPrice(Number(subtotal))}</span>
                            </p>

                            <p className="text-sm flex justify-between">
                                <span>Delivery Charges:</span>
                                <span className="font-semibold">
                                    {formatPrice(Number(DeliveryChargeValue?.final_delivery_charge))}
                                </span>
                            </p>

                            {getAppliedCouponData?.data?.data?.applied_coupons[0]?.discount && (
                                <p className="text-sm flex justify-between">
                                    <span>Discount Amount:</span>
                                    <span className="font-semibold text-green-600">
                                        -₹{getAppliedCouponData?.data?.data?.applied_coupons[0]?.discount || 0}
                                    </span>
                                </p>
                            )}

                            <div className="border-t pt-3 mt-3 flex justify-between items-center text-base font-semibold">
                                <span>
                                    Total <span className="text-sm font-normal text-gray-500">(including delivery)</span>
                                </span>
                                <span>{formatPrice(Number(DeliveryChargeValue?.final_price_including_delivery))}</span>
                            </div>
                        </div>
                    </>

                    {/* Place Order Button */}
                    <button
                        onClick={placeOrder}
                        disabled={!selectedAddressId}
                        className="w-full bg-green-600 hover:bg-green-900 text-white py-2 px-4 rounded-md font-medium transition"
                    >
                        Place Order
                    </button>
                </div>
            </div >

            {/* Backdrop */}
            {
                isOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={() => onClose()}
                    />
                )
            }
            {showSuccessModal && (
                <div className="fixed inset-0 z-[10010] flex items-center justify-center bg-black/50">

                    <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm ">
                        <Image alt='image' className='mx-auto mb-3' src={check} width={100} height={100} />
                        <h2 className="text-lg font-bold text-green-600 mb-2">Order Placed Successfully!</h2>
                        <p className="text-gray-600">You will be redirected to your orders shortly...</p>
                    </div>
                </div>
            )}

            {/* Failure Modal */}
            {showFailureModal && (
                <div className="fixed inset-0 z-[10010] flex items-center justify-center bg-black/50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm">
                        <h2 className="text-lg font-bold text-red-600 mb-2">Order Failed</h2>
                        <p className="text-gray-600">You will be redirected back to your cart.</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default CheckoutDrawer;
