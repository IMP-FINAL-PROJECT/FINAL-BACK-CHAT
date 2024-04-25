import admin from 'firebase-admin';
import user from '../../database/user.js';

const pushService = {
    notification: async (body) => {
        try {
            const userToken = await user.findTokenById(body.id);

            if (userToken != null) {
                let message = {
                    notification: {
                        title: 'Fluffy_mood',
                        body: '안녕하세요?',
                    },
                    token: userToken.token,
                };

                await admin.messaging().send(message);

                return {
                    timestamp: new Date(Date.now()),
                    result: true,
                    status: 200,
                    message: 'Success',
                    data: null,
                };
            } else {
                return {
                    timestamp: new Date(Date.now()),
                    result: false,
                    status: 400,
                    message: 'No Token',
                    data: null,
                };
            }
        } catch (error) {
            console.log(error);
            return {
                timestamp: new Date(Date.now()),
                result: false,
                status: 400,
                message: error,
                data: null,
            };
        }
    },
};

export default pushService;
