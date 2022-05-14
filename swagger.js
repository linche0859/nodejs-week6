const swaggerAutogen = require('swagger-autogen')();
require('dotenv').config();

const host =
  process.env.NODE_ENV === 'production'
    ? process.env.SWAGGER_BASE || 'localhost:3000'
    : 'localhost:3000';
const schemes = process.env.NODE_ENV === 'production' ? ['https'] : ['http'];

const doc = {
  info: {
    title: 'METAWALL',
    description: 'METAWALL 的 API 文件',
  },
  host,
  schemes,
  tags: [
    { name: 'Posts', description: '貼文相關' },
    { name: 'Users', description: '會員相關' },
  ],
  definitions: {
    Posts: {
      content: '來新增一筆資料吧',
      image: 'https://....',
      user: {
        _id: '123456789',
        name: '小明',
        avatar: 'https://....',
      },
      createdAt: '2022-05-03T09:00:00.226Z',
    },
    Users: {
      _id: '123456789',
      name: '會員暱稱',
      avatar: 'https://...',
      gender: 'male',
    },
    Error: {
      message: {
        field: '錯誤訊息',
      },
    },
  },
  securityDefinitions: {
    apiKeyAuth: {
      type: 'apiKey',
      in: 'header', // can be 'header', 'query' or 'cookie'
      name: 'authorization', // name of the header, query parameter or cookie
      description: 'JSON Web Token',
    },
  },
};

const outputFile = './swagger_output.json'; // 輸出的文件名稱
const endpointsFiles = ['./app.js']; // 要指向的 API

swaggerAutogen(outputFile, endpointsFiles, doc);
