import express from "express";

import userRouter from "./users.js";
import workspaceRouter from "./workspaces.js";
import channelRouter from "./channel.js";

const router = express.Router();

router.use('/users', userRouter);

router.use('/workspaces', workspaceRouter)

router.use('/channels', channelRouter)

export default router;