'use client';

import { useParams } from 'next/navigation';
import { useProducts } from '@/context/ProductsContext';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {
    deleteCartitemsApi,
    postCartitemApi,
    updateCartitemsApi
} from '@/api-endpoints/CartsApi';
import { InvalidateQueryFilters, useQueryClient } from '@tanstack/react-query';
import { useVendor } from '@/context/VendorContext';
import LoginModal from '@/components/model/LoginModel';
import { useCartItem } from '@/context/CartItemContext';
import Breadcrumb from '@/components/Breadcrumb';
import Link from 'next/link';
import { slugConvert } from '@/lib/utils';
import { deleteWishListApi, postWishListApi } from '@/api-endpoints/products';
import { Heart } from 'lucide-react';
import { useWishList } from '@/context/WishListContext';
import { useRouter } from 'next/router';

const SingleProductPage = () => {
    const [getUserId, setUserId] = useState<string | null>(null);
    const [getCartId, setCartId] = useState<string | null>(null);
    const [getUserName, setUserName] = useState<string | null>(null);
    const [signInmodal, setSignInModal] = useState(false);
    const [product, setProduct] = useState<any>(null);
    const [cartData, setCartData] = useState<any>(null);
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
    const { wishList, wishListLoading }: any = useWishList();
    const router = useRouter();

    const { products }: any = useProducts();
    const { cartItem }: any = useCartItem();
    const { vendorId } = useVendor();
    const queryClient = useQueryClient();
    // const params = useParams();
    // const { params } = useParams<any>() ?? {};
      const params = useParams();
    const slug = params?.slug;

    useEffect(() => {
        if (products?.data && product) {
            const related = products.data.filter((p: any) =>
                p.id !== product.id &&
                (p.brand_name === product.brand_name || p.category === product.category)
            );
            setRelatedProducts(related.slice(0, 4)); // Show only first 4 related items
        }
    }, [products, product]);
    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        const storedCartId = localStorage.getItem('cartId');
        const storedUserName = localStorage.getItem('userName');
        setUserId(storedUserId);
        setCartId(storedCartId);
        setUserName(storedUserName);
    }, []);

    useEffect(() => {
        if (products?.data && slug) {
            const found = products.data.find((p: any) => slugConvert(p.name) === slug);
            if (found) {
                const cartMatch = cartItem?.data?.find((item: any) => item?.product === found.id);
                if (cartMatch) {
                    setCartData({
                        cartId: cartMatch.id,
                        quantity: cartMatch.quantity
                    });
                }
                setProduct(found);
            }
        }
    }, [products, slug, cartItem]);

    const handleUpdateCart = async (id: any, type: any, qty: any) => {
        try {
            if (qty === 1 && type === 'decrease') {
                await deleteCartitemsApi(`${id}`);
            } else {
                await updateCartitemsApi(`${id}/${type}/`);
            }
            queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    };

    const handleAddCart = async (id: any, qty: any) => {
        const payload = {
            cart: getCartId,
            product: id,
            user: getUserId,
            vendor: vendorId,
            quantity: qty,
            created_by: getUserName || 'user'
        };
        try {
            await postCartitemApi(``, payload);
            queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    if (!product) return <div className="p-8 text-center">Loading product details...</div>;

    const sliderSettings = {
        autoplay: true,
        dots: true,
        arrows: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };
    const breadcrumbItems = [
        { name: 'Home', href: '/' },
        { name: 'Products', href: '/products' },
        { name: `${product.name}`, href: `/${product.name}`, isActive: true },
    ];

    const filteredMatchingProductsArray = relatedProducts?.map((product: any, index: number) => {
        const matchingCartItem = cartItem?.data?.find((item: any) => item?.product === product?.id);
        const wishLists = wishList?.data?.find((wish: any) => wish?.product === product?.id);

        return {
            ...product,
            Aid: index,
            isLike: !!wishLists, // ✅ always add this key
            wishListId: wishLists?.id, // ✅ always add this key
            cartQty: matchingCartItem ? matchingCartItem.quantity : 0,
            cartId: matchingCartItem ? matchingCartItem.id : null,
        };
    });


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
        <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="container mx-auto px-4 py-6">
                <Breadcrumb items={breadcrumbItems} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Left - Image Carousel */}
                <div>
                    {product?.image_urls?.length > 1 ? (
                        <Slider {...sliderSettings}>
                            {product.image_urls.map((url: string, index: number) => (
                                <div key={index} className="p-2">
                                    <Image
                                        src={url}
                                        alt={`product-${index}`}
                                        width={500}
                                        height={500}
                                        className="w-full h-[400px] object-contain rounded border"
                                    />
                                </div>
                            ))}
                        </Slider>
                    ) : (
                        <Image
                            src={product.image_urls[0]}
                            alt="product"
                            width={500}
                            height={500}
                            className="w-full h-[400px] object-contain rounded border"
                        />
                    )}
                </div>

                {/* Right - Info */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
                    <p className="text-gray-500 text-sm mt-1">Brand: {product.brand_name}</p>
                    <div className="flex items-baseline gap-4 mt-4">
                        <span className="text-2xl font-bold text--green-900">₹{product.price}</span>
                        {product.discount && product.discount !== product.price && (
                            <span className="text-lg line-through text-gray-400">₹{product.discount}</span>
                        )}
                    </div>
                    <p className="text-sm mt-2 text-green-600">In stock: {product.stock_quantity} items</p>
                    {/* <p className="mt-4 text-gray-600 leading-relaxed">{product.description}</p> */}
                    <div dangerouslySetInnerHTML={{ __html: product?.description }} className="quill-content text-gray-600 mt-2" />

                    {cartData ? (
                        <div className="flex items-center justify-start mt-4 space-x-4">
                            <button
                                onClick={() => handleUpdateCart(cartData.cartId, 'decrease', cartData.quantity)}
                                disabled={cartData.quantity <= 1}
                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-900 disabled:opacity-50"
                            >
                                −
                            </button>
                            <span className="text-[#6b4f1a] font-semibold text-lg">{cartData.quantity}</span>
                            <button
                                onClick={() => handleUpdateCart(cartData.cartId, 'increase', cartData.quantity)}
                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-900"
                            >
                                +
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => (getUserId ? handleAddCart(product.id, 1) : setSignInModal(true))}
                            className="w-full mt-4 bg-green-600 hover:bg-green-900 text-white px-4 py-2 rounded-md font-medium shadow-sm transition-all duration-200"
                        >
                            Add to Cart
                        </button>
                    )}
                </div>
            </div>
            {filteredMatchingProductsArray?.length > 0 && (
                <div className="mt-16">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Related Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredMatchingProductsArray.map((related) => (
                            <div
                                key={related.id}
                                onClick={() => router.push(`/products/${slugConvert(related.name)}`)}
                                className="bg-white p-4 group relative border border-blue-100 rounded-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                            >
                                {/* ❤️ Wishlist Button */}
                                {related?.isLike ? (
                                    <button
                                        onClick={() => handleDeleteWishList(related)}
                                        className="absolute top-2 right-2 w-10 h-10 md:w-12 md:h-12 bg-red-500 text-white border-[3px] border-white rounded-full flex items-center justify-center shadow hover:bg-red-600 transition-all duration-300 z-20"
                                    >
                                        <Heart size={20} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleWishList(related)}
                                        className="absolute top-2 right-2 w-10 h-10 md:w-12 md:h-12 bg-gray-200 border-[3px] border-white rounded-full flex items-center justify-center shadow hover:bg-red-500 hover:text-white transition-all duration-300 z-10"
                                    >
                                        <Heart size={20} />
                                    </button>
                                )}
                                <Link href={`/products/${slugConvert(related.name)}`}>
                                    <Image
                                        src={related.image_urls[0]}
                                        alt={related.name}
                                        className="h-72 w-full object-contain mb-3"
                                        width={300}
                                        height={288}
                                    />
                                    {/* <span className="block w-full h-[2px] bg-blue-100 rounded mb-2"></span> */}
                                    <span className="block w-full h-[1px] bg-[#e4b03f]" />

                                </Link>

                                <h3 className="text-lg font-medium text-gray-800 truncate mt-3 text-center">
                                    <Link
                                        href={`/products/${slugConvert(related.name)}`}
                                        className="hover:underline hover:text--green-900 transition-colors"
                                    >
                                        {related.name}
                                    </Link>
                                </h3>

                                {/* 💰 Price + MRP in same line */}
                                <div className="text-center mt-3 flex justify-center items-center space-x-2">
                                    <p className="text--green-900 text-xl font-semibold">₹{product?.price}</p>
                                    {product?.discount && (
                                        <p className="text-gray-400 line-through text-sm">₹{product?.discount}</p>
                                    )}
                                </div>

                                {related?.cartQty > 0 ? (
                                    <div className="flex items-center justify-center mt-4 space-x-4">
                                        <button
                                            onClick={() =>
                                                handleUpdateCart(related?.cartId, 'decrease', related?.cartQty)
                                            }
                                            disabled={related.cartQty <= 1}
                                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-900 disabled:opacity-50"
                                        >
                                            −
                                        </button>
                                        <span className="text-[#6b4f1a] font-semibold text-lg">{related.cartQty}</span>
                                        <button
                                            onClick={() => handleUpdateCart(related?.cartId, 'increase', '')}
                                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-900"
                                        >
                                            +
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (getUserId) {
                                                handleAddCart(related.id, 1);
                                            } else {
                                                setSignInModal(true);
                                            }
                                        }}
                                        className="w-full mt-4 bg-green-600 hover:bg-green-900 text-white px-4 py-2 rounded-md font-medium shadow-sm transition-all duration-200"
                                    >
                                        Add to Cart
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {signInmodal && (
                <LoginModal open={signInmodal} handleClose={() => setSignInModal(false)} vendorId={vendorId} />
            )}
        </div>
    );
};

export default SingleProductPage;

