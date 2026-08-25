export type UserRole = "visitor" | "customer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  joinedAt: string;
  company?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: "product_update" | "order_success" | "trial_started" | "trial_expiring" | "system" | "editorial";
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: "publish_article" | "delete_draft" | "edit_draft" | "create_product" | "update_product" | "publish_version" | "create_affiliate" | "activate_trial" | "manual_order";
  entityType: "article" | "draft" | "product" | "version" | "affiliate" | "order" | "license";
  entityId: string;
  entityName: string;
  details: string;
  timestamp: string;
}
