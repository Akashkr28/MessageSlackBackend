import { StatusCodes } from "http-status-codes";

import { customErrorResponse, internalErrorResponse, successResponse } from "../common/responseObjects.js";
import { getMessagesService } from "../services/messageService.js";

export const getMessages = async (req, res) => {
    try {
        const messages = await getMessagesService(
            {
            channelId: req.params.channelId,
            },
            req.query.page || 1,
            req.query.limit || 20
        );

        return res
            .status(StatusCodes.OK)
            .json(successResponse(messages, "Messages fetched successfully"));
    } catch (error) {
        console.log('Message controller error', error);
        if(error.statusCode){
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
    }
}