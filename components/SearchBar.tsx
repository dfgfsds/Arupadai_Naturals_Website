'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useCategories } from '@/context/CategoriesContext';

interface Product {
    id: string | number;
    name: string;
    price: string | number;
    image_urls: string[];
    description?: string;
    tags?: string[];
    category?: { name?: string };
}

interface Props {
    products: Product[] | undefined;
}

const SearchBar: React.FC<any> = ({ products }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<{
        products: Product[];
        related: Product[];
    }>({ products: [], related: [] });
    const [showDropdown, setShowDropdown] = useState(false);
    const [category, setCategory] = useState('');

    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const pathname = usePathname();
    const { categories } = useCategories();
    useEffect(() => {
        const tid = setTimeout(() => {
            if (query.length > 2) fetchSearchResults(query);
            else setShowDropdown(false);
        }, 300);
        return () => clearTimeout(tid);
    }, [query]);
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setCategory(value);
        setShowDropdown(false);

        if (value === '') {
            if (pathname !== '/') router.push('/shop');
            return;
        }
        if (value === 'all') {
            if (pathname !== '/categories') router.push('/categories');
            return;
        }
        router.push(`/categories/${value}`);
    };

    const fetchSearchResults = (term: string) => {
        if (!products) return;
        const lower = term.toLowerCase();
        const titleMatches = products.filter((p:any) =>
            p.name.toLowerCase().includes(lower)
        );
        const related = products
            .filter(
                (p:any) =>
                    !titleMatches.includes(p) &&
                    (p.description?.toLowerCase().includes(lower) ||
                        p.tags?.some((t:any) => t.toLowerCase().includes(lower)) ||
                        p.category?.name?.toLowerCase().includes(lower))
            )
            .slice(0, 5);

        setResults({ products: titleMatches, related });
        setShowDropdown(true);
    };
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);
    return (
        <div className="relative w-full" ref={dropdownRef}>
            {/* search + category row */}
            <div className="flex border rounded ml-2">
                <input
                    type="text"
                    className="w-full px-4 py-2 text-md focus:outline-none"
                    placeholder="Enter 3 letters to search products"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />

                <button className="bg-green-600 text-white px-4">
                    <Search size={18} />
                </button>
            </div>

            {/* dropdown */}
            {showDropdown && (
                <div className="absolute z-[999] bg-white border shadow-md w-full mt-2 rounded-md max-h-[400px] overflow-y-auto text-sm">
                    {results.products.length > 0 ? (
                        <>
                            {/* exact matches */}
                            <p className="px-4 py-2 font-bold text-gray-500 border-b">
                                PRODUCTS
                            </p>

                            {results.products.map((item, i) => (
                                <div
                                    key={i}
                                    onClick={() => {
                                        setShowDropdown(false);
                                        setQuery('');
                                        router.push(`/products/${item.id}`);
                                    }}
                                    className="flex gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    {item.image_urls[0] && (
                                        <Image
                                            src={item.image_urls[0]}
                                            alt={item.name}
                                            width={50}
                                            height={50}
                                            className="rounded object-cover"
                                        />
                                    )}

                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-red-700">
                                            {item.price}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {/* related suggestions */}
                            {results.related.length > 0 && (
                                <>
                                    <p className="px-4 py-2 font-bold text-gray-500 border-t border-b">
                                        RELATED PRODUCTS
                                    </p>
                                    {results.related.map((item, i) => (
                                        <div
                                            key={`rel-${i}`}
                                            onClick={() => {
                                                setShowDropdown(false);
                                                setQuery('');
                                                router.push(`/shop/${item.id}`);
                                            }}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            {item.name}
                                        </div>
                                    ))}
                                </>
                            )}
                        </>
                    ) : (
                        /* empty state */
                        <div className="px-4 py-6 text-center text-gray-500">
                            No products found
                            {query && (
                                <>
                                    &nbsp;for&nbsp;
                                    <span className="font-semibold">“{query}”</span>.
                                </>
                            )}
                            <br />
                            Please try another keyword.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
