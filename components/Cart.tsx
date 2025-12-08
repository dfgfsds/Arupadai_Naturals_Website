'use client';

import { deleteCartitemsApi, updateCartitemsApi } from '@/api-endpoints/CartsApi';
import { getSizesApi, getVariantsProductApi } from '@/api-endpoints/products';
import { useCartItem } from '@/context/CartItemContext';
import { useProducts } from '@/context/ProductsContext';
import EmpImg from '../public/img/character 1.png';
import {
    InvalidateQueryFilters,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import { Minus, Plus, ShoppingCartIcon } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import CheckoutDrawer from './CheckoutDrawer';
import Link from 'next/link';
import Breadcrumb from './Breadcrumb';

export default function Cart() {
    const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient();
    const { cartItem }: any = useCartItem();
    const { products }: any = useProducts();

    const matchingProductsArray = cartItem?.data
        ?.map((item: any, index: number) => {
            const matchingProduct = products?.data?.find(
                (product: any) => product.id === item.product
            );
            return {
                Aid: index,
                cartId: item?.id,
                cartQty: item?.quantity,
                ...matchingProduct,
            };
        })
        ?.sort((a: any, b: any) => a.name?.localeCompare(b.name));

    const totalAmount = matchingProductsArray?.reduce((acc: number, item: any) => {
        const price =
            item.price ?? item?.product_variant_price ?? item?.product_size_price ?? 0;
        return acc + price * (item.cartQty || 1);
    }, 0);

    const handleUpdateCart = async (id: any, type: any, qty: any) => {
        try {
            if (qty === 1 && type === 'decrease') {
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
        } catch (error) {
            console.error('Failed to update cart:', error);
        }
    };

    function formatPrice(price: number): string {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
        }).format(price);
    }
    const breadcrumbItems = [
        { name: 'Home', href: '/' },
        { name: 'Cart', href: '/cart', isActive: true },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-4">
            <div className="container mx-auto px-4 py-6">
                <Breadcrumb items={breadcrumbItems} />
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text--green-900 text-center mb-4">Your Shopping Cart</h1>

                {matchingProductsArray?.length === 0 || matchingProductsArray === undefined ? (
                    <div className="flex flex-col items-center justify-center space-y-6 py-10">
                        {/* <Image src={EmpImg} alt="Empty Cart" height={150} width={150} className="object-contain" /> */}
                       <ShoppingCartIcon size={42} className='text-green-500'/>
                        <p className="text-center text-gray-600 text-lg">Your cart is empty.</p>
                        <Link href="/products">
                            <span className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-900 transition duration-300 ease-in-out transform hover:scale-105">
                                Shop Now
                            </span>
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-6">
                            {matchingProductsArray?.map((product: any) => (
                                <div
                                    key={product.cartId}
                                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col sm:flex-row items-center justify-between gap-4"
                                >
                                    <div className="flex items-center gap-4  flex-1">
                                        <Image
                                            src={product?.image_urls?.[0]}
                                            alt={product?.name}
                                            width={100}
                                            height={100}
                                            className="object-cover rounded-lg h-28"
                                        />
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-800 line-clamp-2 overflow-hidden">
                                                {product?.name}
                                            </h4>
                                            <p className="text-lg text--green-900 font-medium mt-1">
                                                {formatPrice(product?.price)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 mt-4 sm:mt-0">
                                        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                                            <button
                                                className="h-10 w-10 flex items-center justify-center bg-[#f7f0e3]  transition"
                                                onClick={() =>
                                                    handleUpdateCart(product?.cartId, 'decrease', product?.cartQty)
                                                }
                                            >
                                                <Minus className="h-5 w-5 text-gray-700" />
                                            </button>
                                            <div className="w-12 text-center text-sm font-medium">
                                                {product?.cartQty}
                                            </div>
                                            <button
                                                className="h-10 w-10 flex items-center justify-center bg-[#f7f0e3]  transition"
                                                onClick={() =>
                                                    handleUpdateCart(product?.cartId, 'increase', product?.cartQty)
                                                }
                                            >
                                                <Plus className="h-5 w-5 text-gray-700" />
                                            </button>
                                        </div>
                                        <div className="text-right text-md font-semibold text-gray-800 min-w-[100px]">
                                            {formatPrice(product?.price * product?.cartQty)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 bg-white p-6 rounded-lg shadow-md ">
                            <div className="flex justify-between items-center text-2xl font-bold text-gray-800 border-b pb-4 mb-4">
                                <span>Total Amount</span>
                                <span>{formatPrice(totalAmount)}</span>
                            </div>
                            <div className="flex justify-end  text-xl font-bold text-gray-800 border-b pb-4 mb-4">
                                <button
                                    className="ml-auto bg-green-600 hover:bg-green-900 text-white py-2 px-4 rounded-lg text-lg font-medium transition duration-300 ease-in-out transform"
                                    onClick={() => setIsOpen(true)}
                                >
                                    Proceed to Checkout
                                </button>
                            </div>

                        </div>
                    </>
                )}
                <CheckoutDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} subtotal={totalAmount} />
            </div>
        </div>
    );
}