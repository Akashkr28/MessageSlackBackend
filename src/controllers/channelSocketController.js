import { JOIN_CHANNEL } from "../common/eventConstants.js";

export default function messagehandlers(io, socket){
    socket.on(JOIN_CHANNEL, async function joinChannelHandler(data, cb) {
        const roomId = data.channelId;
        socket.join(roomId);
        console.log(`User ${socket.id} joined room: ${roomId}`);
        cb?.({
            success: true,
            message: 'Successfully joined the channel',
            data: roomId
        });
    });
}