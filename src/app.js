import express from 'express';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import chatRouter from './routes/chatRouter.js';
import pushRouter from './routes/pushRouter.js';
import cron from 'node-cron';
import pushService from './services/pushService.js';

const app = express();
const __dirname = path.resolve();

app.set('port', process.env.PORT || 3000);

app.use(morgan('dev')); // 개발 => dev, 배포 => combined
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //extended 는 중첩된 객체표현을 허용할지 말지 정함 객체 안에 객체를 파싱할 수 있게하려면 true. true = qs, false querystring
app.use(cors());

app.use('/chat', chatRouter);
app.use('/push', pushRouter);

cron.schedule('*/5 * * * *', async () => {
    console.log('notification start');
    try {
        await pushService.notification();
        console.log('notification finish');
    } catch (error) {
        console.error('An error occurred during notification processing', error);
    }
});

app.listen(app.get('port'), () => {
    console.log('Server Connect');
});
