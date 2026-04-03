"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Mail,
  Lock,
  User,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const router = useRouter();

  const calculatePasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value;
    setPassword(pwd);
    calculatePasswordStrength(pwd);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    const baseURL = process.env.NEXT_PUBLIC_API_URL;

    try {
      const response = await fetch(`${baseURL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setPasswordStrength(0);

        setTimeout(() => {
          router.push("/LoginPage");
        }, 2000);
      } else {
        setError(data.error || "Signup failed. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const strengthLabels = ["Weak", "Fair", "Good", "Strong", "Very Strong"];
  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-green-600",
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden flex items-center justify-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/4 w-60 h-60 bg-primary/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Branding & Benefits */}
          <div className="hidden lg:flex flex-col justify-center space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 ">
                  <img
                    src="/favicon.ico"
                    alt="GrabMart Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-3xl font-bold text-foreground">
                  GrabMart
                </span>
              </div>
              <p className="text-xl text-muted-foreground max-w-md leading-relaxed">
                Join thousands of happy shoppers. Create your account and start
                exploring amazing products today.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: "✓",
                  title: "Fast Registration",
                  desc: "Sign up in just 30 seconds",
                },
                {
                  icon: "🛍️",
                  title: "Exclusive Access",
                  desc: "Get early access to new deals",
                },
                {
                  icon: "🔒",
                  title: "Safe & Secure",
                  desc: "Your data is protected",
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 animate-in fade-in duration-700"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <div className="animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
            <div className="bg-white rounded-2xl shadow-xl border border-border p-8 md:p-10 space-y-8">
              {/* Form Header */}
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-foreground">
                  Create Account
                </h1>
                <p className="text-muted-foreground">
                  Join GrabMart and start shopping
                </p>
              </div>

              {/* Success Message */}
              {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <CheckCircle className="text-green-700" size={20} />
                  <div>
                    <p className="font-semibold text-green-700">
                      Account created!
                    </p>
                    <p className="text-sm text-green-600">
                      Redirecting to login...
                    </p>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username Input */}
                <div className="space-y-2 group">
                  <label className="block text-sm font-semibold text-foreground">
                    Username
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Choose a unique username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all duration-300 placeholder:text-muted-foreground/50 bg-muted/30 focus:bg-background"
                      required
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-2 group">
                  <label className="block text-sm font-semibold text-foreground">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                      size={20}
                    />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all duration-300 placeholder:text-muted-foreground/50 bg-muted/30 focus:bg-background"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2 group">
                  <label className="block text-sm font-semibold text-foreground">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                      size={20}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all duration-300 placeholder:text-muted-foreground/50 bg-muted/30 focus:bg-background"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors hover:scale-110 duration-200"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="space-y-2 animate-in fade-in duration-300">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                              i < passwordStrength
                                ? strengthColors[passwordStrength - 1]
                                : "bg-border/30"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Password strength:{" "}
                        <span className="font-semibold text-foreground">
                          {strengthLabels[passwordStrength]}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-2 group">
                  <label className="block text-sm font-semibold text-foreground">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                      size={20}
                    />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all duration-300 placeholder:text-muted-foreground/50 bg-muted/30 focus:bg-background"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors hover:scale-110 duration-200"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border border-2 cursor-pointer accent-primary"
                    required
                  />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    I agree to the{" "}
                    <a
                      href="#"
                      className="text-primary hover:underline font-semibold"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-primary hover:underline font-semibold"
                    >
                      Privacy Policy
                    </a>
                  </span>
                </label>

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <AlertCircle className="text-red-700" size={20} />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-primary to-primary/80 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-primary/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group relative overflow-hidden"
                >
                  <span className={isLoading ? "invisible" : "visible"}>
                    Create Account
                  </span>
                  <ArrowRight
                    size={20}
                    className={`group-hover:translate-x-1 transition-transform ${isLoading ? "absolute" : ""}`}
                  />
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                  )}
                </button>

                {/* Divider */}
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 text-muted-foreground bg-white">
                      Already have an account?
                    </span>
                  </div>
                </div>

                {/* Sign In Link */}
                <Link
                  href="/LoginPage"
                  className="block w-full text-center py-3 px-4 border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary/5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Sign In
                </Link>
              </form>

              {/* Footer Text */}
              <p className="text-xs text-muted-foreground text-center">
                We&apos;ll never share your information without your permission.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
