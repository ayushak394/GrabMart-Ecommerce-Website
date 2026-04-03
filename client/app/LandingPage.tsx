"use client";

import { useState, useEffect } from "react";
import { ArrowRight, ShoppingCart, Bot, User, CreditCard, Zap, BarChart3, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);
  const [selectedFeature, setSelectedFeature] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <ShoppingCart size={32} />,
      title: "Smart Shopping",
      description: "Browse thousands of products with advanced filtering and real-time inventory updates.",
      color: "from-primary to-primary/70",
    },
    {
      icon: <Bot size={32} />,
      title: "AI Assistant",
      description: "Get personalized product recommendations powered by Gemini AI. Chat naturally to find what you need.",
      color: "from-accent to-accent/70",
    },
    {
      icon: <CreditCard size={32} />,
      title: "Secure Payments",
      description: "Complete your purchases safely with Cashfree payment integration and secure checkout.",
      color: "from-cyan-500 to-cyan-400",
    },
    {
      icon: <User size={32} />,
      title: "User Profiles",
      description: "Manage your account, track orders, customize your profile, and share feedback.",
      color: "from-purple-500 to-purple-400",
    },
    {
      icon: <BarChart3 size={32} />,
      title: "Order Analytics",
      description: "View your spending statistics, order history, and personalized insights.",
      color: "from-orange-500 to-orange-400",
    },
    {
      icon: <Zap size={32} />,
      title: "Lightning Fast",
      description: "Experience blazing-fast load times and smooth interactions with our optimized platform.",
      color: "from-green-500 to-green-400",
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10">
              <img
                src="/favicon.ico"
                alt="GrabMart Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-bold text-foreground">GrabMart</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/LoginPage" className="text-foreground hover:text-primary transition-colors font-medium">
              Sign In
            </Link>
            <Link
              href="/SignUpPage"
              className="bg-gradient-to-r from-primary to-primary/80 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/40 transition-all duration-300 hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen pt-32 pb-20 flex items-center">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-in fade-in slide-in-from-left-8 duration-700">
              <div className="inline-block mb-6 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
                <span className="text-sm font-semibold text-primary">Welcome to the Future of Shopping</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-foreground mb-6 text-balance leading-tight">
                Shop Smart,{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Shop Fast
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed">
                Discover an intelligent shopping experience powered by AI. Find exactly what you need, manage your orders seamlessly, and enjoy secure checkout in seconds.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.push("/SignUpPage")}
                  className="bg-gradient-to-r from-primary to-primary/80 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group"
                >
                  Start Shopping
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </button>

                <button
                  onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                  className="bg-white/60 border-2 border-primary/30 text-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/80 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Learn More
                </button>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-6">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                  <p className="text-3xl font-black bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">1K+</p>
                  <p className="text-sm text-muted-foreground mt-1">Products</p>
                </div>
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                  <p className="text-3xl font-black bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">24/7</p>
                  <p className="text-sm text-muted-foreground mt-1">Support</p>
                </div>
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                  <p className="text-3xl font-black bg-gradient-to-r from-purple-500 to-purple-400 bg-clip-text text-transparent">100%</p>
                  <p className="text-sm text-muted-foreground mt-1">Secure</p>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
              <div className="relative h-96 sm:h-[500px] flex items-center justify-center">
                {/* Floating cards */}
                <div
                  className="absolute w-64 h-40 bg-white rounded-2xl shadow-2xl p-6 border border-border/50 hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
                  style={{
                    transform: `translateY(${scrollY * 0.1}px) rotate(-12deg)`,
                    transitionProperty: "transform",
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ShoppingCart className="text-primary" size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Smart Checkout</p>
                      <p className="text-xs text-muted-foreground">Secure & Fast</p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">Powered by Cashfree</div>
                </div>

                <div
                  className="absolute w-64 h-40 bg-white rounded-2xl shadow-2xl p-6 border border-border/50 hover:shadow-accent/30 transition-all duration-300 hover:scale-105"
                  style={{
                    transform: `translateY(${scrollY * 0.15}px) rotate(12deg)`,
                    transitionProperty: "transform",
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Bot className="text-accent" size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">AI Assistant</p>
                      <p className="text-xs text-muted-foreground">Gemini Powered</p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">Find products instantly</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="text-primary" size={24} />
      </div>

      {/* Features Section */}
      <section id="features" className="relative py-24 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16 animate-in fade-in slide-in-from-top-8 duration-700">
            <div className="inline-block mb-4 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
              <span className="text-sm font-semibold text-primary">Powerful Features</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-4">Everything You Need</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A complete platform designed to make your shopping experience seamless and enjoyable
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group animate-in fade-in slide-in-from-bottom-8 duration-700 cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setSelectedFeature(index)}
              >
                <div className="relative bg-white rounded-2xl border border-border/50 p-8 h-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-primary/30">
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity" style={{ backgroundImage: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)` }} />

                  <div className={`bg-gradient-to-br ${feature.color} text-white w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {feature.icon}
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-top-8 duration-700">
            <div className="inline-block mb-4 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full">
              <span className="text-sm font-semibold text-accent">Simple Process</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-4">Get Started in 3 Steps</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Create an account, start shopping, and enjoy the convenience
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: 1, title: "Create Account", desc: "Sign up with your email and set a secure password", icon: "👤" },
              { step: 2, title: "Browse & Search", desc: "Use AI assistant or filters to find products you love", icon: "🛍️" },
              { step: 3, title: "Checkout Safely", desc: "Complete your purchase with secure payment methods", icon: "💳" },
            ].map((item, index) => (
              <div
                key={index}
                className="animate-in fade-in slide-in-from-bottom-8 duration-700"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative">
                  {index < 2 && (
                    <div className="hidden md:block absolute top-20 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                  )}

                  <div className="bg-white rounded-2xl border border-border/50 p-8 text-center h-full hover:shadow-xl transition-all duration-300">
                    <div className="text-5xl mb-4">{item.icon}</div>
                    <div className="inline-block w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 text-white flex items-center justify-center font-bold mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="relative py-24 bg-gradient-to-b from-primary/10 via-transparent to-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-top-8 duration-700">
            <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-4">Built with Modern Tech</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powered by cutting-edge technologies for the best performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Feature 1 */}
            <div className="animate-in fade-in slide-in-from-left-8 duration-700">
              <div className="bg-white rounded-2xl border border-border/50 p-8 hover:shadow-xl transition-all duration-300 h-full">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-2xl font-bold text-foreground mb-4">AI-Powered Search</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Our Gemini AI assistant understands natural language. Just chat about what you're looking for and get personalized recommendations instantly.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-foreground">Natural language understanding</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-foreground">Smart product recommendations</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-foreground">24/7 availability</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="animate-in fade-in slide-in-from-right-8 duration-700 delay-100">
              <div className="bg-white rounded-2xl border border-border/50 p-8 hover:shadow-xl transition-all duration-300 h-full">
                <div className="text-4xl mb-4">💳</div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Secure Payments</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Complete your purchases with confidence using Cashfree's industry-leading payment gateway with advanced fraud protection.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-accent rounded-full" />
                    <span className="text-foreground">Multiple payment methods</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-accent rounded-full" />
                    <span className="text-foreground">Encrypted transactions</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-accent rounded-full" />
                    <span className="text-foreground">Instant confirmation</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="animate-in fade-in slide-in-from-left-8 duration-700 delay-200">
              <div className="bg-white rounded-2xl border border-border/50 p-8 hover:shadow-xl transition-all duration-300 h-full">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Order Management</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Track your orders, view spending analytics, and manage your entire purchase history all in one place.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-foreground">Real-time order tracking</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-foreground">Spending insights</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-foreground">Order history</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="animate-in fade-in slide-in-from-right-8 duration-700 delay-300">
              <div className="bg-white rounded-2xl border border-border/50 p-8 hover:shadow-xl transition-all duration-300 h-full">
                <div className="text-4xl mb-4">👤</div>
                <h3 className="text-2xl font-bold text-foreground mb-4">User Profiles</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Customize your profile, manage preferences, and enjoy a personalized shopping experience tailored just for you.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-accent rounded-full" />
                    <span className="text-foreground">Custom avatars</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-accent rounded-full" />
                    <span className="text-foreground">Bio & location</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-accent rounded-full" />
                    <span className="text-foreground">Share feedback</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl border border-primary/30 p-12 sm:p-16 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -ml-32 -mb-32" />

            <div className="relative text-center">
              <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-6">Ready to Shop Smart?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of happy customers and start your journey with GrabMart today.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push("/SignUpPage")}
                  className="bg-gradient-to-r from-primary to-primary/80 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Get Started for Free
                </button>

                <button
                  onClick={() => router.push("/LoginPage")}
                  className="bg-white text-foreground px-8 py-4 rounded-xl font-bold text-lg border-2 border-border hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Already Registered? Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
