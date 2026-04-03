'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface OrderSummaryProps {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
  isLoading: boolean;
  onCheckout: () => void;
}

export default function OrderSummary({
  subtotal,
  tax,
  shipping,
  total,
  itemCount,
  isLoading,
  onCheckout,
}: OrderSummaryProps) {
  return (
    <Card className="p-6 h-fit sticky top-6">
      <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center pb-4 border-b border-border">
          <span className="text-muted-foreground">
            Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})
          </span>
          <span className="font-semibold text-foreground">₹{subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center pb-4 border-b border-border">
          <span className="text-muted-foreground">Tax (18%)</span>
          <span className="font-semibold text-foreground">₹{tax.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center pb-4 border-b border-border">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-semibold text-foreground">
            {shipping === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              `₹${shipping.toFixed(2)}`
            )}
          </span>
        </div>

        <div className="flex justify-between items-center pt-4">
          <span className="text-lg font-bold text-foreground">Total</span>
          <span className="text-2xl font-bold text-primary">₹{total.toFixed(2)}</span>
        </div>
      </div>

      <Button
        onClick={onCheckout}
        disabled={isLoading || subtotal === 0}
        className="w-full h-12 font-semibold text-base"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin mr-2" size={18} />
            Processing...
          </>
        ) : (
          'Proceed to Checkout'
        )}
      </Button>

      {subtotal === 0 && (
        <p className="text-center text-sm text-muted-foreground mt-4">
          Add items to proceed with checkout
        </p>
      )}
    </Card>
  );
}
