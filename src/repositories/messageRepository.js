import Message from "../schema/message.js";
import crudRepository from "./crudRepository.js";

const messageRepository = {
    ...crudRepository(Message),
    getPaginatedMessages: async (messageParams, page, limit) => {
        const messages = await Message.find(messageParams)
            .sort({ createdAt: 1 }) //sorting the message in decreasing order
            .skip((page - 1) * limit) //pagination
            .limit(limit)
            .populate('senderId', 'username email avatar');
        return messages;
    },
    getMessageDetails: async (messageId) => {
        const message = await Message.findById(messageId).populate(
            'senderId',
            'username email avatar'
        );
        return message;
    }
};

export default messageRepository;