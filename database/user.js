import { User } from './models/user.js';

const user = {
    findTokenById: async (id) => {
        const user = await User.findOne({ attributes: ['token'], where: { id: `${id}` }, raw: true });
        return user;
    },

    findById: async (id) => {
        const user = await User.findOne({ where: { id: `${id}` }, raw: true });
        return user;
    },
};

export default user;
