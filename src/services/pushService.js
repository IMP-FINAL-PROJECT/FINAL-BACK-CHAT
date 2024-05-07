import { firestore } from '../config/firebase_config.js';
import admin from 'firebase-admin';
import user from '../../database/user.js';

const pushService = {
    notification: async () => {
        try {
            const snapshot = await firestore.collection('fcm_notification_push').get();

            for (const doc of snapshot.docs) {
                const data = doc.data();

                console.log(data);

                const userToken = await user.findTokenById(doc.id);

                if (userToken != null) {
                    if (data.update_at > data.last_update + 60000) {
                        const payload = {
                            notification: {
                                title: data.title,
                                body: data.body,
                            },
                            token: userToken,
                        };

                        await doc.ref.update({
                            last_update: data.update_at,
                            update_at: new Date(Date.now()),
                        });

                        // 각 조건을 만족하는 문서마다 알림을 보냅니다.
                        await admin.messaging().send(payload);
                    }
                }
            }
        } catch (error) {
            console.log('Error : ', error);
        }
    },
};

export default pushService;
