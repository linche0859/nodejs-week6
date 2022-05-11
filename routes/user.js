const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const auth = require('../middlewares/auth');

router.get('/user/me', auth, (req, res, next) =>
  /**
   * #swagger.tags = ['Users']
   * #swagger.summary = '取得會員資訊'
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
      description: '取得會員資訊成功',
      schema: { $ref: '#/definitions/Users' }
    }
    #swagger.responses[401] = {
      description: '登入會員失敗',
      schema: {
        message: '您尚未登入'
      }
    }
  */
  UserController.me(req, res, next)
);
router.post('/user/sign_up', (req, res, next) =>
  /**
   * #swagger.tags = ['Users']
   * #swagger.summary = '註冊會員'
   */
  /**
    #swagger.parameters['parameter_name'] = {
      in: 'body',
      description: '註冊資料',
      schema: {
        $name: '暱稱',
        $email: 'test@gmail.com',
        $password: 'a1234567',
      }
    }
   */
  /**
    #swagger.responses[201] = {
      description: '註冊會員成功',
      schema: {
        token: 'token',
      }
    }
    #swagger.responses[400] = {
      description: '註冊會員失敗',
      schema: { $ref: '#/definitions/Error' }
    }
  */
  UserController.signUp(req, res, next)
);
router.post('/user/sign_in', (req, res, next) =>
  /**
   * #swagger.tags = ['Users']
   * #swagger.summary = '登入會員'
   */
  /**
    #swagger.parameters['parameter_name'] = {
      in: 'body',
      description: '登入資料',
      schema: {
        $email: 'test@gmail.com',
        $password: 'a1234567',
      }
    }
   */
  /**
    #swagger.responses[201] = {
      description: '登入會員成功',
      schema: {
        token: 'token',
      }
    }
    #swagger.responses[400] = {
      description: '登入會員失敗',
      schema: { $ref: '#/definitions/Error' }
    }
  */
  UserController.signIn(req, res, next)
);

module.exports = router;
