"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Package, Calendar, DollarSign, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import useSWR from "swr";
import { authFetch } from "@/app/utils/AuthFetch";

const fetcher = (url: string) => authFetch(url).then((res) => res.json());

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
  };
  createdAt: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;


  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");

    if (!token) {
      router.push("/LoginPage");
      return;
    }

    setUserId(storedUserId);
  }, [router]);

  const { data: orders, error, isLoading } = useSWR(
  userId ? `${API_BASE_URL}/orders/${userId}` : null,
  fetcher
);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/LoginPage");
  };

  if (!userId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onLogout={handleLogout} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
          <Link
            href="/HomePage"
            className="inline-flex items-center gap-2 text-primary hover:underline font-semibold mb-6 transition-all duration-300 hover:gap-3"
          >
            <ArrowLeft size={20} />
            Back to Shopping
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Your Orders
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            View and track all your past orders from GrabMart
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="animate-spin mx-auto mb-4 text-primary" size={40} />
              <p className="text-muted-foreground">Loading your orders...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-6 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-4 animate-in fade-in duration-300">
            <AlertCircle className="text-red-700 dark:text-red-400 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-300 mb-1">Failed to load orders</h3>
              <p className="text-red-700 dark:text-red-400 text-sm">
                We encountered an error while fetching your orders. Please try again later.
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && (!orders || orders.length === 0) && (
          <div className="text-center py-16 animate-in fade-in duration-300">
            <Package className="mx-auto mb-4 text-muted-foreground" size={48} />
            <h2 className="text-2xl font-semibold text-foreground mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              You haven&apos;t placed any orders yet. Start shopping to see your orders here!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Continue Shopping
            </Link>
          </div>
        )}

        {/* Orders List */}
        {!isLoading && !error && orders && orders.length > 0 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <p className="text-sm text-muted-foreground">
              {orders.length} order{orders.length !== 1 ? "s" : ""} found
            </p>

            {orders.map((order: Order, index: number) => (
              <div
                key={order._id}
                className="border border-border rounded-lg p-6 hover:shadow-md transition-all duration-300 animate-in fade-in duration-500"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-6 border-b border-border">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                    <p className="font-mono text-foreground font-semibold">{order._id}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="text-muted-foreground" size={18} />
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="text-foreground font-semibold">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <DollarSign className="text-muted-foreground" size={18} />
                      <div>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-foreground font-semibold text-lg">
                          ${order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {order.items.map((item: OrderItem, itemIndex: number) => (
                      <div key={itemIndex} className="flex gap-4 p-4 bg-muted/30 rounded-lg">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg bg-muted"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground truncate">{item.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Qty: <span className="font-semibold">{item.quantity}</span>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Price: <span className="font-semibold text-foreground">${item.price.toFixed(2)}</span> each
                          </p>
                        </div>

                        {/* Item Total */}
                        <div className="flex-shrink-0 text-right">
                          <p className="text-muted-foreground text-sm mb-1">Item Total</p>
                          <p className="text-lg font-bold text-primary">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address */}
                {order.customer && (
                  <div className="pt-6 border-t border-border">
                    <h3 className="font-semibold text-foreground mb-4">Delivery Address</h3>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-foreground font-semibold">
                        {order.customer.firstName} {order.customer.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">{order.customer.address}</p>
                      <p className="text-sm text-muted-foreground mt-1">{order.customer.email}</p>
                      <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
