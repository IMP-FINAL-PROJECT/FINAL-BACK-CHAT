import { firestore } from '../config/firebase_config.js';
import admin from 'firebase-admin';
import user from '../../database/user.js';

const chatService = {
    getChatList: async (id) => {
        try {
            const list = firestore.collection(id);
            const snapshot = await list.get();

            let map = new Map();

            snapshot.docs.forEach((doc) => {
                map.set(doc.id, {
                    update_at: doc.data().update_at.toDate(),
                    name: doc.data().name,
                });
            });

            const chatList = Array.from(map).map(([number, chat_info]) => ({
                number: number,
                chat_info: chat_info,
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
            const userCheck = await user.findById(body.id);

            if (userCheck != null) {
                const check = firestore.collection(body.id);
                const snapshot = await check.get();

                let name = '착하지만 바보 같은 동욱봇 ';
                let number;
                const update_at = new Date(Date.now());

                if (snapshot.empty) {
                    console.log('empty');

                    number = '1';
                } else {
                    const lastDocument = snapshot.docs[snapshot.docs.length - 1].id;
                    const lastDocumentNumber = parseInt(lastDocument);
                    number = (lastDocumentNumber + 1).toString();
                }

                // 문서 추가
                await check.doc(number).set({
                    name: name + number,
                    chat: [],
                    update_at: update_at,
                });

                return {
                    timestamp: new Date(Date.now()),
                    result: true,
                    status: 200,
                    message: 'Success',
                    data: {
                        number: number,
                        chat_info: {
                            name: name + number,
                            update_at: update_at,
                        },
                    },
                };
            } else {
                return {
                    timestamp: new Date(Date.now()),
                    result: false,
                    status: 400,
                    message: 'No User',
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
                        number: body.number,
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

    question: async (body) => {
        try {
            const doc = firestore.collection(body.id).doc(body.number);
            const snapshot = await doc.get();

            if (!snapshot.exists) {
                return {
                    timestamp: new Date(Date.now()),
                    result: false,
                    status: 400,
                    message: 'Cannot Connect Chatting',
                    data: null,
                };
            } else {
                try {
                    // 서버 접속 후 request
                    const response = await fetch(process.env.FLASK_IP, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(body),
                    });

                    const flaskResponse = await response.json();

                    await doc.update({
                        chat: admin.firestore.FieldValue.arrayUnion({
                            request: body.request,
                            response: flaskResponse,
                            chat_time: new Date(Date.now()),
                        }),
                        update_at: admin.firestore.FieldValue.serverTimestamp(),
                    });
                } catch (error) {
                    throw new Error('FLASK 응답 오류');
                }
            }

            return {
                timestamp: new Date(Date.now()),
                result: true,
                status: 200,
                message: 'Success',
                data: {
                    request: body.request,
                    response: flaskResponse,
                    chat_time: new Date(Date.now()),
                },
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

    botUtterance: async (body) => {
        try {
            const doc = firestore.collection(body.id).doc('0');
            const snapshot = await doc.get();

            if (!snapshot.exists) {
                await doc.set({
                    name: '선발화 동욱봇',
                    chat: [],
                    chat_time: new Date(Date.now()),
                });
            }

            await doc.update({
                chat: admin.firestore.FieldValue.arrayUnion({
                    response: body.response,
                    chat_time: new Date(Date.now()),
                }),
                update_at: admin.firestore.FieldValue.serverTimestamp(),
            });

            return {
                timestamp: new Date(Date.now()),
                result: true,
                status: 200,
                message: 'Success',
                data: {
                    response: body.response,
                    chat_time: new Date(Date.now()),
                },
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

    chatHistory: async (id, number) => {
        try {
            const doc = firestore.collection(id).doc(number);
            const snapshot = await doc.get();

            if (snapshot.exists) {
                const chatData = snapshot.data().chat.map((chat) => ({
                    response: chat.response,
                    date: chat.date.toDate(), // Timestamp를 Date로 변환
                }));

                return {
                    timestamp: new Date(Date.now()),
                    result: true,
                    status: 200,
                    message: 'Success',
                    data: {
                        chat: chatData,
                        update_at: snapshot.data().update_at.toDate(),
                    },
                };
            } else {
                return {
                    timestamp: new Date(Date.now()),
                    result: false,
                    status: 400,
                    message: 'no chatting room',
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
