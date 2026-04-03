'use client';

import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

interface ProductCardProps {
  product: {
    _id?: string;
    name: string;
    price: number;
    image?: string;
    description?: string;
    category?: string;
    rating?: number;
    reviews?: number;
  };
  onAddToCart: () => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      onAddToCart();
    } finally {
      setIsAdding(false);
    }
  };

  const imageUrl = product.image || `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9dz7VMUv6R17BYG8Ht_rEkbnahgHYQGxEjA&s`;

  return (
    <div className="group bg-white rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative w-full h-48 bg-muted overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorited(!isFavorited)}
          className="absolute top-3 right-3 p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 z-10"
        >
          <Heart
            size={20}
            className={`transition-colors duration-300 ${
              isFavorited ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
            }`}
          />
        </button>

        {/* Category Badge */}
        {product.category && (
          <div className="absolute top-3 left-3 bg-primary/90 text-white text-xs font-bold px-3 py-1 rounded-full">
            {product.category}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-grow">
            {product.description}
          </p>
        )}

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-3">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={`${
                    i < Math.floor(product.rating || 0)
                      ? 'fill-accent text-accent'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            {product.reviews && (
              <span className="text-xs text-muted-foreground">({product.reviews})</span>
            )}
          </div>
        )}

        {/* Price & CTA */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
          <div className="flex flex-col">
            <p className="text-2xl font-bold text-foreground">
              ₹{product.price.toFixed(2)}
            </p>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="p-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex-shrink-0"
            aria-label="Add to cart"
          >
            {isAdding ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <ShoppingCart size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
