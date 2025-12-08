'use client';

import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { Heart, ShoppingCart } from 'lucide-react';
import ProductModal from './model/ProductModal';
import { useProducts } from '@/context/ProductsContext';
import Link from 'next/link';
import Image from 'next/image';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { deleteCartitemsApi, postCartitemApi, updateCartitemsApi } from '@/api-endpoints/CartsApi';
import { useVendor } from '@/context/VendorContext';
import { InvalidateQueryFilters, useQueryClient } from '@tanstack/react-query';
import LoginModal from './model/LoginModel';
import { useCartItem } from '@/context/CartItemContext';
import { slugConvert } from '@/lib/utils';
import { deleteWishListApi, postWishListApi } from '@/api-endpoints/products';
import { useWishList } from '@/context/WishListContext';
import { useRouter } from 'next/navigation';

const BestSellers = () => {
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
    const router =useRouter();

    useEffect(() => {
        setUserId(localStorage.getItem('userId'));
        setCartId(localStorage.getItem('cartId'));
        setUserName(localStorage.getItem('userName'));
    }, []);

    const settings = {
        dots: false,
        infinite: products?.data.length > 5, // ✅ Only loop if more than 5 products
        speed: 500,
        slidesToShow: Math.min(products?.data.length, 5), // ✅ Show only available count
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: Math.min(products?.data.length, 3),
                    slidesToScroll: 1,
                    infinite: products?.data.length > 3, // ✅ Prevent duplicate when few
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: Math.min(products?.data.length, 2),
                    slidesToScroll: 1,
                    infinite: products?.data.length > 2,
                },
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: products?.data.length > 1,
                },
            },
        ],
    };


    const matchingProductsArray = products?.data?.map((product: any, index: number) => {
        const matchingCartItem = cartItem?.data?.find(
            (item: any) => item?.product === product?.id
        );
        const wishLists = wishList?.data?.find((wish: any) => wish?.product === product?.id);

        return {
            ...product,
            Aid: index,
            isLike: !!wishLists, // ✅ always add this key
            wishListId: wishLists?.id, // ✅ always add this key
            cartQty: matchingCartItem ? matchingCartItem.quantity : 0,
            cartId: matchingCartItem ? matchingCartItem.id : null,
        };

        return product;
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

    // Skeleton loader for 5 slides
    const skeletonArray = Array(5).fill(null);

    return (
        <section className="bg-white">
            <h2 className=" text-3xl font-bold  text--green-900 mb-2 mt-6 text-center ">
                 Our Top Sellings
            </h2>
            <div className="flex justify-end">
                <Link href="/products">
                    <button className="text-sm px-4 py-1.5 mr-6 border border--green-900 text--green-900 rounded-md shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2">
                        View all
                    </button>
                </Link>
            </div>

            {isLoading ? (
                <Slider {...settings}>
                    {skeletonArray.map((_, idx) => (
                        <div key={idx} className="px-2 my-4">
                            <div className="bg-white h-[400px] rounded-md overflow-hidden border border-gray-200 p-4 animate-pulse">
                                <div className="bg-gray-200 h-52 w-full mb-4 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
                                <div className="h-10 bg-gray-200 rounded w-full"></div>
                            </div>
                        </div>
                    ))}
                </Slider>
            ) : (
                <Slider {...settings}>
                    {matchingProductsArray?.slice(0, 10)?.map((product: any, index: number) => {
                        // Random rating between 4.5 and 5.0
                        const rating = (Math.random() * 0.5 + 4.5).toFixed(1);

                        return (
                            <div key={index} className="px-2 my-4">
                                <div className="bg-white relative h-[420px] rounded-md group shadow-[0_0_20px_rgba(0,0,0,0.15)] overflow-hidden transition-all duration-300">

                                    {/* ⭐ Rating Badge */}
                                    {product?.rating && (
                                        <div className="absolute top-2 left-2 bg-[#e4b03f] text-white text-xs font-semibold px-2 py-1 rounded-md shadow z-20">
                                            {product?.rating} / 5.0
                                        </div>
                                    )}
                                    {/* <div className="absolute top-2 left-2 bg-[#e4b03f] text-white text-xs font-semibold px-2 py-1 rounded-md shadow z-20">
                                        {rating} / 5.0
                                    </div> */}

                                    {/* ❤️ Wishlist Icon */}
                                    {product?.isLike ? (
                                        <button
                                            onClick={() => handleDeleteWishList(product)}
                                            className="absolute top-1.5 right-2 w-10 h-10 md:w-12 md:h-12 bg-red-500 text-white border-[3px] border-white rounded-full flex items-center justify-center shadow hover:bg-red-500 transition-all duration-500 z-10"
                                        >
                                            <Heart size={20} />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleWishList(product)}
                                            className="absolute top-1.5 right-2 w-10 h-10 md:w-12 md:h-12 bg-gray-200 border-[3px] border-white rounded-full flex items-center justify-center shadow hover:bg-red-500 hover:text-white transition-all duration-500 z-10"
                                        >
                                            <Heart size={20} />
                                        </button>
                                    )}

                                    {/* 🖼️ Product Image */}
                                    <div className="relative p-4 cursor-pointer" onClick={()=>router.push(`/products/${slugConvert(product.name)}`)}>
                                        <Image
                                            src={product?.image_urls[0]}
                                            alt={product?.name}
                                            width={280}
                                            height={280}
                                            className="h-52 w-full object-contain mx-auto"
                                        />
                                    </div>

                                    {/* Divider */}
                                    <span className="block w-full h-[1px] bg-green-600" />

                                    {/* 📦 Product Name */}
                                    <h3 className="text-base font-medium text-gray-800 truncate px-4 mt-4 text-center">
                                        <Link
                                            href={`/products/${slugConvert(product.name)}`}
                                            className="hover:text--green-900 transition"
                                        >
                                            <span className="text-center font-medium truncate">{product.name}</span>
                                        </Link>
                                    </h3>

                                    {/* 💰 Price + MRP in same line */}
                                    <div className="text-center mt-3 flex justify-center items-center space-x-2">
                                        <span className="text--green-900 text-xl font-semibold">₹{product?.price}</span>
                                        {product?.discount && (
                                            <span className="text-gray-400 line-through text-sm">₹{product?.discount}</span>
                                        )}
                                    </div>

                                    {/* 🛒 Add to Cart / Counter */}
                                    {product?.cartQty > 0 ? (
                                        <div className="flex items-center justify-center mt-4 mb-4 space-x-4">
                                            <button
                                                onClick={() =>
                                                    handleUpdateCart(product?.cartId, "decrease", product?.cartQty)
                                                }
                                                // disabled={product.cartQty <= 1}
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
                                                className="w-full bg-green-600 hover:bg-green-900 text-white py-2 rounded-md font-medium shadow-sm transition-all duration-200"
                                            >
                                                <span className="flex justify-center">
                                                    Add to cart{" "}
                                                    <span className="ml-2 mt-1 align-middle">
                                                        <ShoppingCart size={16} />
                                                    </span>
                                                </span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}


                </Slider>
            )}

            {/* Modal */}
            <ProductModal
                isOpen={isModalOpen}
                product={selectedProduct}
                onClose={() => setModalOpen(false)}
            />
            {signInmodal && (
                <LoginModal
                    open={signInmodal}
                    handleClose={() => setSignInModal(false)}
                    vendorId={vendorId}
                />
            )}
        </section>
    );
};

export default BestSellers;
