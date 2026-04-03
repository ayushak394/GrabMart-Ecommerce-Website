"use client";

import { useState, useEffect, useMemo } from "react";
import { ShoppingCart, LogOut, Search, Send, Bot, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import ChatInterface from "@/components/ChatInterface";
import Header from "@/components/Header";
import ProductFilters from "@/components/ProductFilters";
import useSWR from "swr";
import { useCart } from "@/components/CartContext";
import { mutate } from "swr";
import { authFetch } from "@/app/utils/AuthFetch";

const fetcher = (url: string) => authFetch(url).then((res) => res.json());

interface FilterOptions {
  category: string[];
  priceRange: [number, number];
  sortBy: string;
  inStockOnly: boolean;
}

export default function HomePage() {
  const router = useRouter();
  const { setCartCount } = useCart();
  const [showChat, setShowChat] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    category: [],
    priceRange: [0, Infinity],
    sortBy: "featured",
    inStockOnly: false,
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // Fetch products
  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
  } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/products`, fetcher);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/LoginPage");
    }
  }, [router]);

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const success = params.get("paymentSuccess");

  if (success === "true") {
    saveOrder();
  }
}, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/LoginPage");
  };

  const saveOrder = async () => {
  try {
    const userId = localStorage.getItem("userId");
    const cartBackup = JSON.parse(localStorage.getItem("cartBackup") || "[]");
    const checkoutData = JSON.parse(localStorage.getItem("checkoutData") || "{}");

    if (!userId || cartBackup.length === 0) return;

    await authFetch(`${API_BASE_URL}/orders/create`, {
      method: "POST",
      body: JSON.stringify({
        userId,
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

    await authFetch(`${API_BASE_URL}/cart/clear/${userId}`, {
      method: "DELETE",
    });

    setCartCount(0); 

    localStorage.removeItem("cartBackup");
    localStorage.removeItem("checkoutData");
  } catch (err) {
    console.error("❌ Error:", err);
  }
};

  const handleAddToCart = async (product: any) => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        router.push("/login");
        return;
      }

      const res = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/add`, {
        method: "POST",
        body: JSON.stringify({
          userId,
          product: {
            productId: product._id.toString(),
            name: product.name,
            price: product.price,
            image: product.image,
          },
        }),
      });

      // ✅ REAL-TIME UPDATE
      if (res.ok) {
        const cartRes = await authFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/cart/${userId}`,
        );
        const data = await cartRes.json();
        setCartCount(data.length); 

        if (res.ok) {
          await mutate(`${process.env.NEXT_PUBLIC_API_URL}/cart/${userId}`);
        }
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  // Extract unique categories and calculate price range
  const categories = useMemo(() => {
    if (!products) return [];
    const cats = new Set<string>();
    products.forEach((p: any) => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats).sort();
  }, [products]);

  const priceStats = useMemo(() => {
    if (!products || products.length === 0) return { min: 0, max: 2000 };
    const prices = products.map((p: any) => p.price || 0);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [products]);

  // Apply all filters
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product: any) => {
      // Search filter
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      // Category filter
      if (
        filters.category.length > 0 &&
        !filters.category.includes(product.category)
      ) {
        return false;
      }

      // Price filter
      const price = product.price || 0;
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
        return false;
      }

      // Stock filter
      if (filters.inStockOnly && (!product.stock || product.stock <= 0)) {
        return false;
      }

      return true;
    });
  }, [products, searchTerm, filters]);

  useEffect(() => {
    if (products && products.length > 0) {
      setFilters((prev) => ({
        ...prev,
        priceRange: [priceStats.min, priceStats.max],
      }));
    }
  }, [products, priceStats]);

  // Sort filtered products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (filters.sortBy) {
      case "price-low":
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case "price-high":
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      case "newest":
        return sorted.sort(
          (a, b) =>
            new Date(b.releaseDate || 0).getTime() -
            new Date(a.releaseDate || 0).getTime(),
        );
      case "oldest":
        return sorted.sort(
          (a, b) =>
            new Date(a.releaseDate || 0).getTime() -
            new Date(b.releaseDate || 0).getTime(),
        );
      default:
        return sorted;
    }
  }, [filteredProducts, filters.sortBy]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header onLogout={handleLogout} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Welcome to GrabMart
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Discover amazing products and get personalized recommendations. Use
            our AI assistant to find exactly what you&apos;re looking for.
          </p>
        </div>

        {/* Search Bar */}
        <div className="animate-in fade-in slide-in-from-left-4 duration-500 delay-100 mb-12">
          <div className="relative max-w-2xl">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={20}
            />
            <input
              type="text"
              placeholder="Search products, categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all duration-300 bg-white placeholder:text-muted-foreground/50"
            />
          </div>
        </div>

        {/* Products Section with Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in duration-500 delay-200">
          {/* Sidebar Filters - Hidden on mobile, visible on lg */}
          <div className="hidden lg:block lg:col-span-1">
            <ProductFilters
              onFilterChange={setFilters}
              categories={categories}
              minPrice={priceStats.min}
              maxPrice={priceStats.max}
              onReset={() =>
                setFilters({
                  category: [],
                  priceRange: [priceStats.min, priceStats.max],
                  sortBy: "featured",
                  inStockOnly: false,
                })
              }
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-foreground">
                {searchTerm
                  ? `Results for "${searchTerm}"`
                  : "Featured Products"}
              </h2>
              {productsLoading && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="animate-spin" size={20} />
                  <span>Loading...</span>
                </div>
              )}
            </div>

            {productsError && (
              <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
                Failed to load products. Please try again later.
              </div>
            )}

            {!productsLoading && sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <Search
                  className="mx-auto mb-4 text-muted-foreground"
                  size={48}
                />
                <p className="text-muted-foreground text-lg">
                  {searchTerm
                    ? `No products found for "${searchTerm}"`
                    : "No products match your filters"}
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilters({
                      category: [],
                      priceRange: [priceStats.min, priceStats.max],
                      sortBy: "featured",
                      inStockOnly: false,
                    });
                  }}
                  className="mt-4 text-primary hover:underline font-semibold"
                >
                  Clear filters and try again
                </button>
              </div>
            )}

            {!productsLoading && sortedProducts.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-6">
                  Showing {sortedProducts.length} product
                  {sortedProducts.length !== 1 ? "s" : ""}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedProducts.map((product: any, index: number) => (
                    <div
                      key={product._id || index}
                      className="animate-in fade-in duration-500"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <ProductCard
                        product={product}
                        onAddToCart={() => handleAddToCart(product)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Chat Popup */}
      {showChat && !isChatMinimized && (
        <div className="fixed bottom-8 right-8 w-96 max-h-[600px] z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <ChatInterface 
            onMinimize={() => setIsChatMinimized(true)}
            onClose={() => setShowChat(false)}
            onAddToCart={(product) => handleAddToCart(product)}
          />
        </div>
      )}

      {/* Floating Action Button - Chat Toggle (only show when chat not open) */}
      {(!showChat || isChatMinimized) && (
        <button
          onClick={() => {
            setShowChat(true);
            setIsChatMinimized(false);
          }}
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-primary to-accent rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-white hover:scale-110 active:scale-95 z-40 animate-in fade-in slide-in-from-bottom-4 duration-500"
          aria-label="Open AI Chat"
        >
          <Bot size={24} />
        </button>
      )}
    </div>
  );
}
