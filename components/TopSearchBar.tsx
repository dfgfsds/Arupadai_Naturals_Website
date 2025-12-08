'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { slugConvert } from '@/lib/utils';

interface Product {
    id: string | number;
    name: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    products: Product[];
    setSearchOpen:any;
}

const TopSearchBar: React.FC<Props> = ({ open, onClose, products,setSearchOpen }) => {
    const [query, setQuery] = useState('');
    const [filtered, setFiltered] = useState<Product[]>([]);
    const router = useRouter();

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open) inputRef.current?.focus();
    }, [open]);

    useEffect(() => {
        if (query.length > 1) {
            const lower = query.toLowerCase();
            const matches = products.filter(p =>
                p.name.toLowerCase().includes(lower)
            );
            setFiltered(matches);
        } else {
            setFiltered([]);
        }
    }, [query]);

    return (
        <div
            className={`fixed top-0 left-0 w-full h-full bg-white z-[9999] transition-transform duration-300 ease-in-out ${open ? 'translate-y-0' : '-translate-y-full'
                }`}
        >
            <div className="max-w-3xl mx-auto mt-10 md:mt-10 px-6">
                <div className="text-gray-600 text-lg font-medium">
                    Looking for something special?
                </div>
                <div className="flex items-center border-b border-gray-400 relative">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search products...."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 text-2xl  focus:outline-none"
                    />
                    {query && (
                        <button
                            className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400"
                            onClick={() => setQuery('')}
                        >
                            <X size={22} />
                        </button>
                    )}
                    <Search className="ml-3 text-gray-500" size={24} />
                </div>

                {/* Results Dropdown */}
                {filtered.length > 0 && (
                    <div className="mt-1 bg-white rounded-lg p-2 w-full max-h-[300px] overflow-y-auto shadow-lg">
                        {filtered.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => {
                                    setQuery('');
                                    onClose();
                                    router.push(`/products/${slugConvert(item.name)}`);
                                }}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded"
                            >
                                {item.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Close Button */}
            <button
                className="absolute top-6 right-6 text-gray-500 hover:text-black"
                onClick={() => {
                    // onClose
                  setSearchOpen(false)
                  setFiltered([])
                }}
            >
                <X size={30} />
            </button>
        </div>
    );
};

export default TopSearchBar;
