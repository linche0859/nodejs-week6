const express = require('express');
const router = express.Router();
const FileController = require('../controllers/file');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.post('/file/avatar', auth, upload.single('image'), (req, res, next) =>
  /**
   * #swagger.tags = ['Files']
   * #swagger.summary = '上傳會員頭像'
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
    #swagger.consumes = ['multipart/form-data']
    #swagger.parameters['image'] = {
      in: 'formData',
      type: 'file',
      required: 'true',
      description: '圖片檔案',
    }
   */
  /**
    #swagger.responses[201] = {
      description: '上傳成功',
      schema: {
        data: 'https://i.imgur.com/xxx.png'
      }
    }
    #swagger.responses[400] = {
      description: '上傳失敗',
      schema: { $ref: '#/definitions/Error' }
    }
   */
  FileController.postAvatar(req, res, next)
);
router.post('/file/image', auth, upload.single('image'), (req, res, next) =>
  /**
   * #swagger.tags = ['Files']
   * #swagger.summary = '上傳圖片'
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
    #swagger.consumes = ['multipart/form-data']
    #swagger.parameters['image'] = {
      in: 'formData',
      type: 'file',
      required: 'true',
      description: '圖片檔案',
    }
   */
  /**
    #swagger.responses[201] = {
      description: '上傳成功',
      schema: {
        data: 'https://i.imgur.com/xxx.png'
      }
    }
    #swagger.responses[400] = {
      description: '上傳失敗',
      schema: { $ref: '#/definitions/Error' }
    }
   */
  FileController.postImage(req, res, next)
);

module.exports = router;
