const Post = require('../models/post');
const { getHttpResponseContent } = require('../services/response');
const { validationError, asyncHandleError } = require('../services/error');

const post = {
  // 取得貼文
  getPosts: asyncHandleError(async (req, res) => {
    const {
      query: { q, sort = 'desc' },
    } = req;
    const filter = q ? { content: new RegExp(q, 'i') } : {};
    const posts = await Post.find(filter)
      .populate({ path: 'user', select: 'name avatar' })
      .sort({
        createdAt: sort === 'desc' ? -1 : 1,
      });
    res.status(200).json(getHttpResponseContent(posts));
  }),
  // 新增貼文
  postOnePost: asyncHandleError(async (req, res, next) => {
    const {
      user,
      body: { content, image },
    } = req;
    if (!content)
      return next(validationError(400, 'content', '請填寫貼文內容'));

    if (image && !image.startsWith('https'))
      return next(validationError(400, 'image', '貼文圖片網址錯誤'));
    const post = await Post.create({ content, image, user: user._id });

    res.status(201).json(getHttpResponseContent(post));
  }),
};

module.exports = post;
