'use client';

import { Trash2, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

export default function CartItem({
  id,
  name,
  price,
  quantity,
  image,
  onQuantityChange,
  onRemove,
}: CartItemProps) {
  const itemTotal = price * quantity;

  return (
    <div className="flex gap-4 py-6 border-b border-border last:border-b-0">
      {/* Product Image */}
      <div className="w-20 h-20 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={name}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
            No image
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground line-clamp-2">{name}</h3>
        <p className="text-lg font-bold text-primary mt-1">₹{Number(price || 0).toFixed(2)}</p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-3 w-fit">
          <button
            onClick={() => {
              if (quantity > 1) {
                onQuantityChange(quantity - 1);
              }
            }}
            disabled={quantity <= 1}
            className="p-1 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus size={16} className="text-muted-foreground" />
          </button>
          <span className="w-8 text-center font-semibold text-foreground">
            {quantity}
          </span>
          <button
            onClick={() => onQuantityChange(quantity + 1)}
            className="p-1 rounded hover:bg-muted transition-colors"
            aria-label="Increase quantity"
          >
            <Plus size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Price and Remove */}
      <div className="flex flex-col items-end justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Subtotal</p>
          <p className="text-lg font-bold text-foreground">₹{itemTotal.toFixed(2)}</p>
        </div>
        <button
          onClick={onRemove}
          className="p-2 rounded hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
          aria-label="Remove item"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
