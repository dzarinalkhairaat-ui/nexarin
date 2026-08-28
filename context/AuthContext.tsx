"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, UserRole } from "@/types/user";
import { getSupabaseClient } from "@/lib/db/supabase";

export interface CustomerUser extends User {
  role: "customer";
  googleLinked?: boolean;
  googleEmail?: string;
}

export interface AdminUser extends User {
  role: "admin";
  permissions: string[];
}

interface AuthContextType {
  customer: CustomerUser | null;
  admin: AdminUser | null;
  isCustomerAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  isLoading: boolean;
  
  // Customer Auth Methods
  loginCustomer: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  registerCustomer: (name: string, email: string, password?: string, company?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (redirectTo?: string) => Promise<{ success: boolean; error?: string }>;
  linkGoogleAccount: () => Promise<{ success: boolean; error?: string }>;
  unlinkGoogleAccount: () => Promise<{ success: boolean; error?: string }>;
  logoutCustomer: () => void;
  
  // Admin Auth Methods
  loginAdmin: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => void;
  
  // Unified Helpers
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCustomer: boolean;
  isGoogleLinked: boolean;
  login: (email: string, targetRole?: UserRole) => void;
  logout: () => void;
}

const DEFAULT_CUSTOMER: CustomerUser = {
  id: "usr-cust-001",
  name: "Ahmad Fadillah",
  email: "ahmad.fadillah@example.com",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
  role: "customer",
  joinedAt: "2026-06-10T00:00:00Z",
  company: "SMA Nusantara Digital",
  googleLinked: false
};

const DEFAULT_ADMIN: AdminUser = {
  id: "usr-adm-001",
  name: "Rins (Administrator)",
  email: "admin@nexarin.tech",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
  role: "admin",
  joinedAt: "2026-01-01T00:00:00Z",
  company: "Nexarin Tech HQ",
  permissions: ["all", "editorial", "shop", "affiliate", "analytics"]
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<CustomerUser | null>(null);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    try {
      const savedCustomer = localStorage.getItem("nexarin_customer_session");
      if (savedCustomer && isMounted) {
        setCustomer(JSON.parse(savedCustomer));
      }

      const savedAdmin = localStorage.getItem("nexarin_admin_session");
      if (savedAdmin && isMounted) {
        setAdmin(JSON.parse(savedAdmin));
      }

      const supabase = getSupabaseClient();
      if (supabase) {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user && isMounted) {
            const userMeta = session.user.user_metadata || {};
            const isGoogle = session.user.app_metadata?.provider === "google" || session.user.identities?.some(i => i.provider === "google");
            const customerUser: CustomerUser = {
              id: session.user.id,
              name: userMeta.full_name || userMeta.name || session.user.email?.split("@")[0] || "Customer",
              email: session.user.email || "",
              avatar: userMeta.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
              role: "customer",
              joinedAt: session.user.created_at || new Date().toISOString(),
              company: userMeta.company,
              googleLinked: Boolean(isGoogle),
              googleEmail: isGoogle ? session.user.email : undefined
            };
            setCustomer(customerUser);
            localStorage.setItem("nexarin_customer_session", JSON.stringify(customerUser));
          }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user && isMounted) {
            const userMeta = session.user.user_metadata || {};
            const isGoogle = session.user.app_metadata?.provider === "google" || session.user.identities?.some(i => i.provider === "google");
            const customerUser: CustomerUser = {
              id: session.user.id,
              name: userMeta.full_name || userMeta.name || session.user.email?.split("@")[0] || "Customer",
              email: session.user.email || "",
              avatar: userMeta.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
              role: "customer",
              joinedAt: session.user.created_at || new Date().toISOString(),
              company: userMeta.company,
              googleLinked: Boolean(isGoogle),
              googleEmail: isGoogle ? session.user.email : undefined
            };
            setCustomer(customerUser);
            localStorage.setItem("nexarin_customer_session", JSON.stringify(customerUser));
          } else if (_event === "SIGNED_OUT" && isMounted) {
            setCustomer(null);
            localStorage.removeItem("nexarin_customer_session");
          }
        });

        return () => {
          isMounted = false;
          subscription.unsubscribe();
        };
      }
    } catch (e) {
      console.error("Failed to load auth session", e);
    } finally {
      if (isMounted) setIsLoading(false);
    }
  }, []);

  const loginCustomer = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    if (!email || !email.includes("@")) {
      return { success: false, error: "Alamat email tidak valid." };
    }
    if (password && password.length < 6) {
      return { success: false, error: "Password minimal 6 karakter." };
    }

    try {
      // 1. Try Supabase Auth first if configured
      const supabase = getSupabaseClient();
      if (supabase && password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (!error && data.user) {
          const userMeta = data.user.user_metadata || {};
          const isGoogle = data.user.app_metadata?.provider === "google" || data.user.identities?.some(i => i.provider === "google");
          const customerUser: CustomerUser = {
            id: data.user.id,
            name: userMeta.full_name || userMeta.name || email.split("@")[0],
            email: data.user.email || email,
            avatar: userMeta.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
            role: "customer",
            joinedAt: data.user.created_at || new Date().toISOString(),
            company: userMeta.company,
            googleLinked: Boolean(isGoogle),
            googleEmail: isGoogle ? (data.user.email || email) : undefined
          };
          setCustomer(customerUser);
          localStorage.setItem("nexarin_customer_session", JSON.stringify(customerUser));
          return { success: true };
        }
      }

      // 2. Fallback to API route / Mock store
      const res = await fetch("/api/auth/customer/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Gagal masuk ke akun customer." };
      }

      const customerUser: CustomerUser = {
        id: data.data.user.id || "usr-cust-001",
        name: data.data.user.name || email.split("@")[0].replace(".", " "),
        email: data.data.user.email || email,
        avatar: data.data.user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
        role: "customer",
        joinedAt: data.data.user.joinedAt || new Date().toISOString(),
        company: data.data.user.company,
        googleLinked: false
      };

      setCustomer(customerUser);
      localStorage.setItem("nexarin_customer_session", JSON.stringify(customerUser));
      return { success: true };
    } catch (e) {
      // Fallback in-memory
      const fallbackUser: CustomerUser = {
        ...DEFAULT_CUSTOMER,
        name: email.split("@")[0].replace(".", " "),
        email
      };
      setCustomer(fallbackUser);
      localStorage.setItem("nexarin_customer_session", JSON.stringify(fallbackUser));
      return { success: true };
    }
  };

  const registerCustomer = async (
    name: string,
    email: string,
    password?: string,
    company?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!name || name.trim().length < 2) {
      return { success: false, error: "Nama lengkap wajib diisi (minimal 2 karakter)." };
    }
    if (!email || !email.includes("@")) {
      return { success: false, error: "Alamat email tidak valid." };
    }
    if (password && password.length < 6) {
      return { success: false, error: "Password minimal 6 karakter." };
    }

    try {
      // 1. Try Supabase Auth Sign Up
      const supabase = getSupabaseClient();
      if (supabase && password) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              company,
              role: "customer"
            }
          }
        });
        if (error) {
          if (error.message.toLowerCase().includes("rate limit") || error.message.toLowerCase().includes("over_email_send_rate_limit")) {
            console.warn("Supabase email rate limit reached, continuing with instant customer session:", error.message);
          } else {
            return { success: false, error: error.message };
          }
        }
      }

      // 2. Register in customer session
      const newCustomer: CustomerUser = {
        id: `usr-cust-${Date.now().toString().slice(-4)}`,
        name,
        email,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
        role: "customer",
        joinedAt: new Date().toISOString(),
        company: company || undefined,
        googleLinked: false
      };

      setCustomer(newCustomer);
      localStorage.setItem("nexarin_customer_session", JSON.stringify(newCustomer));
      return { success: true };
    } catch (e) {
      const newCustomer: CustomerUser = {
        id: `usr-cust-${Date.now().toString().slice(-4)}`,
        name,
        email,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
        role: "customer",
        joinedAt: new Date().toISOString(),
        company: company || undefined,
        googleLinked: false
      };
      setCustomer(newCustomer);
      localStorage.setItem("nexarin_customer_session", JSON.stringify(newCustomer));
      return { success: true };
    }
  };

  // Google OAuth Login
  const loginWithGoogle = async (redirectTo?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const supabase = getSupabaseClient();
      const redirectUrl = redirectTo 
        ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`
        : `${window.location.origin}/auth/callback?next=/customer`;

      if (supabase) {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: redirectUrl
          }
        });

        if (error) {
          return { success: false, error: error.message };
        }
        if (data.url) {
          window.location.href = data.url;
          return { success: true };
        }
      }

      // Demo / Mock Google Login simulation
      const mockGoogleUser: CustomerUser = {
        id: `usr-google-${Date.now().toString().slice(-4)}`,
        name: "Dzarin Alkhairaat (Google User)",
        email: "dzarin.google@example.com",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
        role: "customer",
        joinedAt: new Date().toISOString(),
        company: "Google Workspace",
        googleLinked: true,
        googleEmail: "dzarin.google@example.com"
      };

      setCustomer(mockGoogleUser);
      localStorage.setItem("nexarin_customer_session", JSON.stringify(mockGoogleUser));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Gagal menginisialisasi login Google." };
    }
  };

  // Link Google Account inside Dashboard Customer
  const linkGoogleAccount = async (): Promise<{ success: boolean; error?: string }> => {
    if (!customer) {
      return { success: false, error: "Anda harus masuk terlebih dahulu." };
    }

    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase.auth.linkIdentity({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/customer/profile`
          }
        });
        if (error) {
          return { success: false, error: error.message };
        }
        if (data.url) {
          window.location.href = data.url;
          return { success: true };
        }
      }

      // Update local state
      const updatedCustomer: CustomerUser = {
        ...customer,
        googleLinked: true,
        googleEmail: customer.email.includes("@gmail.com") ? customer.email : `${customer.email.split("@")[0]}@gmail.com`
      };

      setCustomer(updatedCustomer);
      localStorage.setItem("nexarin_customer_session", JSON.stringify(updatedCustomer));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Gagal menautkan akun Google." };
    }
  };

  // Unlink Google Account
  const unlinkGoogleAccount = async (): Promise<{ success: boolean; error?: string }> => {
    if (!customer) {
      return { success: false, error: "Anda harus masuk terlebih dahulu." };
    }

    try {
      const updatedCustomer: CustomerUser = {
        ...customer,
        googleLinked: false,
        googleEmail: undefined
      };

      setCustomer(updatedCustomer);
      localStorage.setItem("nexarin_customer_session", JSON.stringify(updatedCustomer));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Gagal memutuskan tautan Google." };
    }
  };

  const logoutCustomer = () => {
    setCustomer(null);
    localStorage.removeItem("nexarin_customer_session");
    const supabase = getSupabaseClient();
    if (supabase) {
      supabase.auth.signOut().catch(() => {});
    }
  };

  const loginAdmin = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    if (!email || !email.includes("@")) {
      return { success: false, error: "Email Administrator tidak valid." };
    }

    try {
      const res = await fetch("/api/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Kredensial Admin tidak valid." };
      }

      const adminUser: AdminUser = {
        id: data.data.admin.id || "usr-adm-001",
        name: data.data.admin.name || "Rins (Administrator)",
        email: data.data.admin.email || email,
        avatar: data.data.admin.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
        role: "admin",
        joinedAt: data.data.admin.joinedAt || "2026-01-01T00:00:00Z",
        company: "Nexarin Tech HQ",
        permissions: data.data.admin.permissions || ["all"]
      };

      setAdmin(adminUser);
      localStorage.setItem("nexarin_admin_session", JSON.stringify(adminUser));
      return { success: true };
    } catch (e) {
      if (email === "admin@nexarin.tech" && password === "admin123") {
        setAdmin(DEFAULT_ADMIN);
        localStorage.setItem("nexarin_admin_session", JSON.stringify(DEFAULT_ADMIN));
        return { success: true };
      }
      return { success: false, error: "Kredensial Admin tidak valid. Gunakan admin@nexarin.tech / admin123" };
    }
  };

  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem("nexarin_admin_session");
  };

  // Unified getters
  const activeUser = admin || customer || null;
  const activeRole: UserRole = admin ? "admin" : customer ? "customer" : "visitor";

  const login = (email: string, targetRole: UserRole = "customer") => {
    if (targetRole === "admin") {
      loginAdmin(email, "admin123");
    } else {
      loginCustomer(email, "password123");
    }
  };

  const logout = () => {
    logoutCustomer();
    logoutAdmin();
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        admin,
        isCustomerAuthenticated: Boolean(customer),
        isAdminAuthenticated: Boolean(admin),
        isLoading,
        loginCustomer,
        registerCustomer,
        loginWithGoogle,
        linkGoogleAccount,
        unlinkGoogleAccount,
        logoutCustomer,
        loginAdmin,
        logoutAdmin,
        user: activeUser,
        role: activeRole,
        isAuthenticated: Boolean(activeUser),
        isAdmin: Boolean(admin),
        isCustomer: Boolean(customer),
        isGoogleLinked: Boolean(customer?.googleLinked),
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
