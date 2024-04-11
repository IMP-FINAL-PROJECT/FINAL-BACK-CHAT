import chatService from '../services/chatService.js';

const chatController = {
    getChatList: async (req, res) => {
        const response = await chatService.getChatList(req.body.id);
        return res.json(response);
    },

    deleteChat: async (req, res) => {
        const response = await chatService.deleteChat(req.body);
        return res.json(response);
    },
};

export default chatController;