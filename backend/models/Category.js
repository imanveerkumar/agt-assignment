const { prisma } = require('../config/prisma');

class Category {
  static async create(name) {
    const category = await prisma.category.create({
      data: { name },
    });
    return {
      id: category.id,
      unique_id: category.uniqueId,
      name: category.name,
      created_at: category.createdAt,
      updated_at: category.updatedAt,
    };
  }

  static async findById(id) {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });
    if (!category) return null;
    return {
      id: category.id,
      unique_id: category.uniqueId,
      name: category.name,
      created_at: category.createdAt,
      updated_at: category.updatedAt,
    };
  }

  static async findByUniqueId(uniqueId) {
    const category = await prisma.category.findUnique({
      where: { uniqueId },
    });
    if (!category) return null;
    return {
      id: category.id,
      unique_id: category.uniqueId,
      name: category.name,
      created_at: category.createdAt,
      updated_at: category.updatedAt,
    };
  }

  static async update(id, name) {
    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        name,
        updatedAt: new Date(),
      },
    });
    return {
      id: category.id,
      unique_id: category.uniqueId,
      name: category.name,
      created_at: category.createdAt,
      updated_at: category.updatedAt,
    };
  }

  static async delete(id) {
    const category = await prisma.category.delete({
      where: { id: parseInt(id) },
    });
    return {
      id: category.id,
      unique_id: category.uniqueId,
      name: category.name,
    };
  }

  static async getAll(limit = 10, offset = 0, search = '') {
    const where = search
      ? {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        }
      : {};

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit || undefined,
        skip: offset,
      }),
      prisma.category.count({ where }),
    ]);

    return {
      categories: categories.map(cat => ({
        id: cat.id,
        unique_id: cat.uniqueId,
        name: cat.name,
        created_at: cat.createdAt,
        updated_at: cat.updatedAt,
      })),
      total,
      limit: limit || null,
      offset,
    };
  }
}

module.exports = Category;



