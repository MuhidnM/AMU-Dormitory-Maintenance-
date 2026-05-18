import redis from '../config/redis.js';
import { logger } from '../utils/logger.js';

const cacheMiddleware = (duration) => async (req, res, next) => {
  const key = `cache:${req.originalUrl || req.url}`;
  
  try {
    const cachedResponse = await redis.get(key);
    
    if (cachedResponse) {
      logger.debug(`Cache hit for key: ${key}`);
      return res.status(200).json(JSON.parse(cachedResponse));
    }

    res.sendResponse = res.json;
    res.json = (body) => {
      redis.setex(key, duration, JSON.stringify(body));
      res.sendResponse(body);
    };
    
    next();
  } catch (error) {
    logger.error('Cache Middleware Error: ' + error.message);
    next();
  }
};

export default cacheMiddleware;
