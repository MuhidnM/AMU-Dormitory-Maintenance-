import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@amu.edu' },
    update: {},
    create: {
      email: 'admin@amu.edu',
      name: 'System Administrator',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // Create Staff
  const staff1 = await prisma.user.upsert({
    where: { email: 'staff1@amu.edu' },
    update: {},
    create: {
      email: 'staff1@amu.edu',
      name: 'John Maintenance',
      password: hashedPassword,
      role: 'STAFF',
    },
  });

  // Create Student
  const student = await prisma.user.upsert({
    where: { email: 'student@amu.edu' },
    update: {},
    create: {
      email: 'student@amu.edu',
      name: 'Jane Student',
      password: hashedPassword,
      role: 'STUDENT',
      dormInfo: 'Block A, Room 101',
    },
  });

  // Create Sample Requests
  await prisma.maintenanceRequest.createMany({
    data: [
      {
        title: 'Broken Light in Room 101',
        description: 'The main light is flickering and eventually goes off.',
        category: 'ELECTRICAL',
        priority: 'MEDIUM',
        status: 'PENDING',
        studentId: student.id,
        dormInfo: 'Block A, Room 101',
      },
      {
        title: 'Water Leak in Bathroom',
        description: 'Taps are leaking continuously even when closed tightly.',
        category: 'PLUMBING',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        studentId: student.id,
        dormInfo: 'Block A, Room 101',
      },
      {
        title: 'Window Lock Broken',
        description: 'The window in the common room doesn\'t lock properly.',
        category: 'CARPENTRY',
        priority: 'LOW',
        status: 'RESOLVED',
        studentId: student.id,
        dormInfo: 'Block A, Room 101',
      },
      {
        title: 'Internet Socket Loose',
        description: 'The ethernet port on the wall is loose.',
        category: 'OTHER',
        priority: 'MEDIUM',
        status: 'PENDING',
        studentId: student.id,
        dormInfo: 'Block A, Room 101',
      }
    ]
  });



  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
