import { getSupabaseAdminClient } from "@/lib/db/supabase";
import { db } from "@/lib/db/store";

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  avatar?: string;
  status: "active" | "suspended";
  joinedAt: string;
  authProvider: "email" | "google";
  notes?: string;
}

const DEFAULT_CUSTOMERS: CustomerProfile[] = [
  {
    id: "00000000-0000-0000-0000-000000000002",
    name: "Ahmad Fadillah",
    email: "ahmad.fadillah@example.com",
    phone: "+62 812-3456-7890",
    company: "SMA Nusantara Digital",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
    status: "active",
    joinedAt: "2026-06-10T00:00:00Z",
    authProvider: "email",
    notes: "Pelanggan institusi pendidikan dengan lisensi aktif."
  }
];

function getStoreCustomers(): CustomerProfile[] {
  if (!db.users || !Array.isArray(db.users)) {
    return [...DEFAULT_CUSTOMERS];
  }
  return db.users
    .filter((u: any) => u.role === "customer")
    .map((u: any) => ({
      id: u.id || "usr-cust-001",
      name: u.name || "Customer",
      email: u.email || "customer@example.com",
      phone: u.phone || "+62 812-3456-7890",
      company: u.company || "Personal",
      avatar: u.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
      status: u.status || "active",
      joinedAt: u.joinedAt || new Date().toISOString(),
      authProvider: u.authProvider || "email",
      notes: u.notes || ""
    }));
}

