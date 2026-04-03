"use client";

import { useState } from "react";
import { Eye, EyeOff, ArrowRight, Mail, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const strengthLabels = ["Weak", "Fair", "Good", "Strong", "Very Strong"];
  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-green-600",
  ];
  const router = useRouter();

  const calculatePasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;

    setPasswordStrength(strength);
  };

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    const baseURL = process.env.NEXT_PUBLIC_API_URL;

    try {
      const res = await fetch(`${baseURL}/auth/check-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok || !data.exists) {
        setError("Email does not exist. Please sign up first.");
        return;
      }

      setSuccessMessage("Email verified! Now set your new password.");
      setTimeout(() => {
        setStep("reset");
        setSuccessMessage("");
      }, 1500);
    } catch (err) {
      setError("Failed to verify email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    const baseURL = process.env.NEXT_PUBLIC_API_URL;

    try {
      const response = await fetch(`${baseURL}/auth/update-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          oldPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to reset password. Please try again.");
        return;
      }

      if (response.ok) {
        setSuccessMessage(
          "Password reset successfully! Redirecting to login...",
        );
        setTimeout(() => {
          router.push("/LoginPage");
        }, 2000);
      } else {
        setError(data.error || "Failed to reset password. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden flex items-center justify-center">
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
          <div className="hidden lg:flex flex-col justify-center space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  G
                </div>
                <span className="text-3xl font-bold text-foreground">
                  GrabMart
                </span>
              </div>
              <p className="text-xl text-muted-foreground max-w-md leading-relaxed">
                Reset your password and regain access to your GrabMart account.
                We&apos;ll help you secure it with a new password.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: "🔒",
                  title: "Secure Reset",
                  desc: "Your data is protected",
                },
                {
                  icon: "⚡",
                  title: "Quick Process",
                  desc: "Just 2 simple steps",
                },
                {
                  icon: "✓",
                  title: "Instant Access",
                  desc: "Start shopping right away",
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

          <div className="animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
            <div className="bg-white rounded-2xl shadow-xl border border-border p-8 md:p-10 space-y-8">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-foreground">
                  {step === "email" ? "Reset Password" : "New Password"}
                </h1>
                <p className="text-muted-foreground">
                  {step === "email"
                    ? "Enter your email to verify your account"
                    : "Create a strong new password"}
                </p>
              </div>

              <div className="flex gap-2">
                <div
                  className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                    step === "email" ? "bg-primary" : "bg-primary/30"
                  }`}
                />
                <div
                  className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                    step === "reset" ? "bg-primary" : "bg-primary/30"
                  }`}
                />
              </div>

              {step === "email" && (
                <form
                  onSubmit={handleEmailSubmit}
                  className="space-y-6 animate-in fade-in duration-500"
                >
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
                        className="w-full pl-12 pr-4 py-3 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all duration-300 placeholder:text-muted-foreground/50 bg-muted/30 focus:bg-background"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      We'll send a verification to this email
                    </p>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                      {error}
                    </div>
                  )}

                  {successMessage && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                      {successMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-primary to-primary/80 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-primary/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group relative overflow-hidden"
                  >
                    <span className={isLoading ? "invisible" : "visible"}>
                      Verify Email
                    </span>
                    <ArrowRight
                      size={20}
                      className={`group-hover:translate-x-1 transition-transform ${
                        isLoading ? "absolute" : ""
                      }`}
                    />
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      </div>
                    )}
                  </button>
                </form>
              )}

              {/* Step 2: Password Reset */}
              {step === "reset" && (
                <form
                  onSubmit={handleResetSubmit}
                  className="space-y-6 animate-in fade-in duration-500"
                >
                  {/* New Password Input */}
                  <div className="space-y-2 group">
                    <label className="block text-sm font-semibold text-foreground">
                      Enter Old Password
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                        size={20}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                        className="w-full pl-12 pr-12 py-3 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all duration-300 bg-muted/30 focus:bg-background"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors hover:scale-110 duration-200"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                    <label className="block text-sm font-semibold text-foreground">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                        size={20}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          calculatePasswordStrength(e.target.value);
                        }}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-3 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all duration-300 placeholder:text-muted-foreground/50 bg-muted/30 focus:bg-background"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors hover:scale-110 duration-200"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                    {newPassword && (
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
                    <p className="text-xs text-muted-foreground">
                      At least 6 characters recommended
                    </p>
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

                  {/* Error Message */}
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                      {error}
                    </div>
                  )}

                  {/* Success Message */}
                  {successMessage && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                      {successMessage}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-primary to-primary/80 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-primary/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group relative overflow-hidden"
                  >
                    <span className={isLoading ? "invisible" : "visible"}>
                      Reset Password
                    </span>
                    <ArrowRight
                      size={20}
                      className={`group-hover:translate-x-1 transition-transform ${
                        isLoading ? "absolute" : ""
                      }`}
                    />
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      </div>
                    )}
                  </button>
                </form>
              )}

              {/* Back Button */}
              {step === "reset" && (
                <button
                  onClick={() => {
                    setStep("email");
                    setError("");
                    setSuccessMessage("");
                  }}
                  className="flex items-center justify-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors w-full"
                >
                  <ArrowLeft size={18} />
                  Back
                </button>
              )}

              {/* Divider */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 text-muted-foreground bg-white">
                    Remember your password?
                  </span>
                </div>
              </div>

              {/* Sign In Link */}
              <Link
                href="/LoginPage"
                className="block w-full text-center py-3 px-4 border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary/5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Back to Sign In
              </Link>
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
