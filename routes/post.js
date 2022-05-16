const express = require('express');
const router = express.Router();
const PostController = require('../controllers/post');
const auth = require('../middlewares/auth');

router.get('/posts', auth, (req, res, next) =>
  /**
   * #swagger.tags = ['Posts']
   * #swagger.summary = '取得貼文'
   * #swagger.security = [{
      "apiKeyAuth": [] 
    }]
   */
  /**
    #swagger.parameters['Authorization'] = {
      in: 'header',
      description: 'JSON Web Token',
      schema: {
        $Authorization: '',
      }
    }
    #swagger.parameters['q'] = {
      in: 'query',
      description: '關鍵字',
      type: 'string',
    }
    #swagger.parameters['sort'] = {
      in: 'query',
      description: '排序方式，desc 為新至舊，asc 為舊至新',
      type: 'string',
    }
   */
  /**
    #swagger.responses[200] = {
      description: '成功取得貼文',
      schema: [{ $ref: '#/definitions/Posts' }]
    }
   */
  PostController.getPosts(req, res, next)
);
router.get('/posts/like', auth, (req, res, next) =>
  /**
   * #swagger.tags = ['Posts']
   * #swagger.summary = '取得按讚的貼文'
   * #swagger.security = [{
      "apiKeyAuth": [] 
    }]
   */
  /**
    #swagger.parameters['Authorization'] = {
      in: 'header',
      description: 'JSON Web Token',
      schema: {
        $Authorization: '',
      }
    }
   */
  /**
    #swagger.responses[200] = {
      description: '成功取得按讚的貼文',
      schema: [{ $ref: '#/definitions/Posts' }]
    }
   */
  PostController.getLikePosts(req, res, next)
);
router.get('/posts/:userId', auth, (req, res, next) =>
  /**
   * #swagger.tags = ['Posts']
   * #swagger.summary = '取得個人的貼文'
   * #swagger.security = [{
      "apiKeyAuth": [] 
    }]
   */
  /**
    #swagger.parameters['Authorization'] = {
      in: 'header',
      description: 'JSON Web Token',
      schema: {
        $Authorization: '',
      }
    }
    #swagger.parameters['userId'] = { 
      description: '會員編號',
    }
    #swagger.parameters['q'] = {
      in: 'query',
      description: '關鍵字',
      type: 'string',
    }
    #swagger.parameters['sort'] = {
      in: 'query',
      description: '排序方式，desc 為新至舊，asc 為舊至新',
      type: 'string',
    }
   */
  /**
    #swagger.responses[200] = {
      description: '成功取得個人的貼文',
      schema: [{ $ref: '#/definitions/Posts' }]
    }
   */
  PostController.getUserPosts(req, res, next)
);
router.post('/post', auth, (req, res, next) =>
  /**
   * #swagger.tags = ['Posts']
   * #swagger.summary = '新增貼文'
   * #swagger.security = [{
      "apiKeyAuth": [] 
    }]
   */
  /**
    #swagger.parameters['Authorization'] = {
      in: 'header',
      description: 'JSON Web Token',
      schema: {
        $Authorization: '',
      }
    }
    #swagger.parameters['parameter_name'] = {
      in: 'body',
      description: '貼文資料',
      schema: {
        $content: '貼文內容',
        image: '貼文圖片連結'
      }
    }
  */
  /**
    #swagger.responses[201] = {
      description: '新增貼文成功',
      schema: { $ref: '#/definitions/Posts' }
    }
    #swagger.responses[400] = {
      description: '新增貼文失敗',
      schema: { $ref: '#/definitions/Error' }
    }
  */
  PostController.postOnePost(req, res, next)
);
router.post('/post/:postId/message', auth, (req, res, next) =>
  /**
   * #swagger.tags = ['Posts']
   * #swagger.summary = '新增貼文留言'
   * #swagger.security = [{
      "apiKeyAuth": [] 
    }]
   */
  /**
    #swagger.parameters['Authorization'] = {
      in: 'header',
      description: 'JSON Web Token',
      schema: {
        $Authorization: '',
      }
    }
    #swagger.parameters['postId'] = { 
      description: '貼文編號',
    }
    #swagger.parameters['parameter_name'] = {
      in: 'body',
      description: '留言資料',
      schema: {
        $content: '貼文內容',
      }
    }
  */
  /**
    #swagger.responses[201] = {
      description: '新增貼文留言成功',
      schema: { $ref: '#/definitions/Messages' }
    }
    #swagger.responses[400] = {
      description: '新增貼文留言失敗',
      schema: { $ref: '#/definitions/Error' }
    }
  */
  PostController.postMessage(req, res, next)
);
router.post('/post/:postId/like', auth, (req, res, next) =>
  /**
   * #swagger.tags = ['Posts']
   * #swagger.summary = '按讚貼文'
   * #swagger.security = [{
      "apiKeyAuth": [] 
    }]
   */
  /**
    #swagger.parameters['Authorization'] = {
      in: 'header',
      description: 'JSON Web Token',
      schema: {
        $Authorization: '',
      }
    }
    #swagger.parameters['postId'] = { 
      description: '貼文編號',
    }
  */
  /**
    #swagger.responses[201] = {
      description: '按讚貼文成功',
      schema: { $ref: '按讚貼文成功' }
    }
    #swagger.responses[400] = {
      description: '按讚貼文失敗',
      schema: { $ref: '#/definitions/Error' }
    }
  */
  PostController.postLike(req, res, next)
);
router.delete('/post/:postId/like', auth, (req, res, next) =>
  /**
   * #swagger.tags = ['Posts']
   * #swagger.summary = '移除貼文的按讚'
   * #swagger.security = [{
      "apiKeyAuth": [] 
    }]
   */
  /**
    #swagger.parameters['Authorization'] = {
      in: 'header',
      description: 'JSON Web Token',
      schema: {
        $Authorization: '',
      }
    }
    #swagger.parameters['postId'] = { 
      description: '貼文編號',
    }
  */
  /**
    #swagger.responses[201] = {
      description: '移除貼文的按讚成功',
      schema: {
        data: '移除貼文的按讚成功'
      }
    }
    #swagger.responses[400] = {
      description: '移除貼文的按讚失敗',
      schema: { $ref: '#/definitions/Error' }
    }
  */
  PostController.deleteLike(req, res, next)
);

module.exports = router;
