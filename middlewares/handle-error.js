/**
 * 取得欄位驗證的錯誤
 * @param {object} err Error instance
 * @returns {object}
 */
const getValidationError = (err) => {
  return Object.entries(err.errors).reduce((acc, cur) => {
    const [field, value] = cur;
    acc[field] = value.message;
    return acc;
  }, {});
};

/**
 * 開發環境的錯誤處理
 * @param {object} err Error instance
 * @param {Object} res express response object
 */
const handleDevError = (err, res) => {
  const { statusCode, message, stack, isValidationError, toObject } = err;
  res.status(statusCode).json({
    message: isValidationError
      ? getValidationError(toObject ? JSON.parse(err.message) : err)
      : message,
    error: err,
    stack,
  });
};

/**
 * Production 環境的錯誤處理
 * @param {object} err Error instance
 * @param {Object} res express response object
 */
const handleProdError = (err, res) => {
  const { statusCode, message, isOperational, isValidationError, toObject } =
    err;
  if (isOperational) {
    return res.status(statusCode).json({
      message: isValidationError
        ? getValidationError(toObject ? JSON.parse(err.message) : err)
        : message,
    });
  }
  res.status(500).json({
    status: 'error',
    message: '系統錯誤，請聯絡系統管理員',
  });
};

const handleError = (err, req, res, next) => {
  const isValidationError = err.name === 'ValidationError';
  err.statusCode = err.statusCode || 500;

  // validation error
  if (isValidationError) {
    err.statusCode = 400;
    err.message = err.message || '資料欄位未填寫正確，請重新輸入';
    err.isValidationError = true;
    err.isOperational = true;
  }
  if (process.env.NODE_ENV === 'development') {
    return handleDevError(err, res);
  }
  handleProdError(err, res);
};

module.exports = handleError;
