// 'use client';
// import { useParams } from 'next/navigation';
// import { useProducts } from '@/context/ProductsContext';
// import { useCategories } from '@/context/CategoriesContext';
// import Link from 'next/link';
// import Image from 'next/image';
// import { Heart, SearchCheck } from 'lucide-react';
// import ProductModal from './model/ProductModal';
// import { useEffect, useState } from 'react';
// import { deleteCartitemsApi, postCartitemApi, updateCartitemsApi } from '@/api-endpoints/CartsApi';
// import { InvalidateQueryFilters, useQueryClient } from '@tanstack/react-query';
// import { useVendor } from '@/context/VendorContext';
// import LoginModal from './model/LoginModel';
// import Breadcrumb from './Breadcrumb';
// import { useCartItem } from '@/context/CartItemContext';
// import { slugConvert } from '@/lib/utils';
// import { deleteWishListApi, postWishListApi } from '@/api-endpoints/products';
// import { useWishList } from '@/context/WishListContext';

// export default function CategoriesBasedProduct() {
//     const { id } = useParams();
//     const [getUserId, setUserId] = useState<string | null>(null);
//     const [getCartId, setCartId] = useState<string | null>(null);
//     const [getUserName, setUserName] = useState<string | null>(null);
//     const [signInmodal, setSignInModal] = useState(false);
//     const { products, isLoading }: any = useProducts();
//     const { categories }: any = useCategories();
//     const [selectedProduct, setSelectedProduct] = useState(null);
//     const [isModalOpen, setModalOpen] = useState(false);
//     const queryClient = useQueryClient();
//     const { vendorId } = useVendor();
//     const { cartItem }: any = useCartItem();
//     const { wishList, wishListLoading }: any = useWishList();

//     useEffect(() => {
//         const storedUserId = localStorage.getItem('userId');
//         const storedCartId = localStorage.getItem('cartId');
//         const storedUserName = localStorage.getItem('userName');

//         setUserId(storedUserId);
//         setCartId(storedCartId);
//         setUserName(storedUserName);
//     }, []);

//     // Find the category name by ID
//     const category = categories?.data?.find(
//         (cat: any) => cat.id?.toString() === id
//     );
//     const categoryName = category?.name || 'Category';

//     // Filter products by category ID
//     const filteredProducts = products?.data?.filter(
//         (product: any) => product.category?.toString() === id
//     );

//     const handleUpdateCart = async (id: any, type: any, qty: any) => {
//         try {
//             if (qty === 1) {
//                 const updateApi = await deleteCartitemsApi(`${id}`)
//                 if (updateApi) {
//                     queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
//                 }
//             } else {
//                 const response = await updateCartitemsApi(`${id}/${type}/`)
//                 if (response) {
//                     queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
//                 }
//             }

//         } catch (error) {

//         }
//     }

//     const handleAddCart = async (id: any, qty: any) => {
//         const payload = {
//             cart: getCartId,
//             product: id,
//             user: getUserId,
//             vendor: vendorId,
//             quantity: qty,
//             created_by: getUserName ? getUserName : 'user'
//         }
//         try {
//             const response = await postCartitemApi(``, payload)
//             if (response) {
//                 queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
//             }
//         } catch (error) {

//         }
//     }

//     const filteredMatchingProductsArray = filteredProducts?.map((product: any, index: number) => {
//         const matchingCartItem = cartItem?.data?.find((item: any) => item?.product === product?.id);
//         const wishLists = wishList?.data?.find((wish: any) => wish?.product === product?.id);

//         return {
//             ...product,
//             Aid: index,
//             isLike: !!wishLists, // ✅ always add this key
//             wishListId: wishLists?.id, // ✅ always add this key
//             cartQty: matchingCartItem ? matchingCartItem.quantity : 0,
//             cartId: matchingCartItem ? matchingCartItem.id : null,

//         }
//         return product;
//     });
//     const breadcrumbItems = [
//         { name: 'Home', href: '/' },
//         { name: `${categoryName}`, href: '/categories' },
//         { name: 'Products', href: '/products', isActive: true },
//     ];

