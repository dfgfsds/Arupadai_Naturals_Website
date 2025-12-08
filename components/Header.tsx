'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import LogoImg from "../public/img/bmc-logo.png";
import { SearchIcon, ShoppingCart, User } from "lucide-react";
import { useRouter } from "next/router";
import { useCartItem } from "@/context/CartItemContext";
import { useUser } from "@/context/UserContext";
import { useProducts } from "@/context/ProductsContext";
import SearchBar from "./SearchBar";
import TopSearchBar from "./TopSearchBar";

export default function Header() {
    const { user, setUser }: any = useUser();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();
    const { cartItem }: any = useCartItem();
    const { products } = useProducts();
    const [searchOpen, setSearchOpen] = useState(false);

    const userName = user?.data?.name || user?.data?.contact_number;
    const cartCount = cartItem?.data?.length || 0;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.clear();
            localStorage.removeItem("email");
            localStorage.removeItem("userName");
        }
        window.location.reload()
        setUser(null);
        router.push('/');
    };

    return (
        <header className="bg-white shadow-sm py-3 px-6 w-full h-32 relative">
            <div className="max-w-7xl mx-auto flex items-center justify-between relative h-full">
                {/* Centered Logo */}
                <div className="absolute md:left-1/2 transform md:-translate-x-1/2 ">
                    <Link href="/">
                        <Image
                            src={LogoImg}
                            alt="logo"
                            className=" h-auto "
                            width={200}
                            height={80}
                        />
                    </Link>
                </div>

                {/* Right section: Search bar and User/Cart */}
                <div className="ml-auto flex items-center gap-3">
                    {/* Search Bar */}
                    <div className="flex">
                        {/* <SearchBar products={products?.data} /> */}
                        <button
                            className="text-gray-700 hover:text--green-900 transition flex"
                            onClick={() => setSearchOpen(true)}
                        >
                            <span className="text-xl hidden md:block">Search</span> <SearchIcon className="mt-1 md:ml-2 ml-1" size={20} />
                        </button>
                    </div>

                    {/* User and Cart */}
                    <div className="flex items-center gap-4 text-sm text-gray-700">
                        {/* User Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            {userName ? (
                                <>
                                    <button
                                        onClick={() => setDropdownOpen(prev => !prev)}
                                        className="flex items-center gap-2 hover:text--green-900 transition text-xl"
                                    >
                                        <User size={20} />
                                        <span>{userName?.split(' ')[0]}</span>
                                    </button>
                                    {dropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md py-2 text-sm z-[10000] border border-gray-100">
                                            {/* <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                                            <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">Orders</Link> */}
                                            <Link
                                                href="/profile?tab=Account%20Info"
                                                className="block px-4 py-2 hover:bg-gray-100"
                                            >
                                                Profile
                                            </Link>
                                            <Link
                                                href="/profile?tab=Orders"
                                                className="block px-4 py-2 hover:bg-gray-100"
                                            >
                                                Orders
                                            </Link>

                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left text-lg px-4 py-2 hover:bg-red-500 hover:text-white"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link href="/login" className="flex items-center gap-2 hover:text--green-900 transition text-lg">
                                    <User size={20} />
                                    <span>Login</span>
                                </Link>
                            )}
                        </div>

                        {/* Cart Icon with Badge */}
                        <Link
                            // href="/cart"
                            href={`${userName ? '/cart' : '/login'}`}
                            className="relative hover:text--green-900 transition">
                            <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 20H0V6H20V20ZM2 18H18V8H2V18Z"></path>
                                <path d="M14 3.99995H12C12 3.49995 11.8 2.99995 11.4 2.59995C10.7 1.89995 9.3 1.89995 8.6 2.59995C8.2 2.89995 8 3.39995 8 3.99995H6C6 2.89995 6.4 1.89995 7.2 1.19995C8.7 -0.300049 11.3 -0.300049 12.9 1.19995C13.6 1.89995 14 2.89995 14 3.99995Z"></path>
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>

            <TopSearchBar
                open={searchOpen}
                onClose={() => setSearchOpen(false)}
                products={products?.data || []}
                setSearchOpen={setSearchOpen}
            />
        </header>
    );
}

