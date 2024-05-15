import { firestore } from '../config/firebase_config.js';
import admin from 'firebase-admin';
import user from '../../database/user.js';

const pushService = {
    notification: async () => {
        try {

            const users = await user.findAll();

            for(const key of users) {
                const snapshot = await firestore.collection(`${key.id}`).doc('0').get();
    
                    console.log(snapshot.data());

                    const data = snapshot.data();
       
                    if (key.token != null && data != undefined) {

                        try {
                            const payload = {
                                notification: {
                                    title: "Fluffy_mood",
                                    body: data.chat[data.chat.length - 1].response,
                                },
                                token: key.token,
                            };
    
                            await snapshot.ref.update({
                                update_at: new Date(Date.now()),
                            });
    
                            // 각 조건을 만족하는 문서마다 알림을 보냅니다.
                            await admin.messaging().send(payload);
                        
                        } catch (error) {
                            continue;
                        }
            }

            }
        } catch (error) {
            console.log('Error : ', error);
        }
    },
};

export default pushService;
