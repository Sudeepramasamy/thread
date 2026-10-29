import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { TrackOrderDto } from './dto/track-order.dto';
import { OrderStatus, PaymentStatus, Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  private generateOrderNumber(): string {
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    return `TC-${year}-${randomSuffix}`;
  }

  async create(createOrderDto: CreateOrderDto) {
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      shippingCity,
      shippingPostalCode,
      shippingCountry = 'United States',
      notes,
      idempotencyKey,
      items,
    } = createOrderDto;

    if (!items || items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    // 1. Idempotency check: if an order with this idempotency key already exists, return it
    if (idempotencyKey) {
      const existingOrder = await this.prisma.order.findUnique({
        where: { idempotencyKey },
        include: {
          items: true,
        },
      });
      if (existingOrder) {
        return existingOrder;
      }
    }

    // 2. Perform order creation and inventory deduction inside an atomic database transaction
    return this.prisma.$transaction(
      async (tx) => {
        let calculatedSubtotal = 0;
        const preparedItems: {
          productId: string;
          variantId?: string | null;
          productName: string;
          variantDetails?: string | null;
          unitPrice: number;
          quantity: number;
          subtotal: number;
        }[] = [];

        for (const item of items) {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
            include: { variants: true },
          });

          if (!product) {
            throw new NotFoundException(`Product with ID '${item.productId}' was not found`);
          }

          if (!product.isActive) {
            throw new BadRequestException(`Product '${product.name}' is no longer available`);
          }

          let effectivePrice = Number(product.discountPrice ?? product.price);
          let variantDetails = 'Standard';

          if (item.variantId) {
            const variant = product.variants.find((v) => v.id === item.variantId);
            if (!variant) {
              throw new BadRequestException(
                `Variant not found for product '${product.name}'`,
              );
            }

            if (variant.stock < item.quantity) {
              throw new ConflictException(
                `Insufficient inventory for '${product.name}' (${variant.size} / ${variant.color}). Available stock: ${variant.stock}`,
              );
            }

            variantDetails = `Size: ${variant.size}, Color: ${variant.color}`;
            if (Number(variant.additionalPrice) > 0) {
              effectivePrice += Number(variant.additionalPrice);
            }

            // Atomically decrement variant stock
            await tx.productVariant.update({
              where: { id: variant.id },
              data: { stock: { decrement: item.quantity } },
            });
          }

          // Check and decrement overall product stock
          if (product.stock < item.quantity) {
            throw new ConflictException(
              `Insufficient stock for '${product.name}'. Available: ${product.stock}`,
            );
          }

          await tx.product.update({
            where: { id: product.id },
            data: { stock: { decrement: item.quantity } },
          });

          const lineSubtotal = effectivePrice * item.quantity;
          calculatedSubtotal += lineSubtotal;

          preparedItems.push({
            productId: product.id,
            variantId: item.variantId || null,
            productName: product.name,
            variantDetails,
            unitPrice: effectivePrice,
            quantity: item.quantity,
            subtotal: lineSubtotal,
          });
        }

        // Complimentary shipping on orders above $300, else standard $15
        const shippingFee = calculatedSubtotal >= 300 ? 0.0 : 15.0;
        const tax = parseFloat((calculatedSubtotal * 0.08).toFixed(2));
        const total = parseFloat((calculatedSubtotal + shippingFee + tax).toFixed(2));

        const orderNumber = this.generateOrderNumber();

        const createdOrder = await tx.order.create({
          data: {
            orderNumber,
            customerName,
            customerEmail: customerEmail.toLowerCase().trim(),
            customerPhone,
            shippingAddress,
            shippingCity,
            shippingPostalCode,
            shippingCountry,
            notes,
            idempotencyKey,
            status: OrderStatus.CONFIRMED,
            paymentStatus: PaymentStatus.DEMO_PAID,
            subtotal: new Prisma.Decimal(calculatedSubtotal),
            shippingFee: new Prisma.Decimal(shippingFee),
            tax: new Prisma.Decimal(tax),
            total: new Prisma.Decimal(total),
            items: {
              create: preparedItems.map((pi) => ({
                productId: pi.productId,
                variantId: pi.variantId,
                productName: pi.productName,
                variantDetails: pi.variantDetails,
                unitPrice: new Prisma.Decimal(pi.unitPrice),
                quantity: pi.quantity,
                subtotal: new Prisma.Decimal(pi.subtotal),
              })),
            },
          },
          include: {
            items: true,
          },
        });

        return createdOrder;
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
  }

  async trackOrder(trackOrderDto: TrackOrderDto) {
    const order = await this.prisma.order.findFirst({
      where: {
        orderNumber: trackOrderDto.orderNumber.trim(),
        customerEmail: {
          equals: trackOrderDto.email.trim(),
          mode: 'insensitive',
        },
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException('No matching order found with the provided details');
    }

    return order;
  }

  async findAll(status?: OrderStatus, page: number = 1, limit: number = 20) {
    const pageNum = Math.max(1, Number(page) || 1);
    const take = Math.max(1, Number(limit) || 20);
    const skip = (pageNum - 1) * take;

    const where: Prisma.OrderWhereInput = {};
    if (status) {
      where.status = status;
    }

    const [total, items] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: {
          items: true,
        },
      }),
    ]);

    return {
      items,
      total,
      page: pageNum,
      limit: take,
      totalPages: Math.ceil(total / take) || 1,
    };
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              include: { images: true },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID '${id}' was not found`);
    }

    return order;
  }

  async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID '${id}' was not found`);
    }

    const currentStatus = order.status;
    const nextStatus = updateOrderStatusDto.status;

    if (currentStatus === nextStatus) {
      return order;
    }

    // Check invalid transitions
    if (currentStatus === OrderStatus.CANCELLED) {
      throw new BadRequestException('Cannot modify status of a cancelled order');
    }

    if (currentStatus === OrderStatus.DELIVERED && nextStatus === OrderStatus.CANCELLED) {
      throw new BadRequestException('Cannot cancel an order that has already been delivered');
    }

    // If transitioning to CANCELLED, restore inventory in a transaction
    if (nextStatus === OrderStatus.CANCELLED) {
      return this.prisma.$transaction(async (tx) => {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });

          if (item.variantId) {
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: { stock: { increment: item.quantity } },
            });
          }
        }

        return tx.order.update({
          where: { id },
          data: {
            status: OrderStatus.CANCELLED,
            paymentStatus: PaymentStatus.REFUNDED,
          },
          include: { items: true },
        });
      });
    }

    // Standard valid status update
    return this.prisma.order.update({
      where: { id },
      data: { status: nextStatus },
      include: { items: true },
    });
  }
}
