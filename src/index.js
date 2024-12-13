import express from "express";
import { createServer } from "http";
import { StatusCodes } from "http-status-codes";
import { Server } from "socket.io";

import bullServerAdapter from "./config/bullBoardConfig.js";
import connectDB from "./config/dbConfig.js";
// import mailer from "./config/mailConfig.js";
import { PORT } from "./config/serverConfig.js";
import MessageSockethandlers from "./controllers/messageSocketController.js";
import ChannelSockethandlers from "./controllers/channelSocketController.js";
import apiRouter from "./router/apiRouter.js";


const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/ui', bullServerAdapter.getRouter());

app.use('/api', apiRouter);

app.get('/ping', (req, res) => {
    return res.status(StatusCodes.OK).json({
        message: "pong"});
});

io.on('connection', (socket) => {
    // console.log('a user connected', socket.id);

    // socket.on('messageFromClient', (data) => {
    //     //To receive a message from client
    //     console.log('Message from Client', data);

    //     //To broadcast a message to all the clients
    //     io.emit('new message', data.toUpperCase());
    // })

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
    // const mailResponse = await mailer.sendMail({
    //     from: 'email.akash2010@gmail.com',
    //     to: 'email.akash2010@gmail.com',
    //     subject: 'Test email',
    //     text: 'This is a test email'
    // });
    // console.log(mailResponse);
});