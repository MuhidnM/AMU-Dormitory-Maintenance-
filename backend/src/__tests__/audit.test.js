import { recordAuditLog } from '../services/auditService.js';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
  const mPrisma = {
    auditLog: {
      create: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});

const prisma = new PrismaClient();

describe('Audit Service', () => {
  it('should record an audit log successfully', async () => {
    const logData = {
      action: 'TEST_ACTION',
      entity: 'TestEntity',
      userId: 'user-123',
      details: { foo: 'bar' },
      ipAddress: '127.0.0.1',
    };

    prisma.auditLog.create.mockResolvedValue({ id: 'log-123', ...logData });

    await recordAuditLog(logData);

    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: {
        ...logData,
        details: JSON.stringify(logData.details),
      },
    });
  });

  it('should not throw error if prisma create fails', async () => {
    prisma.auditLog.create.mockRejectedValue(new Error('Prisma error'));
    
    // Should not throw
    await expect(recordAuditLog({})).resolves.not.toThrow();
  });
});
