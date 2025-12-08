"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaHome, FaList, FaShoppingCart, FaStore, FaUser } from "react-icons/fa";

export default function BottomNavBar() {
    const pathname = usePathname();

    const links = [
        { href: "/", label: "Home", icon: <FaHome /> },
        { href: "/products", label: "Shop", icon: <FaStore /> },
        { href: "/categories", label: "Categories", icon: <FaList /> },
        { href: "/cart", label: "Cart", icon: <FaShoppingCart /> },
        { href: "/profile", label: "Profile", icon: <FaUser /> },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md md:hidden z-50">
            <ul className="flex justify-around items-center py-2">
                {links.map((link) => (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            className={`flex flex-col items-center text-sm ${pathname === link.href
                                ? "text--green-900"
                                : "text-gray-600 hover:text--green-900"
                                }`}
                        >
                            <span className="text-lg">{link.icon}</span>
                            <span>{link.label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
