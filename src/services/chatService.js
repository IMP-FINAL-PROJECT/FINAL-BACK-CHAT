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

    deleteChat: async (body) => {
        try {
            const doc = firestore.collection(body.id).doc(body.number);
            const snapshot = await doc.get();

            if (snapshot.exists) {
                await doc.delete();

                return {
                    timestamp: new Date(Date.now()),
                    result: true,
                    status: 200,
                    message: 'Success',
                    data: {
                        delete_number: body.number,
                    },
                };
            } else {
                return {
                    timestamp: new Date(Date.now()),
                    result: false,
                    status: 400,
                    message: "Can't Delete Chat Room",
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

export default chatService;