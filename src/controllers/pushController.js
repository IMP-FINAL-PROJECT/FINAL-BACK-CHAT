import pushService from '../services/pushService.js';

const pushController = {
    notification: async (req, res) => {
        const response = await pushService.notification();
        return res.json(response);
    },
};

export default pushController;
