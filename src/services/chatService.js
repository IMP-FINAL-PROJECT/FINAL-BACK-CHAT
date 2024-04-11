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

    createChat: async (body) => {
        try {
            const check = firestore.collection(body.id);
            const snapshot = await check.get();

            let name;

            if (snapshot.empty) {
                console.log('empty');

                name = '1';
            } else {
                const lastDocument = snapshot.docs[snapshot.docs.length - 1].id;
                const lastDocumentNumber = parseInt(lastDocument);
                name = (lastDocumentNumber + 1).toString();
            }

            // 문서 추가
            await check.doc(name).set({
                chat: [],
                update_at: new Date(Date.now()),
            });

            return {
                timestamp: new Date(Date.now()),
                result: true,
                status: 200,
                message: 'Success',
                data: null,
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
