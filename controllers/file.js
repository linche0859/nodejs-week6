const sharp = require('sharp');
const { getHttpResponseContent } = require('../services/response');
const { asyncHandleError, appError } = require('../services/error');
const { uploadImgur } = require('../services/upload');

const file = {
  // 上傳會員頭像
  postAvatar: asyncHandleError(async (req, res, next) => {
    const { file } = req;
    if (!file) return next(appError(400, '請選擇檔案'));
    if (file.size > 2 * 1024 * 1024)
      return next(appError(400, '檔案大小僅限 2MB 以下'));

    const buffer = await sharp(file.buffer)
      .resize({ width: 120, height: 120 })
      .png()
      .toBuffer();

    const link = await uploadImgur(buffer);
    res.status(201).json(getHttpResponseContent(link));
  }),
  // 上傳圖片
  postImage: asyncHandleError(async (req, res, next) => {
    const { file } = req;
    if (!file) return next(appError(400, '請選擇檔案'));
    if (file.size > 2 * 1024 * 1024)
      return next(appError(400, '檔案大小僅限 2MB 以下'));

    const buffer = await sharp(file.buffer).png().toBuffer();
    const link = await uploadImgur(buffer);
    res.status(201).json(getHttpResponseContent(link));
  }),
};

module.exports = file;
