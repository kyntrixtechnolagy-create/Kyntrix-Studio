import { ProjectRepository } from '../repositories/project.repository';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/AppError';
import { prisma } from '../database/prisma';

export class ProjectService {
  private projectRepository: ProjectRepository;

  constructor() {
    this.projectRepository = new ProjectRepository();
  }

  async createProject(data: any) {
    const { clientId, payments, ...rest } = data;
    
    const createData: Prisma.ProjectCreateInput = {
      ...rest,
      client: { connect: { id: clientId } },
    };

    if (payments && Array.isArray(payments)) {
      createData.payments = {
        create: payments.map((p: any) => ({
          title: p.title || 'Project Payment',
          amount: p.amount,
          advancePaid: p.advancePaid,
          status: p.status,
        })),
      };
    }

    const project = await this.projectRepository.create(createData);

    if (payments && Array.isArray(payments) && payments.length > 0) {
      const p = payments[0];
      if (p.advancePaid && p.advancePaid > 0) {
        await prisma.transaction.create({
          data: {
            title: `Advance for ${project.name}`,
            amount: p.advancePaid,
            type: 'INCOME',
          }
        });
      }
    }

    return project;
  }

  async getProjects(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    const { projects, total } = await this.projectRepository.findAll(skip, limit, search);

    return {
      data: projects,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProjectById(id: string) {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new AppError('Project not found', 404);
    }
    return project;
  }

  async updateProject(id: string, data: any) {
    const { clientId, payments, ...rest } = data;
    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new AppError('Project not found', 404);
    }
    
    const updateData: Prisma.ProjectUpdateInput = { ...rest };
    if (clientId) {
      updateData.client = { connect: { id: clientId } };
    }

    if (payments && Array.isArray(payments) && payments.length > 0) {
      const pData = payments[0];
      if (project.payments && project.payments.length > 0) {
        updateData.payments = {
          update: {
            where: { id: project.payments[0]!.id },
            data: {
              amount: pData.amount,
              advancePaid: pData.advancePaid
            }
          }
        };
      } else {
        updateData.payments = {
          create: [{
            title: pData.title || 'Project Payment',
            amount: pData.amount,
            advancePaid: pData.advancePaid,
            status: pData.status || 'PENDING'
          }]
        };
      }
    }

    const updatedProject = await this.projectRepository.update(id, updateData);

    if (payments && Array.isArray(payments) && payments.length > 0) {
      const pData = payments[0];
      
      // If there's an advance payment and it was newly added or updated, we should record it.
      // A more robust system would check if it was already recorded, but for this simple ledger we'll record it.
      // To prevent duplicate transactions on every update, we will only record it if the advancePaid amount changed.
      const oldAdvance = project.payments && project.payments.length > 0 ? project.payments[0]!.advancePaid : 0;
      
      if (pData.advancePaid && pData.advancePaid > oldAdvance) {
        const diff = pData.advancePaid - oldAdvance;
        await prisma.transaction.create({
          data: {
            title: `Additional advance for ${project.name}`,
            amount: diff,
            type: 'INCOME',
          }
        });
      }
    }

    return updatedProject;
  }

  async deleteProject(id: string) {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new AppError('Project not found', 404);
    }
    return this.projectRepository.delete(id);
  }
}
