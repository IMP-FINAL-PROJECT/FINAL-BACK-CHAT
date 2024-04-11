import express from 'express';
import chatController from '../controllers/chatController.js';

const chatRouter = express.Router();

chatRouter.get('/list', chatController.getChatList);

chatRouter.post('/create', chatController.createChat);

chatRouter.post('/delete', chatController.deleteChat);

export default chatRouter;
