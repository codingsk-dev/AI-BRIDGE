import { userRepository } from './repositories/user.repository';
import { authRepository } from '../auth/repositories/auth.repository';
import { logger } from '../../utils/logger';
import { UserEvent } from './events/user.event';
import { userListener } from './listeners/user.listener';
import bcrypt from 'bcryptjs';

// User service
export class UserService {
  async getUserById(...args: any[]) { return null as any; }
  async getUsers(...args: any[]) { return null as any; }
  async updateUser(...args: any[]) { return null as any; }
  async deleteUser(...args: any[]) { return null as any; }
  async verifyUser(...args: any[]) { return null as any; }
  async updatePassword(...args: any[]) { return null as any; }
  async getUserCount(...args: any[]) { return null as any; }

  private readonly SALT_ROUNDS = 12;

  // Hash password
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
    return bcrypt.hash(password, salt);
  }

  // Verify password
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Get user by ID
  async getUserById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  // Get user by email
  async getUserByEmail(email: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  // Get users with pagination and filters
  async getUsers(
    skip = 0,
    take = 10,
    filters: {
      role?: string;
      isVerified?: boolean;
      searchTerm?: string;
    } = {}
  ) {
    return userRepository.findMany(skip, take, filters);
  }

  // Update user
  async updateUser(id: string, data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
  }) {
    // Check if user exists
    const existing = await userRepository.findById(id);
    if (!existing) {
      throw new Error('User not found');
    }

    // If email is being updated, check if it's already taken
    if (data.email && data.email !== existing.email) {
      const emailExists = await userRepository.findByEmail(data.email);
      if (emailExists) {
        throw new Error('Email already in use');
      }
    }

    // Hash password if provided
    let passwordHash: string | undefined;
    if (data.password) {
      passwordHash = await this.hashPassword(data.password);
    }

    // Update user
    const user = await userRepository.updateUser(id, {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: data.role,
      passwordHash
    });

    // Emit user updated event
    const userUpdatedEvent = new UserEvent.UserUpdatedEvent(
      user.id,
      {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role
      }
    );

    // TODO: Emit event to event bus
    // For now, handle synchronously
    await userListener.onUserUpdated(userUpdatedEvent);

    return user;
  }

  // Delete user (soft delete)
  async deleteUser(id: string) {
    // Check if user exists
    const existing = await userRepository.findById(id);
    if (!existing) {
      throw new Error('User not found');
    }

    // Soft delete user
    const user = await userRepository.deleteUser(id);

    // Emit user deleted event
    const userDeletedEvent = new UserEvent.UserDeletedEvent(
      user.id
    );

    // TODO: Emit event to event bus
    // For now, handle synchronously
    await userListener.onUserDeleted(userDeletedEvent);

    return user;
  }

  // Verify user
  async verifyUser(id: string) {
    // Check if user exists
    const existing = await userRepository.findById(id);
    if (!existing) {
      throw new Error('User not found');
    }

    // Verify user
    const user = await userRepository.verifyUser(id);

    // Emit user verified event
    const userVerifiedEvent = new UserEvent.UserVerifiedEvent(
      user.id,
      user.email
    );

    // TODO: Emit event to event bus
    // For now, handle synchronously
    await userListener.onUserVerified(userVerifiedEvent);

    return user;
  }

  // Update user password
  async updatePassword(id: string, password: string) {
    // Check if user exists
    const existing = await userRepository.findById(id);
    if (!existing) {
      throw new Error('User not found');
    }

    // Hash password
    const passwordHash = await this.hashPassword(password);

    // Update password
    const user = await userRepository.updatePassword(id, passwordHash);

    // Emit password updated event
    const passwordUpdatedEvent = new UserEvent.PasswordUpdatedEvent(
      user.id
    );

    // TODO: Emit event to event bus
    // For now, handle synchronously
    await userListener.onPasswordUpdated(passwordUpdatedEvent);

    return user;
  }

  // Set reset token
  async setResetToken(id: string, token: string, expiry: Date) {
    // Check if user exists
    const existing = await userRepository.findById(id);
    if (!existing) {
      throw new Error('User not found');
    }

    // Set reset token
    const user = await userRepository.setResetToken(id, token, expiry);

    return user;
  }

  // Find user by reset token
  async findByResetToken(token: string) {
    const user = await userRepository.findByResetToken(token);
    if (!user) {
      throw new Error('Invalid or expired reset token');
    }
    return user;
  }

  // Clear reset token
  async clearResetToken(id: string) {
    // Check if user exists
    const existing = await userRepository.findById(id);
    if (!existing) {
      throw new Error('User not found');
    }

    // Clear reset token
    const user = await userRepository.clearResetToken(id);

    return user;
  }

  // Get user count
  async getUserCount() {
    return userRepository.findMany(0, 1000).then(result => result.total);
  }
}

// Export singleton instance
export const userService = new UserService();