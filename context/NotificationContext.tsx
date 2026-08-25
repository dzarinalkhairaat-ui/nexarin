"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Notification } from "@/types/user";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message?: string;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;
  addNotification: (notification: Omit<Notification, "id" | "createdAt" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-1",
    userId: "usr-cust-001",
    type: "product_update",
    title: "Versi Baru Tersedia: v2.1.0",
    message: "Nexarin Sistem Absensi Sekolah mendapatkan update perbaikan validasi GPS dan laporan rapor K13/Merdeka.",
    link: "/customer/updates",
    read: false,
    createdAt: "2026-08-20T10:00:00Z"
  },
  {
    id: "notif-2",
    userId: "usr-cust-001",
    type: "order_success",
    title: "Pembayaran Berhasil Dikonfirmasi",
    message: "Lisensi Lifetime untuk Nexarin Sistem Absensi Sekolah telah aktif.",
    link: "/customer/licenses",
    read: true,
    createdAt: "2026-06-10T14:30:00Z"
  }
];

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("nexarin_notifications");
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse notifications", e);
      }
    }
  }, []);

  const saveNotifications = (items: Notification[]) => {
    setNotifications(items);
    localStorage.setItem("nexarin_notifications", JSON.stringify(items));
  };

  const showToast = (toast: Omit<ToastMessage, "id">) => {
    const id = "toast-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6);
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    const duration = toast.duration || 4500;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addNotification = (notif: Omit<Notification, "id" | "createdAt" | "read">) => {
    const item: Notification = {
      ...notif,
      id: "notif-" + Date.now(),
      createdAt: new Date().toISOString(),
      read: false
    };
    const updated = [item, ...notifications];
    saveNotifications(updated);
    showToast({
      type: "info",
      title: item.title,
      message: item.message
    });
  };

  const markAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    saveNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const clearNotifications = () => {
    saveNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        toasts,
        showToast,
        removeToast,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}
