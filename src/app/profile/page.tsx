"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ordersService, Order } from "@/service/Orders";
import { api } from "@/lib/axios";
import { getMediaUrl } from "@/lib/mediaUrl";
import { format } from "timeago.js";

const fulfillmentColors: Record<string, string> = {
  NOT_FULFILLED: "bg-yellow-100 text-yellow-800",
  FULFILLED: "bg-green-100 text-green-800",
  PARTIALLY_FULFILLED: "bg-blue-100 text-blue-800",
  CANCELED: "bg-red-100 text-red-800",
};

const paymentColors: Record<string, string> = {
  PAID: "bg-green-100 text-green-800",
  NOT_PAID: "bg-red-100 text-red-800",
  PARTIALLY_REFUNDED: "bg-orange-100 text-orange-800",
  FULLY_REFUNDED: "bg-gray-100 text-gray-800",
  PENDING: "bg-yellow-100 text-yellow-800",
};

const ProfilePage = () => {
  const { user, loading, isAuthenticated, fetchProfile } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    text: string;
    ok: boolean;
  } | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      ordersService
        .getMyOrders()
        .then(setOrders)
        .catch(() => {})
        .finally(() => setOrdersLoading(false));
    } else {
      setOrdersLoading(false);
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-lama border-t-transparent animate-spin" />
          <p className="text-gray-400 text-sm">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-gray-600 text-lg">You are not logged in.</p>
        <Link
          href="/login"
          className="bg-lama text-white px-6 py-2 rounded-md hover:opacity-90 transition"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage(null);
    try {
      const form = new FormData();
      form.append("username", username);
      form.append("email", email);
      const file = fileRef.current?.files?.[0];
      if (file) form.append("profilePicture", file);
      await api.patch(`/user/${user.id}`, form);
      await fetchProfile();
      setSaveMessage({ text: "Profile updated successfully!", ok: true });
    } catch {
      setSaveMessage({
        text: "Failed to update profile. Please try again.",
        ok: false,
      });
    } finally {
      setSaving(false);
    }
  };

  const avatarSrc = avatarPreview || getMediaUrl(user.profilePicture);

  // Order stats
  const totalSpent = orders.reduce((sum, o) => sum + (o.totals?.total ?? 0), 0);
  const fulfilledCount = orders.filter(
    (o) => o.fulfillmentStatus === "FULFILLED",
  ).length;
  const pendingCount = orders.filter(
    (o) => o.fulfillmentStatus === "NOT_FULFILLED",
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 pt-28 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* ══════════════════════════════════════
            LEFT — Profile Card + Edit Form
        ══════════════════════════════════════ */}
        <div className="w-full lg:w-[420px] shrink-0 flex flex-col gap-6">
          {/* Profile card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center gap-3">
            {/* Avatar */}
            <div
              className="relative w-28 h-28 rounded-full overflow-hidden ring-4 ring-lama/20 cursor-pointer group"
              onClick={() => fileRef.current?.click()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarSrc}
                alt="Profile picture"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <span className="text-white text-xs font-medium">Change</span>
              </div>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />

            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {user.username}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
            </div>

            {/* Role badge */}
            <span className="px-3 py-1 rounded-full bg-lama/10 text-lama text-xs font-semibold capitalize">
              {user.role ?? "customer"}
            </span>

            {/* Member since */}
            {user.createdAt && (
              <p className="text-xs text-gray-400">
                Member since{" "}
                <span className="font-medium text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </p>
            )}

            {/* Quick stats */}
            <div className="w-full mt-2 grid grid-cols-3 divide-x divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
              <div className="flex flex-col items-center py-3 px-2 bg-gray-50">
                <span className="text-lg font-bold text-gray-800">
                  {orders.length}
                </span>
                <span className="text-[11px] text-gray-400">Orders</span>
              </div>
              <div className="flex flex-col items-center py-3 px-2 bg-gray-50">
                <span className="text-lg font-bold text-gray-800">
                  {fulfilledCount}
                </span>
                <span className="text-[11px] text-gray-400">Delivered</span>
              </div>
              <div className="flex flex-col items-center py-3 px-2 bg-gray-50">
                <span className="text-lg font-bold text-gray-800">
                  ${totalSpent.toFixed(0)}
                </span>
                <span className="text-[11px] text-gray-400">Spent</span>
              </div>
            </div>
          </div>

          {/* Edit form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-base font-semibold text-gray-800 mb-5">
              Edit Profile
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="ring-1 ring-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lama/50"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="ring-1 ring-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lama/50"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Role
                </label>
                <input
                  type="text"
                  value={user.role ?? "customer"}
                  disabled
                  className="ring-1 ring-gray-100 rounded-lg p-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Profile Photo
                </label>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="text-left ring-1 ring-gray-200 rounded-lg p-2.5 text-sm text-gray-500 hover:ring-lama/50 transition"
                >
                  {fileRef.current?.files?.[0]?.name ??
                    "Click to choose a new photo…"}
                </button>
              </div>

              {saveMessage && (
                <p
                  className={`text-sm ${saveMessage.ok ? "text-green-600" : "text-red-500"}`}
                >
                  {saveMessage.text}
                </p>
              )}

              <button
                type="submit"
                disabled={saving}
                className="mt-1 w-full bg-lama text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </form>
          </div>
        </div>

        {/* ══════════════════════════════════════
            RIGHT — My Orders
        ══════════════════════════════════════ */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">My Orders</h1>
            {!ordersLoading && orders.length > 0 && (
              <span className="text-sm text-gray-400">
                {pendingCount} pending
              </span>
            )}
          </div>

          {ordersLoading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 rounded-xl bg-gray-100 animate-pulse"
                />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-16 gap-3">
              <span className="text-4xl">🛍️</span>
              <p className="text-gray-500 font-medium">No orders yet</p>
              <Link href="/list" className="text-sm text-lama hover:underline">
                Start shopping →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {orders.map((order) => {
                const firstItem = order.lineItems[0];
                return (
                  <Link
                    key={order._id}
                    href={`/orders/${order._id}`}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-lama/20 transition p-4 flex items-center gap-4"
                  >
                    {/* Thumbnail */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      {firstItem?.mediaItem?.src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={firstItem.mediaItem.src}
                          alt={firstItem.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">
                          📦
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-800">
                          Order #{order.number}
                        </span>
                        <span
                          className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                            fulfillmentColors[order.fulfillmentStatus] ??
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {order.fulfillmentStatus.replace(/_/g, " ")}
                        </span>
                        <span
                          className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                            paymentColors[order.paymentStatus] ??
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {order.paymentStatus.replace(/_/g, " ")}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 truncate">
                        {order.lineItems.length} item
                        {order.lineItems.length !== 1 ? "s" : ""}
                        {" · "}
                        {firstItem?.name}
                        {order.lineItems.length > 1 &&
                          ` +${order.lineItems.length - 1} more`}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {format(order.createdAt)}
                      </p>
                    </div>

                    {/* Total + arrow */}
                    <div className="shrink-0 flex flex-col items-end gap-1">
                      <span className="text-base font-bold text-gray-800">
                        ${order.totals?.total?.toFixed(2) ?? "—"}
                      </span>
                      <span className="text-xs text-gray-300">›</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
