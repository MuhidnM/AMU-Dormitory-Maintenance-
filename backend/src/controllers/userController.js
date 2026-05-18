import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';

export const getUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    const where = role ? { role } : {};
    
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        dormInfo: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, dormInfo } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        dormInfo,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    });

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, role, dormInfo, password } = req.body;

    const data = { name, email, role, dormInfo };
    
    if (password) {
      data.password = await bcrypt.hash(password, 12);
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        dormInfo: true
      }
    });

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (id === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete yourself' });
    }

    await prisma.user.delete({ where: { id } });
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};
