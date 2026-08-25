import { db } from "@/lib/db/store";
import { Order } from "@/types/product";
import { licenseService } from "./licenseService";
import { notificationService } from "./notificationService";

export const orderService = {
  async getAll(): Promise<Order[]> {
    return [...db.orders];
  },

  async getByCustomer(email: string): Promise<Order[]> {
    return db.orders.filter((o) => o.customerEmail.toLowerCase() === email.toLowerCase());
  },

  async getById(orderId: string): Promise<Order | null> {
    return db.orders.find((o) => o.id === orderId) || null;
  },

  async create(data: {
    customerEmail: string;
    customerName: string;
    productId: string;
    productName: string;
    productSlug?: string;
    productVersion: string;
    amount: number;
    paymentMethod: string;
  }): Promise<{ order: Order; licenseKey: string }> {
    const orderId = `ord-${Date.now()}`;
    const orderNumber = `NEX-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      userId: "usr-cust-001",
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      items: [
        {
          productId: data.productId,
          productName: data.productName,
          productSlug: data.productSlug || data.productId,
          version: data.productVersion,
          price: data.amount,
          licenseType: "lifetime"
        }
      ],
      subtotal: data.amount,
      discount: 0,
      total: data.amount,
      currency: "IDR",
      paymentProvider: "Manual",
      paymentReference: `TRX-MAN-${Date.now()}`,
      status: "paid",
      paidAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    db.orders.unshift(newOrder);

    const license = await licenseService.generateLicense({
      customerEmail: data.customerEmail,
      customerName: data.customerName,
      productId: data.productId,
      productName: data.productName,
      productSlug: data.productSlug,
      orderId: newOrder.id,
      licenseType: "lifetime"
    });

    await notificationService.create({
      userId: "usr-cust-001",
      type: "order_success",
      title: "Pesanan & Lisensi Aktif",
      message: `Pembelian lisensi lifetime ${data.productName} berhasil. Kunci lisensi Anda: ${license.licenseKey}`,
      link: "/customer/licenses"
    });

    return { order: newOrder, licenseKey: license.licenseKey };
  }
};
