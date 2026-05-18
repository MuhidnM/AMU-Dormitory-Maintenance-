import { logger } from '../utils/logger.js';

const errorMiddleware = (err, req, res, next) => {
  let { statusCode, message } = err;

  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'Image size exceeds the 1MB limit. Please upload a smaller image.';
  }

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
