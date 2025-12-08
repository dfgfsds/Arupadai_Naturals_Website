'use client';

import { useCategories } from "@/context/CategoriesContext";
import { useProducts } from "@/context/ProductsContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Heart } from "lucide-react";
import { formatPrice, slugConvert } from "@/lib/utils";
import Link from "next/link";
import { deleteCartitemsApi, postCartitemApi, updateCartitemsApi } from "@/api-endpoints/CartsApi";
import { InvalidateQueryFilters, useQueryClient } from "@tanstack/react-query";
import LoginModal from "@/components/model/LoginModel";
import { useState } from "react";
import { useVendor } from "@/context/VendorContext";
import { useCartItem } from "@/context/CartItemContext";
import { useWishList } from "@/context/WishListContext";
import { deleteWishListApi, postWishListApi } from "@/api-endpoints/products";
// import emptyBox from "../../../../public/img/empty-box.png";

export default function SubCategoryPageClient({
    categorySlug,
    subSlug,
}: {
    categorySlug: number;
    subSlug: string;
}) {
    const { categories, isLoading }: any = useCategories();
    const { products }: any = useProducts();
    const router = useRouter();
    const [getUserId, setUserId] = useState<string | null>(null);
    const [getCartId, setCartId] = useState<string | null>(null);
    const [getUserName, setUserName] = useState<string | null>(null);
    const [signInmodal, setSignInModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const { vendorId } = useVendor();
    const { cartItem }: any = useCartItem();
    const { wishList, wishListLoading }: any = useWishList();

    const category = categories?.data?.find(
        (c: any) => String(c?.id) === String(categorySlug)
    );

    const subcategory = category?.subcategories?.find(
        (sub: any) => String(sub?.slug_name) === String(subSlug)
    );

    const filteredProducts =
        products?.data?.filter((p: any) => {
            const productCatId =
                typeof p.category === "object"
                    ? p.category?.id
                    : Number(p.category);

            const productSubId =
                typeof p.subcategory === "object"
                    ? p.subcategory?.id
                    : Number(p.subcategory);

            return (
                Number(productCatId) === Number(category?.id) &&
                Number(productSubId) === Number(subcategory?.id)
            );
        }) || [];

    // 4️⃣ Loader UI
    if (isLoading || !category || !subcategory) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="flex flex-col items-center">
                    <svg
                        className="animate-spin h-10 w-10 text-yellow-600 mb-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                    </svg>

                    <p className="text-gray-700 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

        const handleAddCart = async (id: any, qty: any) => {
        const payload = {
            cart: getCartId,
            product: id,
            user: getUserId,
            vendor: vendorId,
            quantity: qty,
            created_by: getUserName ? getUserName : 'user'
        }
        try {
            const response = await postCartitemApi(``, payload)
            if (response) {
                queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
            }
        } catch (error) {

        }
    }

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

    const handleUpdateCart = async (id: any, type: any, qty: any) => {
        try {
            if (qty === 1) {
                const updateApi = await deleteCartitemsApi(`${id}`)
                if (updateApi) {
                    queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
                }
            } else {
                const response = await updateCartitemsApi(`${id}/${type}/`)
                if (response) {
                    queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
                }
            }

        } catch (error) {

        }
    }

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* Back */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-black mb-6"
                >
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </button>

                {/* Page Title */}
                <h1 className="text-3xl font-bold text-gray-900 text-center mb-10 capitalize">
                    {subcategory?.name}
                </h1>

                {/* Product List */}
                {filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center py-20">
                        {/* <Image src={emptyBox} width={180} height={180} alt="empty" /> */}
                        <p className="text-gray-500 mt-4">No products found</p>
                    </div>
                ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6">
                                    {filteredProducts?.map((product: any) => (
                                        <div key={product?.id} className="px-2 my-2">
                                            <div className="bg-white p-4 group relative border border-blue-100 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-md">

                                                {/* ⭐ Rating Badge */}
                                                {product?.rating && (
                                                    <div className="absolute top-2 left-2 bg-[#e4b03f] text-white text-xs font-semibold px-2 py-1 rounded-md shadow z-20">
                                                        {product?.rating} / 5.0
                                                    </div>
                                                )}

                                                {/* ❤️ Wishlist Icon */}
                                                {product?.isLike === true ? (
                                                    <button
                                                        onClick={() => handleDeleteWishList(product)}
                                                        className="absolute top-1.5 right-2 w-10 h-10 md:w-12 md:h-12 bg-red-500 text-white border-[3px] border-white rounded-full flex items-center justify-center shadow hover:bg-red-500 hover:text-white transition-all duration-500 z-10"
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
                                                <Link href={`/products/${slugConvert(product.name)}`}>
                                                    <Image
                                                        src={product?.image_urls[0]}
                                                        alt={product?.name}
                                                        className="h-72 w-full object-contain mb-3"
                                                        width={300}
                                                        height={288}
                                                    />
                                                    <span className="block w-full h-[1px] bg-[#e4b03f]" />
                                                </Link>

                                                {/* 📦 Product Name */}
                                                <h3 className="text-lg font-medium text-gray-800 truncate mt-3 text-center">
                                                    <Link
                                                        href={`/products/${slugConvert(product.name)}`}
                                                        className="hover:underline hover:text--green-900 transition-colors"
                                                    >
                                                        {product.name}
                                                    </Link>
                                                </h3>

                                                {/* 💰 Price + MRP in same line */}
                                                <div className="text-center mt-3 flex justify-center items-center space-x-2">
                                                    <p className="text--green-900 text-xl font-semibold">₹{product?.price}</p>
                                                    {product?.discount && (
                                                        <p className="text-gray-400 line-through text-sm">₹{product?.discount}</p>
                                                    )}
                                                </div>

                                                {/* 🛒 Add to Cart / Counter */}
                                                {product?.cartQty > 0 ? (
                                                    <div className="flex items-center justify-center mt-4 space-x-4">
                                                        <button
                                                            onClick={() =>
                                                                handleUpdateCart(product?.cartId, 'decrease', product?.cartQty)
                                                            }
                                                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-900 disabled:opacity-50"
                                                        >
                                                            −
                                                        </button>
                                                        <span className="text-[#6b4f1a] font-semibold text-lg">{product.cartQty}</span>
                                                        <button
                                                            onClick={() => handleUpdateCart(product?.cartId, 'increase', '')}
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
                                                                handleAddCart(product.id, 1);
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
                                        </div>

                                    ))}
                                </div>
                )}
            </div>

             {signInmodal && (
                                <LoginModal open={signInmodal} handleClose={() => setSignInModal(false)} vendorId={vendorId} />
                            )}
        </div>
    );
}
