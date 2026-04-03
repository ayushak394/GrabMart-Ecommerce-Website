"use client";

import { useState, useEffect } from "react";
import {
  Camera,
  Mail,
  MapPin,
  ShoppingBag,
  DollarSign,
  Edit2,
  Save,
  X,
  Loader2,
  AlertCircle,
  Send,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import useSWR, { mutate } from "swr";
import { authFetch } from "@/app/utils/AuthFetch";

const fetcher = (url: string) =>
  authFetch(url).then((res) => res.json());

interface UserProfile {
  username: string;
  email: string;
  profilePic: string;
  bio: string;
  location: string;
}

interface Stats {
  totalOrders: number;
  totalSpent: number;
}

interface FormData {
  username: string;
  bio: string;
  location: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    bio: "",
    location: "",
  });
  const [feedback, setFeedback] = useState("");
  const [uploadingPic, setUploadingPic] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  // Fetch profile data
  const { data: profile, isLoading: profileLoading, error: profileError } = useSWR(
    userId ? `${process.env.NEXT_PUBLIC_API_URL}/Profile/getProfile/${userId}` : null,
    fetcher
  );

  // Fetch stats data
  const { data: stats } = useSWR(
    userId ? `${process.env.NEXT_PUBLIC_API_URL}/orders/stats/${userId}` : null,
    fetcher
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");

    if (!token || !storedUserId) {
      router.push("/LoginPage");
      return;
    }

    setUserId(storedUserId);
  }, [router]);

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        bio: profile.bio || "",
        location: profile.location || "",
      });
    }
  }, [profile]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    router.push("/LoginPage");
  };

  const handleProfilePicChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    setUploadingPic(true);
    const formDataFile = new FormData();
    formDataFile.append("profilePic", file);

    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Profile/uploadProfilePic/${userId}`,
        {
          method: "POST",
          body: formDataFile,
        }
      );

      if (res.ok) {
        setSubmitSuccess("Profile picture updated successfully!");
        mutate(
          `${process.env.NEXT_PUBLIC_API_URL}/Profile/getProfile/${userId}`
        );
        setTimeout(() => setSubmitSuccess(""), 3000);
      } else {
        setSubmitError("Failed to upload profile picture");
      }
    } catch (error) {
      setSubmitError("Error uploading profile picture");
      console.error(error);
    } finally {
      setUploadingPic(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!userId) return;

    setSubmitError("");
    setSubmitSuccess("");

    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Profile/updateProfile/${userId}`,
        {
          method: "PUT",
          body: JSON.stringify(formData),
        }
      );

      if (res.ok) {
        setSubmitSuccess("Profile updated successfully!");
        setIsEditing(false);
        mutate(
          `${process.env.NEXT_PUBLIC_API_URL}/Profile/getProfile/${userId}`
        );
        setTimeout(() => setSubmitSuccess(""), 3000);
      } else {
        setSubmitError("Failed to update profile");
      }
    } catch (error) {
      setSubmitError("Error updating profile");
      console.error(error);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) {
      setSubmitError("Please enter your feedback");
      return;
    }

    setSubmitError("");
    setSubmitSuccess("");

    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Profile/submitFeedback`,
        {
          method: "POST",
          body: JSON.stringify({ feedback }),
        }
      );

      if (res.ok) {
        setSubmitSuccess("Feedback submitted successfully! Thank you.");
        setFeedback("");
        setTimeout(() => setSubmitSuccess(""), 3000);
      } else {
        setSubmitError("Failed to submit feedback");
      }
    } catch (error) {
      setSubmitError("Error submitting feedback");
      console.error(error);
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin">
          <Loader2 className="text-primary" size={40} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/4 w-60 h-60 bg-primary/3 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <Header onLogout={handleLogout} />

      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Notifications */}
        {submitError && (
          <div className="fixed top-24 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 animate-in fade-in slide-in-from-top-4 duration-300 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 shadow-lg z-50">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <span className="flex-1 text-sm font-medium">{submitError}</span>
            <button
              onClick={() => setSubmitError("")}
              className="flex-shrink-0 hover:opacity-70 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {submitSuccess && (
          <div className="fixed top-24 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 animate-in fade-in slide-in-from-top-4 duration-300 flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 shadow-lg z-50">
            <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
            <span className="flex-1 text-sm font-medium">{submitSuccess}</span>
            <button
              onClick={() => setSubmitSuccess("")}
              className="flex-shrink-0 hover:opacity-70 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Profile Header Section */}
        <div className="mb-12">
          <div className="animate-in fade-in slide-in-from-top-8 duration-700">
            <div className="relative bg-gradient-to-r from-primary/20 via-primary/10 to-accent/10 rounded-3xl border border-primary/20 p-8 sm:p-12 overflow-hidden">
              {/* Decorative gradient blob */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/30 to-accent/20 rounded-full blur-3xl -mr-20 -mt-20" />

              <div className="relative flex flex-col sm:flex-row gap-8 items-start sm:items-center">
                {/* Profile Picture with Upload */}
                <div className="relative group animate-in fade-in slide-in-from-left-8 duration-700 delay-100">
                  <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white/50 shadow-2xl group-hover:border-primary/60 transition-all duration-500">
                    {profileLoading ? (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <Loader2 className="animate-spin text-primary" size={32} />
                      </div>
                    ) : (
                      <img
                        src={profile?.profilePic || "/user.png"}
                        alt="Profile"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = "/user.png";
                        }}
                      />
                    )}
                  </div>

                  {/* Upload Button */}
                  <label className="absolute bottom-0 right-0 bg-gradient-to-r from-primary to-primary/80 text-white p-4 rounded-full cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-125 active:scale-95 group-hover:opacity-100 opacity-80 shadow-lg hover:shadow-primary/50">
                    {uploadingPic ? (
                      <Loader2 className="animate-spin" size={24} />
                    ) : (
                      <Camera size={24} />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePicChange}
                      disabled={uploadingPic}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Profile Info or Edit Form */}
                {isEditing ? (
                  <div className="flex-1 space-y-6 w-full animate-in fade-in slide-in-from-right-8 duration-500 delay-100">
                    <div>
                      <label className="text-sm font-bold text-foreground block mb-3 tracking-wide uppercase">
                        Username
                      </label>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            username: e.target.value,
                          })
                        }
                        className="w-full px-5 py-3 bg-white/80 border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all duration-300 focus:shadow-lg focus:shadow-primary/20 font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-foreground block mb-3 tracking-wide uppercase">
                        Bio
                      </label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            bio: e.target.value,
                          })
                        }
                        placeholder="Tell us about yourself..."
                        className="w-full px-5 py-3 bg-white/80 border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all duration-300 focus:shadow-lg focus:shadow-primary/20 resize-none font-medium"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-foreground block mb-3 tracking-wide uppercase">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            location: e.target.value,
                          })
                        }
                        className="w-full px-5 py-3 bg-white/80 border-2 border-primary/30 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all duration-300 focus:shadow-lg focus:shadow-primary/20 font-medium"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleUpdateProfile}
                        className="flex-1 bg-gradient-to-r from-primary to-primary/80 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] uppercase tracking-wide"
                      >
                        <Save size={20} />
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 bg-white/60 border-2 border-primary/30 text-foreground px-6 py-3 rounded-xl font-bold hover:bg-white/80 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] uppercase tracking-wide"
                      >
                        <X size={20} />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 animate-in fade-in slide-in-from-right-8 duration-700 delay-100">
                    <div className="mb-6">
                      <h1 className="text-4xl sm:text-5xl font-bold text-foreground text-balance">
                        {profileLoading ? (
                          <Loader2 className="animate-spin inline text-primary" />
                        ) : (
                          profile?.username || "User"
                        )}
                      </h1>
                      {profile?.bio && (
                        <p className="text-muted-foreground mt-3 text-lg leading-relaxed max-w-2xl">
                          {profile.bio}
                        </p>
                      )}
                    </div>

                    <div className="space-y-4 text-base">
                      <div className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors duration-300">
                        <div className="bg-gradient-to-br from-primary to-primary/70 text-white p-3 rounded-lg">
                          <Mail size={20} />
                        </div>
                        <span className="font-medium">{profile?.email || "Loading..."}</span>
                      </div>
                      {profile?.location && (
                        <div className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors duration-300">
                          <div className="bg-gradient-to-br from-accent to-accent/70 text-white p-3 rounded-lg">
                            <MapPin size={20} />
                          </div>
                          <span className="font-medium">{profile.location}</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setIsEditing(true)}
                      className="mt-8 bg-gradient-to-r from-primary to-primary/80 text-white px-8 py-3 rounded-xl font-bold hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98] uppercase tracking-wide"
                    >
                      <Edit2 size={20} />
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {/* Total Orders Card */}
          <div className="group animate-in fade-in slide-in-from-left-8 duration-700 delay-200">
            <div className="relative bg-white rounded-2xl border border-primary/20 p-8 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/40 cursor-default h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Total Orders
                  </p>
                  <p className="text-5xl font-black bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    {(stats?.totalOrders ?? 0)}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-primary to-primary/70 text-white p-6 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-primary/40">
                  <ShoppingBag size={32} />
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-primary/10 flex items-center gap-2 text-primary text-sm font-semibold group-hover:translate-x-1 transition-transform">
                <span onClick={() => router.push("/OrderPage")}>View orders</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Spent Card */}
          <div className="group animate-in fade-in slide-in-from-right-8 duration-700 delay-300">
            <div className="relative bg-white rounded-2xl border border-accent/20 p-8 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 hover:border-accent/40 cursor-default h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    Total Spent
                  </p>
                  <p className="text-5xl font-black bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
                    ₹{stats ? stats.totalSpent.toFixed(0) : "0"}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-accent to-accent/70 text-white p-6 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-accent/40">
                  <DollarSign size={32} />
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-accent/10 flex items-center gap-2 text-accent text-sm font-semibold group-hover:translate-x-1 transition-transform">
                <span onClick={() => router.push("/OrderPage")}>View history</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
          <div className="relative bg-white rounded-3xl border border-border p-8 sm:p-12 overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/20 to-accent/10 rounded-full blur-3xl -mr-20 -mt-20" />
            
            <div className="relative">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                    Share Your Feedback
                  </h2>
                  <p className="text-muted-foreground text-lg max-w-2xl">
                    Help us improve your shopping experience by sharing your thoughts and suggestions. Your feedback matters!
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-bold text-foreground block mb-4 uppercase tracking-wide">
                    Your Feedback
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Tell us what you think about your experience..."
                    className="w-full px-6 py-4 bg-muted/50 border-2 border-border rounded-xl focus:outline-none focus:border-primary focus:bg-background transition-all duration-300 resize-none focus:ring-4 focus:ring-primary/10 font-medium placeholder:text-muted-foreground/60"
                    rows={5}
                  />
                </div>

                <button
                  onClick={handleSubmitFeedback}
                  disabled={!feedback.trim()}
                  className="w-full bg-gradient-to-r from-primary to-primary/80 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 uppercase tracking-wide"
                >
                  <Send size={22} />
                  Submit Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
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
