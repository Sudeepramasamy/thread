import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductQueryDto } from './dto/product-query.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }

  async findAll(query: ProductQueryDto) {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      size,
      color,
      sortBy = 'featured',
      page = 1,
      limit = 12,
      isActive,
    } = query;

    const pageNum = Math.max(1, Number(page) || 1);
    const take = Math.max(1, Number(limit) || 12);
    const skip = (pageNum - 1) * take;

    const where: Prisma.ProductWhereInput = {};

    // Active status filter (if isActive is strictly provided, else default to true if not admin context)
    if (isActive !== undefined && isActive !== null && isActive !== '') {
      where.isActive = isActive === true || isActive === 'true';
    }

    // Category filter by ID or slug
    if (category && category !== 'all') {
      where.category = {
        OR: [{ id: category }, { slug: category }],
      };
    }

    // Full text search
    if (search && search.trim() !== '') {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = new Prisma.Decimal(minPrice);
      }
      if (maxPrice !== undefined) {
        where.price.lte = new Prisma.Decimal(maxPrice);
      }
    }

    // Variant filters (size or color)
    if (size || color) {
      where.variants = {
        some: {
          ...(size ? { size: { equals: size, mode: 'insensitive' } } : {}),
          ...(color ? { color: { contains: color, mode: 'insensitive' } } : {}),
        },
      };
    }

    // Sorting
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    if (sortBy === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sortBy === 'price_desc') {
      orderBy = { price: 'desc' };
    } else if (sortBy === 'newest') {
      orderBy = { createdAt: 'desc' };
    } else if (sortBy === 'featured') {
      orderBy = { isFeatured: 'desc' };
    }

    const [total, items] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          images: {
            orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }],
          },
          variants: true,
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

  async findFeatured(limit = 8) {
    return this.prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }] },
        variants: true,
      },
    });
  }

  async findNewArrivals(limit = 8) {
    return this.prisma.product.findMany({
      where: { isActive: true },
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }] },
        variants: true,
      },
    });
  }

  async findOne(idOrSlug: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        category: true,
        images: {
          orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }],
        },
        variants: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product '${idOrSlug}' was not found`);
    }

    // Fetch up to 4 related products from the same category
    const related = await this.prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isActive: true,
      },
      take: 4,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }] },
        variants: true,
      },
    });

    return {
      ...product,
      related,
    };
  }

  async create(createProductDto: CreateProductDto) {
    const slug = createProductDto.slug || this.slugify(createProductDto.name);

    const existing = await this.prisma.product.findUnique({
      where: { slug },
    });
    if (existing) {
      throw new BadRequestException(`A product with slug '${slug}' already exists`);
    }

    // Ensure category exists
    const category = await this.prisma.category.findUnique({
      where: { id: createProductDto.categoryId },
    });
    if (!category) {
      throw new BadRequestException(`Category with ID '${createProductDto.categoryId}' does not exist`);
    }

    const { images, variants, ...productData } = createProductDto;

    return this.prisma.product.create({
      data: {
        ...productData,
        slug,
        images: images && images.length > 0
          ? {
              create: images.map((img, idx) => ({
                url: img.url,
                altText: img.altText || productData.name,
                isPrimary: img.isPrimary ?? idx === 0,
                displayOrder: img.displayOrder ?? idx,
              })),
            }
          : undefined,
        variants: variants && variants.length > 0
          ? {
              create: variants.map((v) => ({
                size: v.size,
                color: v.color,
                colorCode: v.colorCode,
                sku: v.sku,
                stock: v.stock,
                additionalPrice: v.additionalPrice ?? 0,
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        images: true,
        variants: true,
      },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }

    if (updateProductDto.slug && updateProductDto.slug !== product.slug) {
      const duplicateSlug = await this.prisma.product.findUnique({
        where: { slug: updateProductDto.slug },
      });
      if (duplicateSlug) {
        throw new BadRequestException(`Product slug '${updateProductDto.slug}' already exists`);
      }
    }

    const { images, variants, ...productData } = updateProductDto;

    return this.prisma.$transaction(async (tx) => {
      // If new images provided, optionally replace them
      if (images) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        await tx.productImage.createMany({
          data: images.map((img, idx) => ({
            productId: id,
            url: img.url,
            altText: img.altText,
            isPrimary: img.isPrimary ?? idx === 0,
            displayOrder: img.displayOrder ?? idx,
          })),
        });
      }

      // If new variants provided, optionally replace them
      if (variants) {
        await tx.productVariant.deleteMany({ where: { productId: id } });
        await tx.productVariant.createMany({
          data: variants.map((v) => ({
            productId: id,
            size: v.size,
            color: v.color,
            colorCode: v.colorCode,
            sku: v.sku,
            stock: v.stock,
            additionalPrice: v.additionalPrice ?? 0,
          })),
        });
      }

      return tx.product.update({
        where: { id },
        data: productData,
        include: {
          category: true,
          images: true,
          variants: true,
        },
      });
    });
  }

  async remove(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }

    return this.prisma.product.delete({
      where: { id },
    });
  }
}
