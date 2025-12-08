"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ProductsSidebar from "@/components/ProductsSidebar";
import { Heart, SearchCheck, ShoppingCart } from "lucide-react";
import ProductModal from "@/components/model/ProductModal";
import { useProducts } from "@/context/ProductsContext";
import Image from "next/image";
import { deleteCartitemsApi, postCartitemApi, updateCartitemsApi } from "@/api-endpoints/CartsApi";
import { InvalidateQueryFilters, useQueryClient } from "@tanstack/react-query";
import { useVendor } from "@/context/VendorContext";
import LoginModal from "@/components/model/LoginModel";
import { useCartItem } from "@/context/CartItemContext";
import Breadcrumb from "@/components/Breadcrumb";
import { slugConvert } from "@/lib/utils";
import { deleteWishListApi, postWishListApi } from "@/api-endpoints/products";
import { useWishList } from "@/context/WishListContext";
import { useRouter } from "next/router";

export default function ProductsPage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [getUserId, setUserId] = useState<string | null>(null);
  const [getCartId, setCartId] = useState<string | null>(null);
  const [getUserName, setUserName] = useState<string | null>(null);
  const [signInmodal, setSignInModal] = useState(false);
  const { products, isLoading }: any = useProducts();
  const { vendorId } = useVendor();
  const { cartItem }: any = useCartItem();
  const { wishList, wishListLoading }: any = useWishList();
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState('');
  const itemsPerPage = 27;
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = selectedCategory
    ? products?.data?.filter((product: any) => product.category === selectedCategory)
    : products?.data;

  const totalItems = filteredProducts?.length || 0;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const topRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentPage]);


  const matchingProductsArray = products?.data?.map((product: any, index: number) => {
    const matchingCartItem = cartItem?.data?.find(
      (item: any) => item?.product === product?.id
    );

    if (matchingCartItem) {
      return {
        ...product,
        Aid: index,
        cartQty: matchingCartItem?.quantity,
        cartId: matchingCartItem.id,
      };
    }

    return product;
  });

  const filteredMatchingProductsArray = filteredProducts?.map((product: any, index: number) => {
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



  const currentProducts = filteredMatchingProductsArray?.slice(startIndex, endIndex);

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


  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedCartId = localStorage.getItem('cartId');

    setUserId(storedUserId);
    setCartId(storedCartId);
  }, []);
  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products', isActive: true },
  ];

  const getPaginationRange = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage === 1) {
      pages.push(1, 2, 3, '...', totalPages);
    } else if (currentPage === totalPages) {
      pages.push('...', totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }

    return pages;
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



  const ProductSkeleton = () => (
    <div className="bg-white p-4 animate-pulse">
      <div className="h-72 w-full bg-gray-200 rounded mb-3" />
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-2" />
      <div className="h-8 bg-gray-200 rounded w-full mt-4" />
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6 mt-3">
        <Breadcrumb items={breadcrumbItems} />
        <h1 className="text-3xl font-bold mt-3">All Products</h1>
        <p className="text-muted-foreground">
          Nature’s Best for Skin, Face, Body, Oral & Hair Care
        </p>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/4">
          <ProductsSidebar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>

        <div ref={topRef} className="w-full lg:w-3/4">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: itemsPerPage }).map((_, idx) => (
                <ProductSkeleton key={idx} />
              ))
            ) : currentProducts && currentProducts.length > 0 ? (
              currentProducts.map((product: any) => (
                <div

                  className="bg-white relative h-[400px] rounded-md group shadow-[0_0_20px_rgba(0,0,0,0.15)] overflow-hidden transition-all duration-300 cursor-pointer"
                >
                  {/* ⭐ Rating Badge */}
                  {product?.rating && (
                    <div className="absolute top-2 left-2 bg-[#e4b03f] text-white text-xs font-semibold px-2 py-1 rounded-md shadow z-20">
                      {product?.rating} / 5.0
                    </div>
                  )}

                  {/* ❤️ Wishlist Icon */}
                  {product?.isLike === true ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // ✅ Prevent parent click
                        handleDeleteWishList(product);
                      }}
                      className="absolute top-1.5 right-2 w-10 h-10 md:w-12 md:h-12 bg-red-500 text-white border-[3px] border-white rounded-full flex items-center justify-center shadow hover:bg-red-500 hover:text-white transition-all duration-500 z-20"
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

                  {/* 📦 Product Name */}
                  <h3 className="text-base font-medium text-gray-800 truncate px-4 mt-4 text-center">
                    <Link
                      href={`/products/${slugConvert(product.name)}`}
                      className="hover:text--green-900 transition"
                    >
                      <p className="text-center font-medium truncate">{product.name}</p>
                    </Link>
                  </h3>

                  {/* 💰 Price + MRP */}
                  <div
                    className="text-center mt-3 flex justify-center items-center space-x-2"
                    onClick={() => router.push(`/products/${slugConvert(product.name)}`)}
                  >
                    <p className="text--green-900 text-xl font-semibold">₹{product?.price}</p>
                    {product?.discount && (
                      <p className="text-gray-400 line-through text-sm">₹{product?.discount}</p>
                    )}
                  </div>

                  {/* 🛒 Add to Cart / Counter */}
                  {product?.cartQty > 0 ? (
                    <div className="flex items-center justify-center mt-4 mb-4 space-x-4">
                      <button
                        onClick={() =>
                          handleUpdateCart(product?.cartId, 'decrease', product?.cartQty)
                        }
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-900 disabled:opacity-50"
                      >
                        −
                      </button>
                      <span className="text-[#6b4f1a] font-semibold text-lg">
                        {product.cartQty}
                      </span>
                      <button
                        onClick={() => handleUpdateCart(product?.cartId, 'increase', '')}
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
                          Add to cart
                          <span className="ml-2 mt-1 align-middle">
                            <ShoppingCart size={16} />
                          </span>
                        </span>
                      </button>
                    </div>
                  )}
                </div>

              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 text-lg font-medium py-10">
                No products found.
              </div>
            )}
          </div>


          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-md border border-blue-200 text--green-900 hover:border-blue-400 disabled:opacity-50"
              >
                &#x276E;
              </button>

              {getPaginationRange().map((page, idx) =>
                page === '...' ? (
                  <span key={idx} className="px-2 text-gray-400">…</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page as number)}
                    className={`w-8 h-8 rounded-md border text-sm font-semibold ${currentPage === page
                      ? 'bg-green-600 text-white border--green-900'
                      : 'text-gray-500 border-blue-200 hover:border-blue-400'
                      }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-md border border-blue-200 text--green-900 hover:border-blue-400 disabled:opacity-50"
              >
                &#x276F;
              </button>
            </div>
          )}

        </div>


      </div>

      <ProductModal
        isOpen={isModalOpen}
        product={selectedProduct}
        onClose={() => setModalOpen(false)}
      />
      {signInmodal && (
        <LoginModal open={signInmodal} handleClose={() => setSignInModal(false)} vendorId={vendorId} />
      )}
    </div>
  );
}


