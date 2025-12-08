'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useProducts } from '@/context/ProductsContext';
import { useCartItem } from '@/context/CartItemContext';
import { useVendor } from '@/context/VendorContext';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface Product {
  image_urls: string[];
  id: number;
  name: string;
  price: string;
  image: string;
  description?: string;
  thumbnails?: string[];
}

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  isOpen: boolean;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const sliderSettings = {
    autoplay: true,
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };


  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-4xl mx-auto rounded-lg shadow-lg p-6 relative overflow-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
        >
          <X size={20} />
        </button>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left - Main Image + Thumbnails */}
          <div>
            <Image
              src={activeImage || product.image_urls[0]}
              alt={product.name}
              width={400}
              height={400}
              className="w-full h-[350px] object-contain"
            />

            {/* Thumbnails */}
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
          </div>

          {/* Right - Info */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
            <p className="text--green-900 text-2xl font-bold mt-1">{product.price}</p>
            <p className="mt-4 text-gray-600">
              {product.description ||
                'We are trying to introduce positive results of our explorations. If you want to know more information about our goods, terms, guarantees and delivery — View Full Info.'}
            </p>

            <div className="mt-6">
              <label className="text-sm font-semibold text-gray-700">Quantity:</label>
              <input
                type="number"
                min="1"
                defaultValue="1"
                className="border px-4 py-1 rounded w-20 ml-2"
              />
            </div>

            <button className="mt-4 bg-gray-700 text-white py-2 px-6 rounded uppercase font-semibold hover:bg-gray-800">
              Add to Cart
            </button>

            <p className="text-sm mt-4 underline text--green-900 cursor-pointer">
              View Full Info
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;

