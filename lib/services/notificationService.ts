import { db } from "@/lib/db/store";
import { Notification } from "@/types/user";

export const notificationService = {
  async getByRecipient(email: string): Promise<Notification[]> {
    return [...db.notifications];
  },

  async create(data: Omit<Notification, "id" | "read" | "createdAt">): Promise<Notification> {
    const newNotif: Notification = {
      ...data,
      id: `notif-${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString()
    };
    db.notifications.unshift(newNotif);
    return newNotif;
  },

  async broadcast(
    type: "product_update" | "order_success" | "trial_started" | "trial_expiring" | "system" | "editorial",
    title: string,
    message: string,
    link?: string
  ): Promise<void> {
    await this.create({
      userId: "usr-cust-001",
      type,
      title,
      message,
      link
    });
  },

  async markAsRead(id: string): Promise<boolean> {
    const notif = db.notifications.find((n) => n.id === id);
    if (!notif) return false;
    notif.read = true;
    return true;
  },

  async markAllAsRead(email?: string): Promise<void> {
    db.notifications.forEach((n) => (n.read = true));
  }
};
