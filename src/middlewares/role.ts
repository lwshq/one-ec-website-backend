import { Request, Response, NextFunction } from 'express';
import AppResponse from '../utils/AppResponse';
import prisma from '../utils/client';

export const aggregatePermissionsAndModules = (coordinatorRoles: any[]) => {
  const allPermissions = new Set<string>();
  const allModules = new Set<string>();

  coordinatorRoles.forEach(role => {
    role.role.permissions.forEach((permission: string) => allPermissions.add(permission));
    role.role.modules.forEach((module: string) => allModules.add(module));
  });

  return {
    permissions: Array.from(allPermissions),
    modules: Array.from(allModules),
  };
};

const CheckAccess = (requiredPermissions: string[], requiredModules: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const coordinatorId = req.coorData.id;

    const coordinator = await prisma.coopCoordinator.findUnique({
      where: { id: coordinatorId, deleted_at: null },
    });

    if (!coordinator) {
      return AppResponse.sendError({
        res: res,
        data: null,
        message: "Coordinator not found",
        code: 404
      });
    }

    if (coordinator.role === 'COOPSUPERADMIN') {
      return next();
    }

    const coordinatorRoles = await prisma.coordinatorRole.findMany({
      where: { coordinatorId, deletedAt: null },
      include: { role: true },
    });

    const { permissions, modules } = aggregatePermissionsAndModules(coordinatorRoles);

    const hasRequiredPermissions = requiredPermissions.every(permission => permissions.includes(permission));
    const hasRequiredModules = requiredModules.every(module => modules.includes(module));

    if (hasRequiredPermissions && hasRequiredModules) {
      next();
    } else {
      return AppResponse.sendError({
        res: res,
        data: null,
        message: "Unauthorized Access",
        code: 403
      });
    }
  };
};

export default CheckAccess;
