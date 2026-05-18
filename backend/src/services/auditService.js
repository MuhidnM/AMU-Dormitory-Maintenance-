import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const recordAuditLog = async ({ action, entity, entityId, userId, details, ipAddress }) => {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        entity,
        entityId,
        userId,
        details: typeof details === 'object' ? JSON.stringify(details) : details,
        ipAddress,
      },
    });
  } catch (error) {
    // We don't want audit logging failure to crash the request, but we should log it
    console.error('Failed to record audit log:', error);
  }
};
