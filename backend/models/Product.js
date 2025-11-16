const { prisma } = require('../config/prisma');

class Product {
  static async create(name, image, price, categoryId) {
    const product = await prisma.product.create({
      data: {
        name,
        image,
        price,
        categoryId: parseInt(categoryId),
      },
      include: {
        category: true,
      },
    });
    return {
      id: product.id,
      unique_id: product.uniqueId,
      name: product.name,
      image: product.image,
      price: product.price,
      category_id: product.categoryId,
      category_name: product.category.name,
      category_unique_id: product.category.uniqueId,
      created_at: product.createdAt,
      updated_at: product.updatedAt,
    };
  }

  static async findById(id) {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
      },
    });
    if (!product) return null;
    return {
      id: product.id,
      unique_id: product.uniqueId,
      name: product.name,
      image: product.image,
      price: product.price,
      category_id: product.categoryId,
      category_name: product.category.name,
      category_unique_id: product.category.uniqueId,
      created_at: product.createdAt,
      updated_at: product.updatedAt,
    };
  }

  static async findByUniqueId(uniqueId) {
    const product = await prisma.product.findUnique({
      where: { uniqueId },
      include: {
        category: true,
      },
    });
    if (!product) return null;
    return {
      id: product.id,
      unique_id: product.uniqueId,
      name: product.name,
      image: product.image,
      price: product.price,
      category_id: product.categoryId,
      category_name: product.category.name,
      category_unique_id: product.category.uniqueId,
      created_at: product.createdAt,
      updated_at: product.updatedAt,
    };
  }

  static async update(id, name, image, price, categoryId) {
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        image,
        price,
        categoryId: parseInt(categoryId),
        updatedAt: new Date(),
      },
      include: {
        category: true,
      },
    });
    return {
      id: product.id,
      unique_id: product.uniqueId,
      name: product.name,
      image: product.image,
      price: product.price,
      category_id: product.categoryId,
      category_name: product.category.name,
      category_unique_id: product.category.uniqueId,
      created_at: product.createdAt,
      updated_at: product.updatedAt,
    };
  }

  static async delete(id) {
    const product = await prisma.product.delete({
      where: { id: parseInt(id) },
    });
    return {
      id: product.id,
      unique_id: product.uniqueId,
      name: product.name,
    };
  }

  static async getAll(options = {}) {
    const {
      limit = 10,
      offset = 0,
      search = '',
      categoryId = null,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = options;

    // Build where clause
    const where = {};
    
    if (search || categoryId) {
      const conditions = [];
      
      if (search) {
        conditions.push({
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { category: { name: { contains: search, mode: 'insensitive' } } },
          ],
        });
      }
      
      if (categoryId) {
        conditions.push({ categoryId: parseInt(categoryId) });
      }
      
      Object.assign(where, conditions.length > 1 ? { AND: conditions } : conditions[0]);
    }

    // Validate and map sort field
    const sortFieldMap = {
      'name': 'name',
      'price': 'price',
      'created_at': 'createdAt',
    };
    const sortField = sortFieldMap[sortBy] || 'createdAt';
    const order = sortOrder.toUpperCase() === 'ASC' ? 'asc' : 'desc';

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: { [sortField]: order },
        take: limit || undefined,
        skip: offset,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products: products.map(p => ({
        id: p.id,
        unique_id: p.uniqueId,
        name: p.name,
        image: p.image,
        price: p.price,
        category_id: p.categoryId,
        category_name: p.category.name,
        category_unique_id: p.category.uniqueId,
        created_at: p.createdAt,
        updated_at: p.updatedAt,
      })),
      total,
      limit: limit || null,
      offset,
    };
  }

  static async bulkCreate(products) {
    const insertedProducts = await prisma.$transaction(
      products.map(product =>
        prisma.product.create({
          data: {
            name: product.name,
            image: product.image || null,
            price: product.price,
            categoryId: parseInt(product.category_id),
          },
          include: {
            category: true,
          },
        })
      )
    );

    return insertedProducts.map(p => ({
      id: p.id,
      unique_id: p.uniqueId,
      name: p.name,
      image: p.image,
      price: p.price,
      category_id: p.categoryId,
      category_name: p.category.name,
      category_unique_id: p.category.uniqueId,
      created_at: p.createdAt,
      updated_at: p.updatedAt,
    }));
  }
}

module.exports = Product;


