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

  async findById(id: string) { return null; }
  async findByUserId(id: string) { return null; }
  async create(data: any) { return data; }
}
export const userRepository = new UserRepository();
