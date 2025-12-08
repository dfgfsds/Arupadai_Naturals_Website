'use client';

import { deleteAddressApi, deleteCartitemsApi, getAddressApi, getOrdersAndOrdersItemsApi, postCartitemApi, updateCartitemsApi } from '@/api-endpoints/CartsApi';
import { useVendor } from '@/context/VendorContext';
import { formatDate, formatPrice, slugConvert } from '@/lib/utils';
import { InvalidateQueryFilters, useQuery, useQueryClient } from '@tanstack/react-query';
import { Heart, MapPin, Package, Pencil, Plus, ShoppingCart, Trash } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import AddressForm from './AddressForm';
import { patchUserSelectAddressAPi, updateUserAPi } from '@/api-endpoints/authendication';
import { useUser } from '@/context/UserContext';
import Image from 'next/image';
import { useProducts } from '@/context/ProductsContext';
import { useCartItem } from '@/context/CartItemContext';
import { useWishList } from '@/context/WishListContext';
import { deleteWishListApi, postWishListApi } from '@/api-endpoints/products';
import Link from 'next/link';
import toast from 'react-hot-toast';


const tabs = ['Orders', 'Wishlist', 'Address', 'Account Info'];

export default function Profile() {

    const router = useRouter();
    const [activeTab, setActiveTab] = useState('Orders');
    const [userId, setUserId] = useState<string | null>(null);
    useEffect(() => {
        if (router.isReady) {
            const tabFromQuery = router.query.tab as string;
            if (tabFromQuery) {
                setActiveTab(tabFromQuery);
            }
        }
    }, [router.isReady, router.query.tab]);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (!storedUserId) {
            router.push('/login'); // 👈 Redirect if not logged in
        } else {
            setUserId(storedUserId);
        }
    }, [router]);
    // Optional: prevent rendering until check is done
    if (!userId) return null;

    return (
        <div className="max-w-5xl mx-auto px-4 py-10 bg-white shadow rounded-lg my-4">
            <h1 className="text-2xl font-bold text-center mb-8 text--green-900">My Account</h1>

            {/* Tab Buttons */}
            <div className="flex flex-wrap justify-center gap-4 border-b pb-2 mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        className={`px-4 py-2 font-medium rounded-t-md ${activeTab === tab
                            ? 'text--green-900 border-b-2 border--green-900'
                            : 'text-gray-600 hover:text--green-900'
                            }`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="p-4 bg-gray-50 rounded-md">
                {activeTab === 'Orders' && <OrdersTab />}
                {activeTab === 'Wishlist' && <WishlistTab />}
                {activeTab === 'Address' && <AddressTab />}
                {activeTab === 'Account Info' && <AccountInfoTab />}
            </div>
        </div>
    );
}

// Dummy Tab Components
function OrdersTab() {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const { vendorId } = useVendor();

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        setUserId(storedUserId);
    }, []);

    const { data } = useQuery({
        queryKey: ['getOrdersAndOrdersItemsApiData', userId, vendorId],
        queryFn: () => getOrdersAndOrdersItemsApi(`?vendor_id=${vendorId}&user_id=${userId}`),
        enabled: !!userId && !!vendorId,
    });

    const orders = data?.data || [];

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Orders</h2>

            {orders.length > 0 ? (
                <div className="space-y-6">
                    {orders.map((order: any) => (
                        <div
                            key={order.id}
                            className="rounded-lg border bg-white shadow-sm hover:shadow-md transition-shadow"
                        >
                            {/* Order summary header */}
                            <div className=" p-4 flex flex-wrap justify-between gap-4 rounded-t-lg">
                                <div>
                                    <p className="text-sm text-gray-500">Order Placed</p>
                                    <p className="font-medium text-gray-800">{formatDate(order.created_at)}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Order ID</p>
                                    <p className="font-medium text-gray-800">#{order.id}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Total</p>
                                    <p className="font-medium text--green-900">{formatPrice(order.total_amount)}</p>
                                </div>

                                <div>
                                    <span
                                        className={`px-3 py-1 text-xs font-semibold rounded-full ${order.status === 'Delivered'
                                            ? 'bg-green-100 text-green-800'
                                            : order.status === 'Pending'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : order.status === 'Processing'
                                                    ? 'bg-blue-100 text-[#6b4f1a]'
                                                    : order.status === 'Shipped'
                                                        ? 'bg-indigo-100 text-indigo-700'
                                                        : order.status === 'Cancelled'
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            {/* Order items */}
                            <div className="p-4 bg-gray-50 space-y-4">
                                {order.order_items.map((product: any) => (
                                    <div
                                        key={product.id}
                                        className="flex items-center gap-4 border-b pb-4 last:border-none"
                                    >
                                        <div className="w-16 h-16 rounded overflow-hidden bg-white border">
                                            <Image
                                                src={
                                                    product?.product?.image_urls?.[0] ||
                                                    'https://semantic-ui.com/images/wireframe/image.png'
                                                }
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                                height={100}
                                                width={100}
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-800">{product?.product?.name}</p>
                                            <p className="text-xs text-gray-500">Qty: {product.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-white shadow rounded-md">
                    <Package className="mx-auto h-10 w-10 text-gray-400" />
                    <h3 className="mt-3 text-md font-semibold text-gray-800">No Orders Found</h3>
                    <p className="text-sm text-gray-500">Looks like you haven't placed any orders yet.</p>
                </div>
            )}
        </div>
    );
}

function WishlistTab() {
    const [getUserId, setUserId] = useState<string | null>(null);
    const [getCartId, setCartId] = useState<string | null>(null);
    const [getUserName, setUserName] = useState<string | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [signInmodal, setSignInModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { products, isLoading }: any = useProducts();
    const { vendorId } = useVendor();
    const queryClient = useQueryClient();
    const { cartItem }: any = useCartItem();
    const { wishList, wishListLoading }: any = useWishList();
    const router = useRouter();

    useEffect(() => {
        setUserId(localStorage.getItem('userId'));
        setCartId(localStorage.getItem('cartId'));
        setUserName(localStorage.getItem('userName'));
    }, []);



    const matchingProductsArray = products?.data
        ?.filter((product: any) =>
            wishList?.data?.some((wish: any) => wish?.product === product?.id)
        ) // ✅ keep only wishlist-matched products
        ?.map((product: any, index: number) => {
            const matchingCartItem = cartItem?.data?.find(
                (item: any) => item?.product === product?.id
            );
            const wishLists = wishList?.data?.find(
                (wish: any) => wish?.product === product?.id
            );

            return {
                ...product,
                Aid: index,
                isLike: true, // ✅ always true because it's in wishlist
                wishListId: wishLists?.id,
                cartQty: matchingCartItem ? matchingCartItem.quantity : 0,
                cartId: matchingCartItem ? matchingCartItem.id : null,
            };
        });


    const handleAddCart = async (id: any, qty: any) => {
        const payload = {
            cart: getCartId,
            product: id,
            user: getUserId,
            vendor: vendorId,
            quantity: qty,
            created_by: getUserName ? getUserName : 'user',
        };
        try {
            const response = await postCartitemApi(``, payload);
            if (response) {
                queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
            }
        } catch (error) { }
    };

    const handleUpdateCart = async (id: any, type: any, qty: any) => {
        try {
            if (qty === 1) {
                const updateApi = await deleteCartitemsApi(`${id}`);
                if (updateApi) {
                    queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
                }
            } else {
                const response = await updateCartitemsApi(`${id}/${type}/`);
                if (response) {
                    queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
                }
            }
        } catch (error) { }
    };

    // postWishListApi
    const handleWishList = async (product: any) => {
        try {
            const updateAPi = await postWishListApi('',
                {
                    user: getUserId,
                    product: product?.id,
                    vendor: vendorId,
                    created_by: vendorId ? `user${vendorId}` : 'user'
                }
            )
            if (updateAPi) {
                queryClient.invalidateQueries(['getProductData'] as InvalidateQueryFilters);
            }
        } catch (error) {
            console.log(error)
        }
    }
    // deleteWishListApi
    const handleDeleteWishList = async (product: any) => {


        try {
            const updateAPi = await deleteWishListApi(`${product?.wishListId}`,
                {
                    deleted_by: vendorId ? `user${vendorId}` : 'user'
                }
            )
            if (updateAPi) {
                queryClient.invalidateQueries(['getProductData'] as InvalidateQueryFilters);
            }
        } catch (error) {

        }
    }
    return (
        <div className="my-8">
            <h2 className="text-lg font-semibold mb-4">Wishlist</h2>

            {matchingProductsArray?.length === 0 ? (
                <p className="text-gray-500">Your wishlist is empty.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {matchingProductsArray?.map((product: any, index: number) => (
                        <div
                            key={index}
                            className="bg-white relative rounded-md group shadow-[0_0_20px_rgba(0,0,0,0.15)] overflow-hidden transition-all duration-300"
                        >
                            {/* ⭐ Rating Badge */}
                            {product?.rating && (
                                <div className="absolute top-2 left-2 bg-[#e4b03f] text-white text-xs font-semibold px-2 py-1 rounded-md shadow z-20">
                                    {product?.rating} / 5.0
                                </div>
                            )}

                            {/* ❤️ Wishlist Button */}
                            {product?.isLike ? (
                                <button
                                    onClick={() => handleDeleteWishList(product)}
                                    className="absolute top-2 right-2 w-10 h-10 md:w-12 md:h-12 bg-red-500 text-white border-[3px] border-white rounded-full flex items-center justify-center shadow hover:bg-red-600 transition-all duration-300 z-10"
                                >
                                    <Heart size={20} />
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleWishList(product)}
                                    className="absolute top-2 right-2 w-10 h-10 md:w-12 md:h-12 bg-gray-200 border-[3px] border-white rounded-full flex items-center justify-center shadow hover:bg-red-500 hover:text-white transition-all duration-300 z-10"
                                >
                                    <Heart size={20} />
                                </button>
                            )}

                            {/* 🖼 Product Image */}
                            <div
                                className="relative p-4"
                                onClick={() => router.push(`/products/${slugConvert(product.name)}`)}
                            >
                                <Image
                                    src={product?.image_urls[0]}
                                    alt={product?.name}
                                    width={280}
                                    height={280}
                                    className="h-52 w-full object-contain mx-auto"
                                />
                            </div>

                            {/* Divider */}
                            <span className="block w-full h-[1px] bg-[#e4b03f]" />

                            {/* 🏷 Product Name */}
                            <h3 className="text-base font-medium text-gray-800 truncate px-4 mt-4 text-center">
                                <Link
                                    href={`/products/${slugConvert(product.name)}`}
                                    className="hover:text--green-900 transition"
                                >
                                    <p className="text-center font-medium truncate">{product.name}</p>
                                </Link>
                            </h3>

                            {/* 💰 Price + MRP in same line */}
                            <div className="text-center mt-3 flex justify-center items-center space-x-2">
                                <p className="text--green-900 text-xl font-semibold">₹{product?.price}</p>
                                {product?.discount && (
                                    <p className="text-gray-400 line-through text-sm">₹{product?.discount}</p>
                                )}
                            </div>

                            {/* 🛒 Add to Cart / Quantity Counter */}
                            {product?.cartQty > 0 ? (
                                <div className="flex items-center justify-center mt-4 mb-4 space-x-4">
                                    <button
                                        onClick={() =>
                                            handleUpdateCart(product?.cartId, "decrease", product?.cartQty)
                                        }
                                        disabled={product.cartQty <= 1}
                                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-900 disabled:opacity-50"
                                    >
                                        −
                                    </button>
                                    <span className="text-[#6b4f1a] font-semibold text-lg">
                                        {product.cartQty}
                                    </span>
                                    <button
                                        onClick={() => handleUpdateCart(product?.cartId, "increase", "")}
                                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-900"
                                    >
                                        +
                                    </button>
                                </div>
                            ) : (
                                <div className="p-4 pt-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            getUserId ? handleAddCart(product.id, 1) : setSignInModal(true);
                                        }}
                                        className="w-full bg-green-600 hover:bg-green-900 hover:text-white text-white py-2 rounded-md font-medium shadow-sm transition-all duration-200"
                                    >
                                        <span className="flex justify-center items-center">
                                            Add to cart
                                            <span className="ml-2 mt-1 align-middle">
                                                <ShoppingCart size={16} />
                                            </span>
                                        </span>
                                    </button>
                                </div>
                            )}
                        </div>

                    ))}
                </div>
            )}
        </div>
    );
}


