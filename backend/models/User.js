const { prisma } = require('../config/prisma');
const bcrypt = require('bcryptjs');

class User {
  static async create(email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });
    return {
      id: user.id,
      email: user.email,
      created_at: user.createdAt,
    };
  }

  static async findByEmail(email) {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      password: user.password,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };
  }

  static async findById(id) {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };
  }

  static async update(id, email, password = null) {
    const updateData = {
      email,
      updatedAt: new Date(),
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        email: true,
        updatedAt: true,
      },
    });

    return {
      id: user.id,
      email: user.email,
      updated_at: user.updatedAt,
    };
  }

  static async delete(id) {
    const user = await prisma.user.delete({
      where: { id: parseInt(id) },
      select: { id: true },
    });
    return user;
  }

  static async getAll(limit = 10, offset = 0) {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.user.count(),
    ]);

    return {
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
      })),
      total,
      limit,
      offset,
    };
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;


