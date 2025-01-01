import cors from "cors";
import express from "express";
import { createServer } from "http";
import { StatusCodes } from "http-status-codes";
import { Server } from "socket.io";

import bullServerAdapter from "./config/bullBoardConfig.js";
import connectDB from "./config/dbConfig.js";
// import mailer from "./config/mailConfig.js";
import { PORT } from "./config/serverConfig.js";
import ChannelSockethandlers from "./controllers/channelSocketController.js";
import MessageSockethandlers from "./controllers/messageSocketController.js";
import { verifyEmailController } from "./controllers/workspaceController.js";
import apiRouter from "./router/apiRouter.js";


const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/ui', bullServerAdapter.getRouter());

app.use('/api', apiRouter);

app.get('/verify/:token', verifyEmailController);

app.get('/ping', (req, res) => {
    return res.status(StatusCodes.OK).json({
        message: "pong"});
});

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    MessageSockethandlers(io, socket);
    ChannelSockethandlers(io, socket);


/*A Setup to send a message to client */   

    // setTimeout(() => {
    //     socket.emit('message', 'This is a message from the server');
    // }, 3000)
});

server.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});