function AddressTab() {
    const [openModal, setOpenMoadl] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [editData, setEditData] = useState<any>('');
    const [deleteId, setDeleteId] = useState();
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();
    const [getUserName, setUserName] = useState<string | null>(null);
    const { user } = useUser();


    useEffect(() => {

        setUserName(user?.data?.name);
        setUserId(user?.data?.id);
    }, []);

    const { data, isLoading }: any = useQuery({
        queryKey: ['getAddressData', userId],
        queryFn: () => getAddressApi(`user/${userId}`),
        enabled: !!userId,
    });

    const confirmDelete = async () => {
        if (deleteId) {
            setLoading(true);
            const response = await deleteAddressApi(deleteId, { deleted_by: 'user' });
            if (response) {
                queryClient.invalidateQueries(['getAddressData'] as InvalidateQueryFilters);
                setDeleteModal(false);
                setLoading(false);
            }
        }
    };

    const handleSelectAddress = async (id: any) => {
        try {
            const upadetApi = await patchUserSelectAddressAPi(
                `user/${userId}/address/${id?.id}`,
                { updated_by: getUserName }
            );
            if (upadetApi) {
                queryClient.invalidateQueries(['getAddressData'] as InvalidateQueryFilters);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Your Addresses</h2>

                <button
                    onClick={() => {
                        setEditData(null); // Clear existing data
                        setOpenMoadl(true); // Open the modal
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-white font-medium bg-green-600 hover:bg-green-900 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring--green-900"
                >
                    <Plus className="h-4 w-4" />
                    Add New Address
                </button>
            </div>

            {data?.data?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data?.data?.map((address: any) => (
                        <div key={address.id} className="relative border border-gray-200 rounded-lg shadow-sm p-4 bg-white">
                            {/* Default Badge */}
                            {address?.selected_address && (
                                <div className="absolute top-2 right-2">
                                    <span className="bg-green-600/10 text--green-900 text-xs font-medium px-2.5 py-0.5 rounded">
                                        Default
                                    </span>
                                </div>
                            )}

                            {/* Header */}
                            <div className="mb-2">
                                <h3 className="text-base font-semibold uppercase">{address?.address_type}</h3>
                                <p className="text-sm text-gray-500">Shipping Address</p>
                            </div>

                            {/* Address Content */}
                            <div className="text-sm text-gray-700">
                                <span className='font-bold'>{address?.customer_name}</span> <br />
                                {address?.contact_number}<br />
                                {address?.email_address}<br />
                                {address?.address_line1}<br />
                                {address?.address_line2 && (
                                    <>
                                        {address?.address_line2}<br />
                                    </>
                                )}
                                {address?.city}, {address?.state} {address?.postal_code}<br />
                                {address?.country}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 mt-4 flex-wrap">
                                <button
                                    onClick={() => {
                                        setOpenMoadl(!openModal);
                                        setEditData(address);
                                    }}
                                    className="flex items-center gap-1 px-3 py-1.5 border text-sm rounded-md hover:bg-gray-100"
                                >
                                    <Pencil className="w-4 h-4" />
                                    Edit
                                </button>

                                <button
                                    onClick={() => {
                                        setDeleteModal(!deleteModal);
                                        setDeleteId(address?.id);
                                    }}
                                    className="flex items-center gap-1 px-3 py-1.5 border border-red-500 text-sm text-red-600 rounded-md hover:bg-red-50"
                                >
                                    <Trash className="w-4 h-4" />
                                    Remove
                                </button>

                                {!address?.selected_address && (
                                    <button
                                        onClick={() => handleSelectAddress(address)}
                                        className="ml-auto px-3 py-1.5 text-sm border rounded-md hover:bg-gray-100"
                                    >
                                        Set as Default
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                </div>
            ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No addresses</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by adding a new address.</p>
                </div>
            )}

            {deleteModal && (
                <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
                    <div
                        className="bg-white p-4 rounded-lg shadow-lg w-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between">
                            <h2 className="text-xl font-semibold mb-4">Delete Address</h2>
                        </div>

                        <p className="text-sm text-gray-600">
                            Are you sure you want to delete this address?
                        </p>

                        <div className="flex justify-end gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setEditData('');
                                    setLoading(false);
                                    setDeleteModal(false);
                                }}
                                className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                disabled={loading}
                                className="cursor-pointer px-4 py-2 bg-green-600  hover:bg-green-900 text-white rounded-md text-sm font-medium  gap-2 flex"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <AddressForm
                openModal={openModal}
                handleClose={() => setOpenMoadl(!openModal)}
                editData={editData}
            />
        </div>
    );
}


function AccountInfoTab() {
    const { user }: any = useUser();
    const { vendorId } = useVendor();
    const queryClient = useQueryClient();
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });

    useEffect(() => {
        if (user?.data) {
            setFormData({
                name: user.data.name || "",
                email: user.data.email || "",
                phone: user.data.contact_number || "",
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    };
    const handleUpdate = async () => {
        try {
            const response = await updateUserAPi(`/${user?.data?.id}`, {
                ...formData,
                contact_number: formData.phone,
                updated_by: user?.data?.name ? user?.data?.name : 'user',
                role: 3,
                vendor: vendorId,
            });

            if (response) {
                queryClient.invalidateQueries(["gerUserData"] as InvalidateQueryFilters);
                toast.success("Profile updated successfully!", {
                    position: "top-right",
                    duration: 2500,
                });
            }
        } catch (error: any) {
            setErrorMessage(error?.response?.data?.error || "Failed to update profile");
            console.error("Update failed:", error);
            toast.error(error?.response?.data?.message || "Failed to update profile");
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-semibold">Account Info</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter full name"
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring--green-900 focus:border--green-900"
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email address"
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring--green-900 focus:border--green-900"
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone</label>
                    <input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring--green-900 focus:border--green-900"
                    />
                </div>
            </div>
            {errorMessage && (
                <div className=" flex justify-end">
                    <p className="text-sm text-red-600">{errorMessage}</p>
                </div>
            )}
            <div className="flex justify-end">
                <button
                    onClick={handleUpdate}
                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-900 transition"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
}
