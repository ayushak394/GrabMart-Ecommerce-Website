"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, ArrowLeft, ShoppingCart as CartIcon } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import CartItem from "@/components/CartItem";
import OrderSummary from "@/components/OrderSummary";
import CheckoutModal, { UserCheckoutData } from "@/components/CheckoutModal";
import { Button } from "@/components/ui/button";
import useSWR from "swr";
import { useCart } from "@/components/CartContext";
import { authFetch } from "@/app/utils/AuthFetch";

interface CartProduct {
  _id: string;
  productId: {
    _id: string;
    name: string;
    price: number;
    image?: string;
  };
  quantity: number;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL;

const fetcher = async (url: string) => {
  const res = await authFetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export default function CartPage() {
  const { setCartCount } = useCart();
  const [userId, setUserId] = useState<string>("");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Get userId
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(storedUserId);
  }, []);

  // 🔥 HANDLE PAYMENT SUCCESS (after redirect)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get("paymentSuccess");

    if (success === "true") {
      saveOrder();
    }
  }, []);

  const saveOrder = async () => {
    try {
      const storedUserId = localStorage.getItem("userId");
      const cartBackup = JSON.parse(
        localStorage.getItem("cartBackup") || "[]"
      );
      const checkoutData = JSON.parse(
        localStorage.getItem("checkoutData") || "{}"
      );

      if (!storedUserId || cartBackup.length === 0) return;

      await authFetch(`${API_BASE_URL}/orders/create`, {
        method: "POST",
        body: JSON.stringify({
          userId: storedUserId,
          items: cartBackup.map((item: any) => ({
            productId: item.productId._id,
            name: item.productId.name,
            price: item.productId.price,
            quantity: item.quantity,
            image: item.productId.image,
          })),
          totalAmount: cartBackup.reduce(
            (sum: number, item: any) =>
              sum + item.productId.price * item.quantity,
            0
          ),
          customer: checkoutData,
        }),
      });

      await authFetch(`${API_BASE_URL}/cart/clear/${storedUserId}`, {
        method: "DELETE",
      });

      localStorage.removeItem("cartBackup");
      localStorage.removeItem("checkoutData");

      setMessage({
        type: "success",
        text: "Order placed successfully!",
      });
    } catch {
      setMessage({
        type: "error",
        text: "Failed to save order",
      });
    }
  };

  // Fetch cart
  const {
    data: cartItems = [],
    isLoading,
    mutate,
  } = useSWR(userId ? `${API_BASE_URL}/cart/${userId}` : null, fetcher, {
    revalidateOnFocus: true,
  });

  // REMOVE ITEM
  const handleRemoveItem = useCallback(
    async (productId: string) => {
      try {
        const res = await authFetch(
          `${API_BASE_URL}/cart/remove/${userId}/${productId}`,
          { method: "DELETE" }
        );

        if (res.ok) {
          const updatedCart = await authFetch(`${API_BASE_URL}/cart/${userId}`);
          const data = await updatedCart.json();

          setCartCount(data.length);
          mutate(data, false);
        }
      } catch {
        setMessage({ type: "error", text: "Error removing item" });
      }
    },
    [userId, mutate]
  );

  // UPDATE QUANTITY
  const handleQuantityChange = useCallback(
    async (productId: string, newQuantity: number) => {
      try {
        const res = await authFetch(
          `${API_BASE_URL}/cart/update/${userId}/${productId}`,
          {
            method: "PUT",
            body: JSON.stringify({ quantity: newQuantity }),
          }
        );

        if (res.ok) {
          const updatedCart = await authFetch(`${API_BASE_URL}/cart/${userId}`);
          const data = await updatedCart.json();

          setCartCount(data.length);
          mutate(data, false);
        }
      } catch {
        setMessage({ type: "error", text: "Error updating quantity" });
      }
    },
    [userId, mutate]
  );

  // TOTALS
  const subtotal = cartItems.reduce(
    (sum: number, item: CartProduct) =>
      sum + (item.productId?.price || 0) * item.quantity,
    0
  );

  const tax = subtotal * 0.18;
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + tax + shipping;

  // CHECKOUT
  const handleCheckout = useCallback(
    async (userData: UserCheckoutData) => {
      setIsProcessing(true);

      try {
        localStorage.setItem("cartBackup", JSON.stringify(cartItems));
        localStorage.setItem("checkoutData", JSON.stringify(userData));

        const res = await authFetch(`${API_BASE_URL}/payment/create-order`, {
          method: "POST",
          body: JSON.stringify({
            amount: Number(total.toFixed(2)),
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
          }),
        });

        const data = await res.json();

        const cashfree = (window as any).Cashfree({
          mode: "sandbox",
        });

        await cashfree.checkout({
          paymentSessionId: data.payment_session_id,
          redirectTarget: "_self",
        });

        setCheckoutOpen(false);
      } catch {
        setMessage({ type: "error", text: "Payment failed" });
      } finally {
        setIsProcessing(false);
      }
    },
    [cartItems, total]
  );

  if (!userId) {
    return (
      <>
        <Header />
        <div className="text-center mt-20">
          <p>Please login to view your cart</p>
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen pt-24 px-4">
        {message && (
          <div className="text-center text-green-600 mb-4">
            {message.text}
          </div>
        )}

        {isLoading ? (
          <Loader2 className="animate-spin mx-auto" />
        ) : cartItems.length === 0 ? (
          <div className="text-center mt-20">
            <CartIcon className="mx-auto mb-4" size={48} />
            <p className="text-lg">Your cart is empty</p>
            <Link href="/HomePage">
              <Button className="mt-4">Go Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* LEFT SIDE */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item: CartProduct) => (
                <CartItem
                  key={item._id}
                  id={item._id}
                  name={item.productId?.name}
                  price={item.productId?.price}
                  quantity={item.quantity}
                  image={item.productId?.image}
                  onRemove={() => handleRemoveItem(item.productId?._id)}
                  onQuantityChange={(qty) =>
                    handleQuantityChange(item.productId?._id, qty)
                  }
                />
              ))}
            </div>

            {/* RIGHT SIDE */}
            <OrderSummary
              subtotal={subtotal}
              tax={tax}
              shipping={shipping}
              total={total}
              itemCount={cartItems.length}
              isLoading={isProcessing}
              onCheckout={() => setCheckoutOpen(true)}
            />
          </div>
        )}
      </main>

      <CheckoutModal
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        total={total}
        onSubmit={handleCheckout}
        isLoading={isProcessing}
      />
    </>
  );
}