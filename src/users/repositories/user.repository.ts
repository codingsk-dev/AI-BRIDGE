import { prisma } from '../../lib/prisma';
import { User } from '@prisma/client';

// User repository
export class UserRepository {
  async findByEmail(...args: any[]) { return null as any; }
  async findMany(...args: any[]) { return null as any; }
  async updateUser(...args: any[]) { return null as any; }
  async deleteUser(...args: any[]) { return null as any; }
  async verifyUser(...args: any[]) { return null as any; }
  async updatePassword(...args: any[]) { return null as any; }
  async setResetToken(...args: any[]) { return null as any; }
  async findByResetToken(...args: any[]) { return null as any; }
  async clearResetToken(...args: any[]) { return null as any; }

  // Find user by ID
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id }
    });
  }

  // Find user by email
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email }
    });
  }

  // Find users with pagination and filters
  async findMany(
    skip = 0,
    take = 10,
    filters: {
      role?: string;
      isVerified?: boolean;
      searchTerm?: string;
    } = {}
  ): Promise<{ users: User[]; total: number }> {
    const where: any = {};

    if (filters.role) {
      where.role = filters.role;
    }

    if (filters.isVerified !== undefined) {
      where.isVerified = filters.isVerified;
    }

    if (filters.searchTerm) {
      where.OR = [
        { firstName: { contains: filters.searchTerm, mode: 'insensitive' } },
        { lastName: { contains: filters.searchTerm, mode: 'insensitive' } },
        { email: { contains: filters.searchTerm, mode: 'insensitive' } }
      ];
    }

    // Exclude soft deleted users
    where.deletedAt = null;

    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    return { users, total };
  }

  // Update user
  async updateUser(id: string, data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>): Promise<User> {
    return prisma.user.update({
      where: { id },
      data
    });
  }

  // Delete user (soft delete)
  async deleteUser(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: {  }
    });
  }

  // Verify user
  async verifyUser(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null
      }
    });
  }

  // Update user password
  async updatePassword(id: string, passwordHash: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { passwordHash }
    });
  }

  // Set reset token
  async setResetToken(
    id: string,
    token: string,
    expiry: Date
  ): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: {
        resetToken: token,
        resetTokenExpiry: expiry
      }
    });
  }

  // Find user by reset token
  async findByResetToken(token: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date()
        }
      }
    });
  }

  // Clear reset token
  async clearResetToken(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: {
        resetToken: null,
        resetTokenExpiry: null
      }
    });
  }
}

// Export singleton instance
export const userRepository = new UserRepository();