import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID or slug '${id}' not found`);
    }

    return category;
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const slug = createCategoryDto.slug || this.slugify(createCategoryDto.name);

    const existingSlug = await this.prisma.category.findUnique({
      where: { slug },
    });
    if (existingSlug) {
      throw new BadRequestException(`Category slug '${slug}' is already in use`);
    }

    const existingName = await this.prisma.category.findUnique({
      where: { name: createCategoryDto.name },
    });
    if (existingName) {
      throw new BadRequestException(`Category name '${createCategoryDto.name}' already exists`);
    }

    return this.prisma.category.create({
      data: {
        ...createCategoryDto,
        slug,
      },
    });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);

    if (updateCategoryDto.slug) {
      const duplicateSlug = await this.prisma.category.findFirst({
        where: {
          slug: updateCategoryDto.slug,
          NOT: { id },
        },
      });
      if (duplicateSlug) {
        throw new BadRequestException(`Category slug '${updateCategoryDto.slug}' already exists`);
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async remove(id: string) {
    const category = await this.findOne(id);

    // Safety check: Prevent deletion if products exist
    const productCount = await this.prisma.product.count({
      where: { categoryId: category.id },
    });

    if (productCount > 0) {
      throw new BadRequestException(
        `Cannot delete category '${category.name}' because it contains ${productCount} active products. Reassign or delete the products first.`,
      );
    }

    return this.prisma.category.delete({
      where: { id: category.id },
    });
  }
}
