"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, UserRole } from "@/types/user";

export interface CustomerUser extends User {
  role: "customer";
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
  logoutCustomer: () => void;
  
  // Admin Auth Methods
  loginAdmin: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => void;
  
  // Legacy / Unified Helpers
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCustomer: boolean;
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
  company: "SMA Nusantara Digital"
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
    try {
      const savedCustomer = localStorage.getItem("nexarin_customer_session");
      if (savedCustomer) {
        setCustomer(JSON.parse(savedCustomer));
      }

      const savedAdmin = localStorage.getItem("nexarin_admin_session");
      if (savedAdmin) {
        setAdmin(JSON.parse(savedAdmin));
      }
    } catch (e) {
      console.error("Failed to load auth session", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginCustomer = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    if (!email || !email.includes("@")) {
      return { success: false, error: "Alamat email tidak valid." };
    }
    if (password && password.length < 6) {
      return { success: false, error: "Password minimal 6 karakter." };
    }

    const customerUser: CustomerUser = {
      id: email === "ahmad.fadillah@example.com" ? "usr-cust-001" : "usr-" + Date.now(),
      name: email === "ahmad.fadillah@example.com" ? "Ahmad Fadillah" : email.split("@")[0],
      email,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
      role: "customer",
      joinedAt: new Date().toISOString(),
      company: email === "ahmad.fadillah@example.com" ? "SMA Nusantara Digital" : undefined
    };

    setCustomer(customerUser);
    localStorage.setItem("nexarin_customer_session", JSON.stringify(customerUser));
    return { success: true };
  };

  const registerCustomer = async (
    name: string,
    email: string,
    password?: string,
    company?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!name.trim()) {
      return { success: false, error: "Nama lengkap wajib diisi." };
    }
    if (!email || !email.includes("@")) {
      return { success: false, error: "Alamat email tidak valid." };
    }
    if (password && password.length < 6) {
      return { success: false, error: "Password minimal 6 karakter." };
    }

    const newCustomer: CustomerUser = {
      id: "usr-" + Date.now(),
      name,
      email,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
      role: "customer",
      joinedAt: new Date().toISOString(),
      company
    };

    setCustomer(newCustomer);
    localStorage.setItem("nexarin_customer_session", JSON.stringify(newCustomer));
    return { success: true };
  };

  const logoutCustomer = () => {
    setCustomer(null);
    localStorage.removeItem("nexarin_customer_session");
  };

  const loginAdmin = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Strict admin authorization check
    if (cleanEmail !== "admin@nexarin.tech" && !cleanEmail.endsWith("@nexarin.tech")) {
      return {
        success: false,
        error: "Akses Ditolak: Alamat email tidak terdaftar sebagai Administrator Nexarin."
      };
    }

    if (password && password !== "admin123" && password !== "password123") {
      return {
        success: false,
        error: "Password keamanan administrator salah."
      };
    }

    const adminUser: AdminUser = {
      ...DEFAULT_ADMIN,
      email: cleanEmail
    };

    setAdmin(adminUser);
    localStorage.setItem("nexarin_admin_session", JSON.stringify(adminUser));
    return { success: true };
  };

  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem("nexarin_admin_session");
  };

  // Unified legacy fallbacks
  const activeUser = admin || customer;
  const activeRole: UserRole = admin ? "admin" : customer ? "customer" : "visitor";

  const legacyLogin = (email: string, targetRole: UserRole = "customer") => {
    if (targetRole === "admin") {
      loginAdmin(email);
    } else {
      loginCustomer(email);
    }
  };

  const legacyLogout = () => {
    logoutCustomer();
    logoutAdmin();
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        admin,
        isCustomerAuthenticated: !!customer,
        isAdminAuthenticated: !!admin,
        isLoading,
        loginCustomer,
        registerCustomer,
        logoutCustomer,
        loginAdmin,
        logoutAdmin,
        user: activeUser,
        role: activeRole,
        isAuthenticated: !!activeUser,
        isAdmin: !!admin,
        isCustomer: !!customer,
        login: legacyLogin,
        logout: legacyLogout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
