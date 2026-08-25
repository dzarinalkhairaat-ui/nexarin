import { db } from "@/lib/db/store";
import { AuditLog } from "@/types/user";

export const auditService = {
  async getAll(): Promise<AuditLog[]> {
    return [...db.auditLogs];
  },

  async log(
    adminId: string,
    adminName: string,
    action: "publish_article" | "delete_draft" | "edit_draft" | "create_product" | "update_product" | "publish_version" | "create_affiliate" | "activate_trial" | "manual_order",
    entityType: "article" | "draft" | "product" | "version" | "affiliate" | "order" | "license",
    entityId: string,
    entityName: string,
    details: string
  ): Promise<AuditLog> {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      adminId,
      adminName,
      action,
      entityType,
      entityId,
      entityName,
      details,
      timestamp: new Date().toISOString()
    };
    db.auditLogs.unshift(newLog);
    return newLog;
  }
};