//     // postWishListApi
//     const handleWishList = async (product: any) => {
//         try {
//             const updateAPi = await postWishListApi('',
//                 {
//                     user: getUserId,
//                     product: product?.id,
//                     vendor: vendorId,
//                     created_by: vendorId ? `user${vendorId}` : 'user'
//                 }
//             )
//             if (updateAPi) {
//                 queryClient.invalidateQueries(['getProductData'] as InvalidateQueryFilters);
//             }
//         } catch (error) {
//             console.log(error)
//         }
//     }
//     // deleteWishListApi
//     const handleDeleteWishList = async (product: any) => {


//         try {
//             const updateAPi = await deleteWishListApi(`${product?.wishListId}`,
//                 {
//                     deleted_by: vendorId ? `user${vendorId}` : 'user'
//                 }
//             )
//             if (updateAPi) {
//                 queryClient.invalidateQueries(['getProductData'] as InvalidateQueryFilters);
//             }
//         } catch (error) {

//         }
//     }

//     return (
//         <div className="max-w-6xl mx-auto px-4 py-10">
//             <Breadcrumb items={breadcrumbItems} />
//             <h1 className="text-3xl font-bold  text--green-900 mb-6 mt-6 text-center">
//                 {categoryName} Products
//             </h1>

//             {isLoading ? (
//                 <p className="text-center text-gray-500">Loading...</p>
//             ) : filteredMatchingProductsArray?.length > 0 ? (
//                 <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6">
//                     {filteredMatchingProductsArray.map((product: any) => (
//                         <div key={product?.id} className="px-2 my-2">
//                             <div className="bg-white p-4 group relative border border-blue-100 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-md">

//                                 {/* ⭐ Rating Badge */}
//                                 {product?.rating && (
//                                     <div className="absolute top-2 left-2 bg-[#e4b03f] text-white text-xs font-semibold px-2 py-1 rounded-md shadow z-20">
//                                         {product?.rating} / 5.0
//                                     </div>
//                                 )}

//                                 {/* ❤️ Wishlist Icon */}
//                                 {product?.isLike === true ? (
//                                     <button
//                                         onClick={() => handleDeleteWishList(product)}
//                                         className="absolute top-1.5 right-2 w-10 h-10 md:w-12 md:h-12 bg-red-500 text-white border-[3px] border-white rounded-full flex items-center justify-center shadow hover:bg-red-500 hover:text-white transition-all duration-500 z-10"
//                                     >
//                                         <Heart size={20} />
//                                     </button>
//                                 ) : (
//                                     <button
//                                         onClick={() => handleWishList(product)}
//                                         className="absolute top-1.5 right-2 w-10 h-10 md:w-12 md:h-12 bg-gray-200 border-[3px] border-white rounded-full flex items-center justify-center shadow hover:bg-red-500 hover:text-white transition-all duration-500 z-10"
//                                     >
//                                         <Heart size={20} />
//                                     </button>
//                                 )}

//                                 {/* 🖼️ Product Image */}
//                                 <Link href={`/products/${slugConvert(product.name)}`}>
//                                     <Image
//                                         src={product?.image_urls[0]}
//                                         alt={product?.name}
//                                         className="h-72 w-full object-contain mb-3"
//                                         width={300}
//                                         height={288}
//                                     />
//                                     <span className="block w-full h-[1px] bg-[#e4b03f]" />
//                                 </Link>

//                                 {/* 📦 Product Name */}
//                                 <h3 className="text-lg font-medium text-gray-800 truncate mt-3 text-center">
//                                     <Link
//                                         href={`/products/${slugConvert(product.name)}`}
//                                         className="hover:underline hover:text--green-900 transition-colors"
//                                     >
//                                         {product.name}
//                                     </Link>
//                                 </h3>

