import { Request, Response } from 'express';
import { ClientService } from '../services/client.service';

const clientService = new ClientService();

export class ClientController {
  async createClient(req: Request, res: Response) {
    const client = await clientService.createClient(req.body);
    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: client,
    });
  }

  async getClients(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;

    const result = await clientService.getClients(page, limit, search);
    res.status(200).json({
      success: true,
      message: 'Clients retrieved successfully',
      data: result,
    });
  }

  async getClientById(req: Request, res: Response) {
    const client = await clientService.getClientById(req.params.id as string);
    res.status(200).json({
      success: true,
      message: 'Client retrieved successfully',
      data: client,
    });
  }

  async updateClient(req: Request, res: Response) {
    const client = await clientService.updateClient(req.params.id as string, req.body);
    res.status(200).json({
      success: true,
      message: 'Client updated successfully',
      data: client,
    });
  }

  async deleteClient(req: Request, res: Response) {
    await clientService.deleteClient(req.params.id as string);
    res.status(200).json({
      success: true,
      message: 'Client deleted successfully',
      data: null,
    });
  }
}
