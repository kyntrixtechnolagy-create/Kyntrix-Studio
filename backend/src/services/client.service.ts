import { ClientRepository } from '../repositories/client.repository';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/AppError';

export class ClientService {
  private clientRepository: ClientRepository;

  constructor() {
    this.clientRepository = new ClientRepository();
  }

  async createClient(data: Prisma.ClientCreateInput) {
    const existingClient = await this.clientRepository.findByEmail(data.email);
    if (existingClient) {
      throw new AppError('Client with this email already exists', 400);
    }
    return this.clientRepository.create(data);
  }

  async getClients(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    const { clients, total } = await this.clientRepository.findAll(skip, limit, search);

    return {
      data: clients,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getClientById(id: string) {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new AppError('Client not found', 404);
    }
    
    // Calculate pending payments
    let pendingPayment = 0;
    client.projects.forEach(project => {
      project.payments.forEach(payment => {
        if (payment.status !== 'PAID') {
          pendingPayment += (payment.amount - payment.advancePaid);
        }
      });
    });

    return {
      ...client,
      pendingPayment,
    };
  }

  async updateClient(id: string, data: Prisma.ClientUpdateInput) {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new AppError('Client not found', 404);
    }
    return this.clientRepository.update(id, data);
  }

  async deleteClient(id: string) {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new AppError('Client not found', 404);
    }
    return this.clientRepository.delete(id);
  }
}