export const customerService = {
  async getAll(): Promise<CustomerProfile[]> {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && Array.isArray(data)) {
          // Filter customer profiles (exclude admin profiles)
          const customerRows = data.filter((p: any) => 
            p.role === "customer" || 
            (!p.role && p.email !== "admin@nexarin.tech" && p.email !== "nexarintech@administrator.com")
          );
          
          if (customerRows.length > 0) {
            return customerRows.map((p: any) => {
              const isSuspended = Array.isArray(p.permissions) && p.permissions.includes("suspended");
              return {
                id: p.id,
                name: p.name || p.email.split("@")[0],
                email: p.email,
                phone: p.phone || "+62 812-3456-7890",
                company: p.company || "Personal / Independent",
                avatar: p.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
                status: isSuspended ? "suspended" : "active",
                joinedAt: p.created_at || new Date().toISOString(),
                authProvider: p.email.includes("@gmail.com") ? "google" : "email",
                notes: p.notes || ""
              };
            });
          }
        }
      } catch (e) {
        console.error("Supabase customerService.getAll error:", e);
      }
    }
    return getStoreCustomers();
  },

  async getByEmail(email: string): Promise<CustomerProfile | null> {
    const normalizedEmail = email.trim().toLowerCase();
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .ilike("email", normalizedEmail)
          .maybeSingle();

        if (!error && data) {
          const isSuspended = Array.isArray(data.permissions) && data.permissions.includes("suspended");
          return {
            id: data.id,
            name: data.name || data.email.split("@")[0],
            email: data.email,
            phone: data.phone || "+62 812-3456-7890",
            company: data.company || "Personal",
            avatar: data.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
            status: isSuspended ? "suspended" : "active",
            joinedAt: data.created_at || new Date().toISOString(),
            authProvider: data.email.includes("@gmail.com") ? "google" : "email",
            notes: data.notes || ""
          };
        }
      } catch (e) {
        console.error("Supabase customerService.getByEmail error:", e);
      }
    }

    const localList = getStoreCustomers();
    return localList.find((c) => c.email.toLowerCase() === normalizedEmail) || null;
  },

  async getById(id: string): Promise<CustomerProfile | null> {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (!error && data) {
          const isSuspended = Array.isArray(data.permissions) && data.permissions.includes("suspended");
          return {
            id: data.id,
            name: data.name || data.email.split("@")[0],
            email: data.email,
            phone: data.phone || "+62 812-3456-7890",
            company: data.company || "Personal",
            avatar: data.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
            status: isSuspended ? "suspended" : "active",
            joinedAt: data.created_at || new Date().toISOString(),
            authProvider: data.email.includes("@gmail.com") ? "google" : "email",
            notes: data.notes || ""
          };
        }
      } catch (e) {
        console.error("Supabase customerService.getById error:", e);
      }
    }

    const localList = getStoreCustomers();
    return localList.find((c) => c.id === id) || null;
  },

  async create(data: { name: string; email: string; phone?: string; company?: string; notes?: string; status?: "active" | "suspended" }): Promise<CustomerProfile> {
    const supabase = getSupabaseAdminClient();
    const newId = crypto.randomUUID();
    const permissions = data.status === "suspended" ? ["suspended"] : [];

    if (supabase) {
      try {
        const { data: inserted, error } = await supabase
          .from("profiles")
          .insert({
            id: newId,
            email: data.email.trim().toLowerCase(),
            name: data.name.trim(),
            company: data.company?.trim() || "Personal",
            avatar_url: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop`,
            role: "customer",
            permissions: permissions,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (!error && inserted) {
          return {
            id: inserted.id,
            name: inserted.name,
            email: inserted.email,
            phone: data.phone || "+62 812-3456-7890",
            company: inserted.company,
            avatar: inserted.avatar_url,
            status: data.status || "active",
            joinedAt: inserted.created_at,
            authProvider: inserted.email.includes("@gmail.com") ? "google" : "email",
            notes: data.notes || ""
          };
        }
      } catch (e) {
        console.error("Supabase customerService.create error:", e);
      }
    }

    // Fallback store
    const fallbackCustomer: CustomerProfile = {
      id: newId,
      name: data.name || "Customer",
      email: data.email || "customer@example.com",
      phone: data.phone || "+62 812-3456-7890",
      company: data.company || "Personal",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
      status: data.status || "active",
      joinedAt: new Date().toISOString(),
      authProvider: data.email.includes("@gmail.com") ? "google" : "email",
      notes: data.notes || ""
    };

    if (!db.users) db.users = [];
    db.users.push({
      id: fallbackCustomer.id,
      name: fallbackCustomer.name,
      email: fallbackCustomer.email,
      avatar: fallbackCustomer.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
      role: "customer",
      joinedAt: fallbackCustomer.joinedAt,
      company: fallbackCustomer.company || "Personal"
    });

    return fallbackCustomer;
  },

  async update(id: string, updates: Partial<CustomerProfile>): Promise<CustomerProfile | null> {
    const supabase = getSupabaseAdminClient();
    const existing = await this.getById(id);
    if (!existing) return null;

    const permissions = updates.status !== undefined 
      ? (updates.status === "suspended" ? ["suspended"] : [])
      : (existing.status === "suspended" ? ["suspended"] : []);

    if (supabase) {
      try {
        const updatePayload: any = {
          updated_at: new Date().toISOString()
        };
        if (updates.name) updatePayload.name = updates.name.trim();
        if (updates.email) updatePayload.email = updates.email.trim().toLowerCase();
        if (updates.company !== undefined) updatePayload.company = updates.company.trim();
        if (updates.status !== undefined) updatePayload.permissions = permissions;

        const { data: updated, error } = await supabase
          .from("profiles")
          .update(updatePayload)
          .eq("id", id)
          .select()
          .single();

        if (!error && updated) {
          return {
            ...existing,
            ...updates,
            id: updated.id,
            name: updated.name || existing.name,
            email: updated.email || existing.email,
            company: updated.company || existing.company,
            status: updates.status || existing.status
          };
        }
      } catch (e) {
        console.error("Supabase customerService.update error:", e);
      }
    }

    // Fallback in memory
    const updatedCustomer: CustomerProfile = {
      ...existing,
      ...updates
    };
    if (db.users) {
      const idx = db.users.findIndex((u: any) => u.id === id || u.email === existing.email);
      if (idx !== -1) {
        db.users[idx] = { ...db.users[idx], ...updates };
      }
    }
    return updatedCustomer;
  },

  async delete(id: string): Promise<boolean> {
    const supabase = getSupabaseAdminClient();
    const existing = await this.getById(id);

    if (supabase) {
      try {
        // Delete from profiles table
        const { error } = await supabase
          .from("profiles")
          .delete()
          .eq("id", id);

        if (!error) {
          // Also delete from auth.users if possible
          try {
            await supabase.auth.admin.deleteUser(id);
          } catch (authErr) {
            // Ignored if user not in auth.users
          }

          // Remove from local store as well
          if (db.users) {
            db.users = db.users.filter((u: any) => u.id !== id && u.email !== existing?.email);
          }

          return true;
        }
      } catch (e) {
        console.error("Supabase customerService.delete error:", e);
      }
    }

    // Fallback store delete
    if (db.users) {
      db.users = db.users.filter((u: any) => u.id !== id && u.email !== existing?.email);
    }
    return true;
  }
};
