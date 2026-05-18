import { logger } from '../utils/logger.js';

const errorMiddleware = (err, req, res, next) => {
  let { statusCode, message } = err;

  if (!statusCode) {
    statusCode = 500;
  }

  const response = {
    code: statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  if (statusCode === 500) {
    logger.error(`${req.method} ${req.url} - ${err.message}`);
  }

  res.status(statusCode).send(response);
};

export default errorMiddleware;
