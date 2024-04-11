import { firestore } from '../config/firebase_config.js';

const chatService = {
    getChatList: async (id) => {
        try {
            const list = firestore.collection(id);
            const snapshot = await list.get();

            let map = new Map();

            snapshot.docs.forEach((doc) => {
                map.set(doc.id, doc.data().update_at.toDate());
            });

            const chatList = Array.from(map).map(([number, update_at]) => ({
                number: number,
                update_at: update_at,
            }));

            return {
                timestamp: new Date(Date.now()),
                result: true,
                status: 200,
                message: 'Success',
                data: { chatList: chatList },
            };
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

export default chatService;
