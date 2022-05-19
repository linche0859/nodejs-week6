const Post = require('../models/post');
const Message = require('../models/message');
const User = require('../models/user');
const { getHttpResponseContent } = require('../services/response');
const {
  appError,
  validationError,
  asyncHandleError,
} = require('../services/error');
const {
  isValidObjectId,
  isPositiveInteger,
} = require('../services/validation');

const post = {
  // 取得貼文
  getPosts: asyncHandleError(async (req, res, next) => {
    let {
      query: { q, sort = 'desc', page = 1, limit = 10 },
    } = req;
    if (!isPositiveInteger(page))
      return next(appError(400, '請傳入正確的查詢頁數'));
    if (!isPositiveInteger(limit))
      return next(appError(400, '請傳入正確的查詢頁筆數'));

    page = parseInt(page);
    limit = parseInt(limit);
    const filter = q ? { content: new RegExp(q, 'i') } : {};
    const total = await Post.find(filter).count();
    const totalPage = Math.ceil(total / limit);
    if (totalPage > 0 && page > totalPage)
      return next(appError(400, '請傳入正確的查詢頁數'));

    const posts = await Post.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({ path: 'user', select: 'name avatar' })
      .populate({
        path: 'messages',
        populate: {
          path: 'user',
          select: 'name avatar',
        },
        options: { sort: { createdAt: -1 } },
      })
      .sort({
        createdAt: sort === 'desc' ? -1 : 1,
      });
    res.status(200).json(
      getHttpResponseContent({
        data: posts,
        meta: {
          currentPage: page,
          lastPage: totalPage,
          perPage: limit,
          total,
        },
      })
    );
  }),
  // 取得按讚的貼文
  getLikePosts: asyncHandleError(async (req, res, next) => {
    const { user } = req;
    const posts = await Post.find({ likes: { $in: user._id } })
      .populate({ path: 'user', select: 'name avatar' })
      .select('-messages')
      .sort({
        createdAt: -1,
      });
    res.status(200).json(getHttpResponseContent(posts));
  }),
  // 取得個人的貼文
  getUserPosts: asyncHandleError(async (req, res, next) => {
    let {
      params: { userId },
      query: { q, sort = 'desc', page = 1, limit = 10 },
    } = req;
    if (!(userId && isValidObjectId(userId)))
      return next(appError(400, '請傳入特定的會員'));
    if (!isPositiveInteger(page))
      return next(appError(400, '請傳入正確的查詢頁數'));
    if (!isPositiveInteger(limit))
      return next(appError(400, '請傳入正確的查詢頁筆數'));

    const existedUser = await User.findById(userId);
    if (!existedUser) return next(appError(400, '尚未註冊為會員'));

    page = parseInt(page);
    limit = parseInt(limit);

    const filter = { user: userId };
    if (q) filter.content = new RegExp(q, 'i');

    const total = await Post.find(filter).count();
    const totalPage = Math.ceil(total / limit);
    if (totalPage > 0 && page > totalPage)
      return next(appError(400, '請傳入正確的查詢頁數'));

    const posts = await Post.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({ path: 'user', select: 'name avatar' })
      .populate({
        path: 'messages',
        populate: {
          path: 'user',
          select: 'name avatar',
        },
        options: { sort: { createdAt: -1 } },
      })
      .sort({
        createdAt: sort === 'desc' ? -1 : 1,
      });
    res.status(200).json(
      getHttpResponseContent({
        data: posts,
        meta: {
          currentPage: page,
          lastPage: totalPage,
          perPage: limit,
          total,
        },
      })
    );
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
  // 新增貼文留言
  postMessage: asyncHandleError(async (req, res, next) => {
    const {
      user,
      params: { postId },
      body: { content },
    } = req;
    if (!(postId && isValidObjectId(postId)))
      return next(appError(400, '請傳入特定的貼文'));
    if (!content) return next(appError(400, '請填寫留言內容'));

    const existedPost = await Post.findById(postId);
    if (!existedPost) return next(appError(400, '尚未發布貼文'));

    const message = await Message.create({ user: user._id, content });
    await Post.updateOne(
      { _id: postId },
      {
        messages: [...existedPost.messages, message._id],
      }
    );

    const currentMessage = await Message.findById(message._id).populate({
      path: 'user',
      select: 'name avatar',
    });
    res.status(201).json(getHttpResponseContent(currentMessage));
  }),
  // 按讚貼文
  postLike: asyncHandleError(async (req, res, next) => {
    const {
      user,
      params: { postId },
    } = req;
    if (!(postId && isValidObjectId(postId)))
      return next(appError(400, '請傳入特定的貼文'));

    const existedPost = await Post.findById(postId);
    if (!existedPost) return next(appError(400, '尚未發布貼文'));
    if (existedPost.likes.includes(user._id))
      return next(appError(400, '已對該貼文按讚'));

    await Post.updateOne(
      { _id: postId },
      {
        $push: { likes: user._id },
      }
    );
    res.status(201).json(getHttpResponseContent('按讚貼文成功'));
  }),
  // 移除貼文的按讚
  deleteLike: asyncHandleError(async (req, res, next) => {
    const {
      user,
      params: { postId },
    } = req;
    if (!(postId && isValidObjectId(postId)))
      return next(appError(400, '請傳入特定的貼文'));

    const existedPost = await Post.findById(postId);
    if (!existedPost) return next(appError(400, '尚未發布貼文'));
    if (!existedPost.likes.includes(user._id))
      return next(appError(400, '尚未按讚貼文'));

    await Post.updateOne({ _id: postId }, { $pull: { likes: user._id } });
    res.status(201).json(getHttpResponseContent('移除貼文的按讚成功'));
  }),
};

module.exports = post;