//                                 {/* 💰 Price + MRP in same line */}
//                                 <div className="text-center mt-3 flex justify-center items-center space-x-2">
//                                     <p className="text--green-900 text-xl font-semibold">₹{product?.price}</p>
//                                     {product?.discount && (
//                                         <p className="text-gray-400 line-through text-sm">₹{product?.discount}</p>
//                                     )}
//                                 </div>

//                                 {/* 🛒 Add to Cart / Counter */}
//                                 {product?.cartQty > 0 ? (
//                                     <div className="flex items-center justify-center mt-4 space-x-4">
//                                         <button
//                                             onClick={() =>
//                                                 handleUpdateCart(product?.cartId, 'decrease', product?.cartQty)
//                                             }
//                                             className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-900 disabled:opacity-50"
//                                         >
//                                             −
//                                         </button>
//                                         <span className="text-[#6b4f1a] font-semibold text-lg">{product.cartQty}</span>
//                                         <button
//                                             onClick={() => handleUpdateCart(product?.cartId, 'increase', '')}
//                                             className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-900"
//                                         >
//                                             +
//                                         </button>
//                                     </div>
//                                 ) : (
//                                     <button
//                                         onClick={(e) => {
//                                             e.stopPropagation();
//                                             if (getUserId) {
//                                                 handleAddCart(product.id, 1);
//                                             } else {
//                                                 setSignInModal(true);
//                                             }
//                                         }}
//                                         className="w-full mt-4 bg-green-600 hover:bg-green-900 text-white px-4 py-2 rounded-md font-medium shadow-sm transition-all duration-200"
//                                     >
//                                         Add to Cart
//                                     </button>
//                                 )}
//                             </div>
//                         </div>

//                     ))}
//                 </div>
//             ) : (
//                 <p className="text-center text-gray-500">No products found for this category.</p>
//             )}
//             <ProductModal
//                 isOpen={isModalOpen}
//                 product={selectedProduct}
//                 onClose={() => setModalOpen(false)}
//             />
//             {signInmodal && (
//                 <LoginModal open={signInmodal} handleClose={() => setSignInModal(false)} vendorId={vendorId} />
//             )}
//         </div>
//     );
// }

import { useCategories } from "@/context/CategoriesContext";
import { useProducts } from "@/context/ProductsContext";
import { useParams, useRouter } from "next/navigation";
import Breadcrumb from "./Breadcrumb";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import ProductModal from "./model/ProductModal";
import LoginModal from "./model/LoginModel";
import { useEffect, useState } from "react";
import { InvalidateQueryFilters, useQueryClient } from "@tanstack/react-query";
import { useVendor } from "@/context/VendorContext";
import { useCartItem } from "@/context/CartItemContext";
import { useWishList } from "@/context/WishListContext";
import { deleteCartitemsApi, postCartitemApi, updateCartitemsApi } from "@/api-endpoints/CartsApi";
import { deleteWishListApi, postWishListApi } from "@/api-endpoints/products";
import { slugConvert } from "@/lib/utils";

