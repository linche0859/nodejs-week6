// Higher order function

/**
 * 非同步的錯誤處理
 * @param {function} func 非同步事件
 */
const asyncHandleError = (func) => (req, res, next) => {
  func(req, res, next).catch((error) => next(error));
};

module.exports = {
  asyncHandleError,
};
