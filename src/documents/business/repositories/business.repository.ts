export class BusinessRepository {
  async findById(id: string) { return null; }
  async findByUserId(id: string) { return null; }
  async create(data: any) { return data; }
}
export const businessRepository = new BusinessRepository();