export default function CategoriesBasedProduct() {
    const { categories, isLoading }: any = useCategories();
    // const { id } = useParams() ?? {};
    const params = useParams();
    const id = params?.id;
    const [getUserId, setUserId] = useState<string | null>(null);
    const [getCartId, setCartId] = useState<string | null>(null);
    const [getUserName, setUserName] = useState<string | null>(null);
    const [signInmodal, setSignInModal] = useState(false);
    const { products, isLoadings }: any = useProducts();
    const router = useRouter();

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const { vendorId } = useVendor();
    const { cartItem }: any = useCartItem();
    const { wishList, wishListLoading }: any = useWishList();

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        const storedCartId = localStorage.getItem('cartId');
        const storedUserName = localStorage.getItem('userName');

        setUserId(storedUserId);
        setCartId(storedCartId);
        setUserName(storedUserName);
    }, []);


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

    // const filteredMatchingProductsArray = filteredProducts?.map((product: any, index: number) => {
    //     const matchingCartItem = cartItem?.data?.find((item: any) => item?.product === product?.id);
    //     const wishLists = wishList?.data?.find((wish: any) => wish?.product === product?.id);

    //     return {
    //         ...product,
    //         Aid: index,
    //         isLike: !!wishLists, // ✅ always add this key
    //         wishListId: wishLists?.id, // ✅ always add this key
    //         cartQty: matchingCartItem ? matchingCartItem.quantity : 0,
    //         cartId: matchingCartItem ? matchingCartItem.id : null,

    //     }
    //     return product;
    // });

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


    const category = categories?.data?.find(
        (item: any) => Number(item?.id) === Number(id)
    );

    const categoryName = category?.name || 'Category';

    const breadcrumbItems = [
        { name: 'Home', href: '/' },
        { name: `${categoryName}`, href: '/categories' },
        { name: 'Products', href: '/products', isActive: true },
    ];


    const subcategories = category?.subcategories || [];
    console.log(subcategories)
    const filteredProducts =
        products?.data?.filter((p: any) => {
            const cat = p.category;

            if (typeof cat === "number") return cat === Number(category?.id);
            if (typeof cat === "string") return cat === category?.slug_name;
            if (typeof cat === "object") return Number(cat?.id) === Number(category?.id);

            return false;
        }) || [];

    console.log(category?.slug_name)
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="flex flex-col items-center">
                    {/* Spinner */}
                    <svg
                        className="animate-spin h-10 w-10 text-green-600 mb-4"
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

                    {/* Text */}
                    <p className="text-gray-700 font-medium">Loading...</p>
                </div>
            </div>
        );
    }


    return (
        <>
            <div className="bg-white">
                <div className="container mx-auto px-4 py-12">
                    <div className="text-center mb-12">
                        <Breadcrumb items={breadcrumbItems} />
                        {subcategories.length > 0 && (
                            <>
                                <h1 className="text-3xl font-bold mb-4 mt-3">Shop by SubCategory</h1>
                                {/* <p className="text-muted-foreground max-w-2xl mx-auto">
                            Browse our collection of sustainable and eco-friendly products organized by category.
                        </p> */}
                            </>
                        )}
                    </div>
                    {subcategories.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {subcategories?.map((categorys: any) => (
                                <div
                                    onClick={() => {
                                        router.push(
                                            `${category?.id}/${slugConvert(categorys?.slug_name)}`
                                        );
                                    }}
                                    // href={`/categories/${slugConvert(category?.slug_name)}/${slugConvert(categorys?.slug_name)}`}
                                    key={categorys?.id}
                                    className="relative group overflow-hidden rounded-md shadow hover:shadow-lg transition"
                                >
                                    <div className="aspect-[4/3] w-full overflow-hidden">
                                        <Image
                                            src={categorys?.image || 'https://semantic-ui.com/images/wireframe/image.png'}
                                            alt={categorys?.name || 'Category'}
                                            className="h-full w-full object-cover  transition-transform duration-500"
                                            width={300}
                                            height={288}
                                        />
                                    </div>

                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <h3 className="text-white text-2xl font-bold uppercase tracking-wide text-center px-4">
                                            {categorys?.name}
                                        </h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {subcategories?.length === 0 && (
                        <div className="max-w-6xl mx-auto px-4 py-0">
                            {/* <Breadcrumb items={breadcrumbItems} /> */}
                            <h1 className="text-3xl font-bold  text--green-900 mb-6 mt-6 text-center">
                                {categoryName} Products List
                            </h1>

                            {isLoading ? (
                                <p className="text-center text-gray-500">Loading...</p>
                            ) : filteredProducts?.length > 0 ? (
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
                            ) : (
                                <p className="text-center text-gray-500">No products found for this category.</p>
                            )}
                            <ProductModal
                                isOpen={isModalOpen}
                                product={selectedProduct}
                                onClose={() => setModalOpen(false)}
                            />
                            {signInmodal && (
                                <LoginModal open={signInmodal} handleClose={() => setSignInModal(false)} vendorId={vendorId} />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}