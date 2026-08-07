const fs = require('fs');
const path = require('path');

const models = ['Calendar', 'Idea', 'Document'];
const baseDir = path.join(__dirname, 'src');

models.forEach(m => {
  const name = m.toLowerCase();
  const Name = m;
  const PrismaModel = m === 'Calendar' ? 'CalendarEvent' : m;

  // Repository
  fs.writeFileSync(path.join(baseDir, 'repositories', `${name}.repository.ts`), `import { prisma } from '../database/prisma';
import { Prisma } from '@prisma/client';

export class ${Name}Repository {
  async create(data: Prisma.${PrismaModel}CreateInput) {
    return prisma.${PrismaModel.charAt(0).toLowerCase() + PrismaModel.slice(1)}.create({ data });
  }

  async findAll(skip?: number, take?: number, search?: string) {
    const where: any = search
      ? {
          OR: [
            { ${m === 'Document' ? 'name' : 'title'}: { contains: search } },
          ],
        }
      : {};

    const [${name}s, total] = await Promise.all([
      prisma.${PrismaModel.charAt(0).toLowerCase() + PrismaModel.slice(1)}.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.${PrismaModel.charAt(0).toLowerCase() + PrismaModel.slice(1)}.count({ where }),
    ]);

    return { ${name}s, total };
  }

  async findById(id: string) {
    return prisma.${PrismaModel.charAt(0).toLowerCase() + PrismaModel.slice(1)}.findUnique({
      where: { id }
    });
  }

  async update(id: string, data: Prisma.${PrismaModel}UpdateInput) {
    return prisma.${PrismaModel.charAt(0).toLowerCase() + PrismaModel.slice(1)}.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.${PrismaModel.charAt(0).toLowerCase() + PrismaModel.slice(1)}.delete({
      where: { id },
    });
  }
}
`);

  // Service
  fs.writeFileSync(path.join(baseDir, 'services', `${name}.service.ts`), `import { ${Name}Repository } from '../repositories/${name}.repository';
import { Prisma } from '@prisma/client';
import { AppError } from '../middlewares/errorHandler';

const ${name}Repository = new ${Name}Repository();

export class ${Name}Service {
  async create${Name}(data: Prisma.${PrismaModel}CreateInput) {
    return ${name}Repository.create(data);
  }

  async get${Name}s(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    const { ${name}s, total } = await ${name}Repository.findAll(skip, limit, search);
    
    return {
      ${name}s,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async get${Name}ById(id: string) {
    const ${name} = await ${name}Repository.findById(id);
    if (!${name}) {
      throw new AppError('${Name} not found', 404);
    }
    return ${name};
  }

  async update${Name}(id: string, data: Prisma.${PrismaModel}UpdateInput) {
    await this.get${Name}ById(id);
    return ${name}Repository.update(id, data);
  }

  async delete${Name}(id: string) {
    await this.get${Name}ById(id);
    return ${name}Repository.delete(id);
  }
}
`);

  // Controller
  fs.writeFileSync(path.join(baseDir, 'controllers', `${name}.controller.ts`), `import { Request, Response } from 'express';
import { ${Name}Service } from '../services/${name}.service';

const ${name}Service = new ${Name}Service();

export class ${Name}Controller {
  async create${Name}(req: Request, res: Response) {
    const ${name} = await ${name}Service.create${Name}(req.body);
    res.status(201).json({
      success: true,
      message: '${Name} created successfully',
      data: ${name},
    });
  }

  async get${Name}s(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;

    const result = await ${name}Service.get${Name}s(page, limit, search);
    res.status(200).json({
      success: true,
      message: '${Name}s retrieved successfully',
      data: result,
    });
  }

  async get${Name}ById(req: Request, res: Response) {
    const ${name} = await ${name}Service.get${Name}ById(req.params.id as string);
    res.status(200).json({
      success: true,
      message: '${Name} retrieved successfully',
      data: ${name},
    });
  }

  async update${Name}(req: Request, res: Response) {
    const ${name} = await ${name}Service.update${Name}(req.params.id as string, req.body);
    res.status(200).json({
      success: true,
      message: '${Name} updated successfully',
      data: ${name},
    });
  }

  async delete${Name}(req: Request, res: Response) {
    await ${name}Service.delete${Name}(req.params.id as string);
    res.status(200).json({
      success: true,
      message: '${Name} deleted successfully',
      data: null,
    });
  }
}
`);

  // Routes
  fs.writeFileSync(path.join(baseDir, 'routes', `${name}.routes.ts`), `import { Router } from 'express';
import { ${Name}Controller } from '../controllers/${name}.controller';
import { catchAsync } from '../utils/catchAsync';

const router = Router();
const ${name}Controller = new ${Name}Controller();

router.post('/', catchAsync(${name}Controller.create${Name}.bind(${name}Controller)));
router.get('/', catchAsync(${name}Controller.get${Name}s.bind(${name}Controller)));
router.get('/:id', catchAsync(${name}Controller.get${Name}ById.bind(${name}Controller)));
router.put('/:id', catchAsync(${name}Controller.update${Name}.bind(${name}Controller)));
router.delete('/:id', catchAsync(${name}Controller.delete${Name}.bind(${name}Controller)));

export default router;
`);
});
console.log('Generated all files successfully.');
