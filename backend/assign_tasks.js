import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function assignTasks() {
  try {
    const staff = await prisma.user.findUnique({
      where: { email: 'staff1@amu.edu' }
    });

    if (!staff) {
      console.log("Staff not found");
      return;
    }

    // Find pending requests
    const requests = await prisma.maintenanceRequest.findMany({
      where: { staffId: null },
      take: 2
    });

    for (const req of requests) {
      await prisma.maintenanceRequest.update({
        where: { id: req.id },
        data: {
          staffId: staff.id,
          status: 'ASSIGNED'
        }
      });
      console.log(`Assigned request ${req.title} to ${staff.name}`);
    }

    console.log("Done assigning tasks.");
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

assignTasks();
