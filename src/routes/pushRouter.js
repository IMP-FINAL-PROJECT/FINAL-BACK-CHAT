import express from 'express';
import pushController from '../controllers/pushController.js';

const pushRouter = express.Router();

pushRouter.post('/notification', pushController.notification);

export default pushRouter;
