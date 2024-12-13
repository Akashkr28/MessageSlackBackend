import { NEW_MESSAGE_EVENT, NEW_MESSAGE_RECEIVED_EVENT } from "../common/eventConstants.js";
import { createMessageService } from "../services/messageService.js";

export default function messageHandlers(io, socket) {
    socket.on(NEW_MESSAGE_EVENT, async function createMessagehandler(data, cb) {
        const messageResponse = await createMessageService(data);
        socket.broadcast.emit(NEW_MESSAGE_RECEIVED_EVENT, messageResponse);
        cb({
            success: true,
            message: 'Successfully created the message',
            data: messageResponse,
        });
    });
}