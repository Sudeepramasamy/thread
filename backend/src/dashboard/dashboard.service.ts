import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  /**
   * Calculates dashboard summary statistics.
   * Business Rules:
   * 1. Total Sales: Sum of `total` for orders with status CONFIRMED, PROCESSING, SHIPPED, DELIVERED.
   *    (Excludes PENDING and CANCELLED orders).
   * 2. Total Orders: All recorded orders across all statuses.
   * 3. Total Products: Count of active and inactive catalog products.
   * 4. Low Stock Products: Products where stock is less than or equal to 10 units.
   * 5. Recent Orders: The last 6 placed orders with customer details.
   */
  async getMetrics() {
    const eligibleStatuses = [
      OrderStatus.CONFIRMED,
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPED,
      OrderStatus.DELIVERED,
    ];

    const [
      totalOrders,
      eligibleOrders,
      totalProducts,
      lowStockProducts,
      recentOrders,
      categoriesCount,
      recentMessagesCount,
    ] = await Promise.all([
      // Total orders count
      this.prisma.order.count(),

      // Eligible orders for total revenue calculation
      this.prisma.order.findMany({
        where: {
          status: { in: eligibleStatuses },
        },
        select: {
          total: true,
          subtotal: true,
          status: true,
          createdAt: true,
        },
      }),

      // Total products count
      this.prisma.product.count(),

      // Low stock products (stock <= 10)
      this.prisma.product.findMany({
        where: {
          stock: { lte: 10 },
        },
        take: 8,
        include: {
          category: { select: { name: true } },
          images: { take: 1 },
        },
        orderBy: { stock: 'asc' },
      }),

      // Recent 6 orders
      this.prisma.order.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
        },
      }),

      // Categories count
      this.prisma.category.count(),

      // Unread messages
      this.prisma.contactMessage.count({ where: { isRead: false } }),
    ]);

    // Calculate total revenue
    const totalRevenue = eligibleOrders.reduce(
      (sum, order) => sum + Number(order.total),
      0,
    );

    // Calculate average order value (AOV)
    const averageOrderValue =
      eligibleOrders.length > 0 ? totalRevenue / eligibleOrders.length : 0;

    // Group sales by day for recent 7 days chart
    const last7DaysMap: { [dateStr: string]: { date: string; sales: number; count: number } } = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      last7DaysMap[dateKey] = { date: dateKey, sales: 0, count: 0 };
    }

    for (const order of eligibleOrders) {
      const dateKey = new Date(order.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      if (last7DaysMap[dateKey]) {
        last7DaysMap[dateKey].sales += Number(order.total);
        last7DaysMap[dateKey].count += 1;
      }
    }

    return {
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      totalOrders,
      totalProducts,
      lowStockCount: lowStockProducts.length,
      averageOrderValue: parseFloat(averageOrderValue.toFixed(2)),
      categoriesCount,
      unreadMessagesCount: recentMessagesCount,
      lowStockProducts,
      recentOrders,
      salesChart: Object.values(last7DaysMap),
      calculationRules: {
        revenueDefinition: 'Sum of order totals for statuses [CONFIRMED, PROCESSING, SHIPPED, DELIVERED]',
        excludedStatuses: ['PENDING', 'CANCELLED'],
        lowStockThreshold: 10,
      },
    };
  }
}
