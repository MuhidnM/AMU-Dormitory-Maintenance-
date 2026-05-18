import prisma from '../config/prisma.js';

export const getStats = async (req, res) => {
  try {
    const totalRequests = await prisma.maintenanceRequest.count();
    const pendingRequests = await prisma.maintenanceRequest.count({ where: { status: 'PENDING' } });
    const resolvedRequests = await prisma.maintenanceRequest.count({ where: { status: 'RESOLVED' } });
    const inProgressRequests = await prisma.maintenanceRequest.count({ where: { status: 'IN_PROGRESS' } });

    const requestsByCategory = await prisma.maintenanceRequest.groupBy({
      by: ['category'],
      _count: { _all: true }
    });

    const requestsByPriority = await prisma.maintenanceRequest.groupBy({
      by: ['priority'],
      _count: { _all: true }
    });

    res.status(200).json({
      total: totalRequests,
      pending: pendingRequests,
      resolved: resolvedRequests,
      inProgress: inProgressRequests,
      byCategory: requestsByCategory,
      byPriority: requestsByPriority
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};

export const getStaffPerformance = async (req, res) => {
  try {
    const staff = await prisma.user.findMany({
      where: { role: 'STAFF' },
      include: {
        _count: {
          select: { assignments: true }
        },
        assignments: {
          where: { status: 'RESOLVED' }
        }
      }
    });

    const performance = staff.map(s => ({
      id: s.id,
      name: s.name,
      totalAssigned: s._count.assignments,
      totalResolved: s.assignments.length,
      resolutionRate: s._count.assignments > 0 ? (s.assignments.length / s._count.assignments) * 100 : 0
    }));

    res.status(200).json(performance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching performance', error: error.message });
  }
};
