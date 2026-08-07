import { IdeaRepository } from '../repositories/idea.repository';
import { Prisma } from '@prisma/client';
import { AppError } from '../middlewares/errorHandler';

const ideaRepository = new IdeaRepository();

export class IdeaService {
  async createIdea(data: any) {
    const { category, ...rest } = data;
    
    const createData: Prisma.IdeaCreateInput = {
      ...rest,
    };

    if (category && typeof category === 'string') {
      createData.category = {
        connectOrCreate: {
          where: { name: category },
          create: { name: category, type: 'IDEA' },
        }
      };
    }

    return ideaRepository.create(createData);
  }

  async getIdeas(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    const { ideas, total } = await ideaRepository.findAll(skip, limit, search);
    
    return {
      ideas,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getIdeaById(id: string) {
    const idea = await ideaRepository.findById(id);
    if (!idea) {
      throw new AppError('Idea not found', 404);
    }
    return idea;
  }

  async updateIdea(id: string, data: any) {
    await this.getIdeaById(id);
    const { category, ...rest } = data;
    
    const updateData: Prisma.IdeaUpdateInput = {
      ...rest,
    };

    if (category && typeof category === 'string') {
      updateData.category = {
        connectOrCreate: {
          where: { name: category },
          create: { name: category, type: 'IDEA' },
        }
      };
    } else if (category === null) {
      updateData.category = { disconnect: true };
    }

    return ideaRepository.update(id, updateData);
  }

  async deleteIdea(id: string) {
    await this.getIdeaById(id);
    return ideaRepository.delete(id);
  }
}
