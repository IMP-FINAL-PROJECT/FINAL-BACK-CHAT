import chatService from '../services/chatService.js';

const chatController = {
    getChatList: async (req, res) => {
        const response = await chatService.getChatList(req.body.id);
        return res.json(response);
    },

    createChat: async (req, res) => {
        const response = await chatService.createChat(req.body);
        return res.json(response);
    },

    deleteChat: async (req, res) => {
        const response = await chatService.deleteChat(req.body);
        return res.json(response);
    },

    question: async (req, res) => {
        const response = await chatService.question(req.body);
        return res.json(response);
    },

    botUtterance: async (req, res) => {
        const response = await chatService.botUtterance(req.body);
        return res.json(response);
    },

    chatHistory: async (req, res) => {
        const response = await chatService.chatHistory(req.query.id, req.query.number);
        return res.json(response);
    },
};

export default chatController;
