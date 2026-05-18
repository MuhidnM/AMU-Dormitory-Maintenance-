import prisma from '../config/prisma.js';
import { io } from '../server.js';
import { recordAuditLog } from '../services/auditService.js';
import ApiError from '../utils/ApiError.js';
import { sendStatusUpdateEmail } from '../services/emailService.js';

export const createRequest = async (req, res, next) => {
  try {
    const { title, description, category, priority, dormInfo, images = [] } = req.body;

    const request = await prisma.maintenanceRequest.create({
      data: {
        title,
        description,
        category,
        priority,
        dormInfo,
        studentId: req.user.id,
        attachments: {
          create: images.map(url => ({ url }))
        }
      }
    });

    await recordAuditLog({
      action: 'CREATE_REQUEST',
      entity: 'MaintenanceRequest',
      entityId: request.id,
      userId: req.user.id,
      ipAddress: req.ip
    });

    // Notify Admins
    io.emit('new_request', request);

    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
};

export const getRequests = async (req, res, next) => {
  try {
    const { role, id } = req.user;
    const { page = 1, limit = 10, status, priority, category } = req.query;
    
    const skip = (page - 1) * limit;
    const where = {};

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (category) where.category = category;

    if (role === 'STUDENT') {
      where.studentId = id;
    } else if (role === 'STAFF') {
      where.staffId = id;
    }

    const [requests, total] = await Promise.all([
      prisma.maintenanceRequest.findMany({
        where,
        skip: Number(skip),
        take: Number(limit),
        include: { 
          student: { select: { name: true, email: true } }, 
          staff: { select: { name: true } },
          attachments: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.maintenanceRequest.count({ where })
    ]);

    res.status(200).json({
      data: requests,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const assignRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const { staffId } = req.body;

    const request = await prisma.maintenanceRequest.update({
      where: { id: requestId },
      data: {
        staffId,
        status: 'ASSIGNED'
      }
    });

    await recordAuditLog({
      action: 'ASSIGN_REQUEST',
      entity: 'MaintenanceRequest',
      entityId: requestId,
      userId: req.user.id,
      details: { staffId },
      ipAddress: req.ip
    });

    // Save notification to DB
    const notification = await prisma.notification.create({
      data: {
        userId: staffId,
        senderId: req.user.id,
        message: `New request assigned: ${request.title}`,
        type: 'NEW_ASSIGNMENT',
        link: '/staff'
      }
    });

    // Notify Staff
    io.to(staffId).emit('notification', notification);

    res.status(200).json(request);
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const { status, notes } = req.body;

    const request = await prisma.maintenanceRequest.update({
      where: { id: requestId },
      data: { status, notes },
      include: { student: true }
    });

    await recordAuditLog({
      action: 'UPDATE_STATUS',
      entity: 'MaintenanceRequest',
      entityId: requestId,
      userId: req.user.id,
      details: { status, notes },
      ipAddress: req.ip
    });

    // Send Email Notification
    sendStatusUpdateEmail(request.student, request, status);

    // Save notification to DB
    const notification = await prisma.notification.create({
      data: {
        userId: request.studentId,
        senderId: req.user.id,
        message: `Your request "${request.title}" is now ${status}`,
        type: 'STATUS_UPDATE',
        link: '/student/requests'
      }
    });

    // Notify Student via Socket
    io.to(request.studentId).emit('notification', notification);

    res.status(200).json(request);
  } catch (error) {
    next(error);
  }
};


