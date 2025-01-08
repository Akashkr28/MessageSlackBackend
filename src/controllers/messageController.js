import { StatusCodes } from "http-status-codes";

import { customErrorResponse, internalErrorResponse, successResponse } from "../common/responseObjects.js";
import { s3 } from "../config/awsConfig.js";
import { AWS_BUCKET_NAME } from "../config/serverConfig.js";
import { getMessagesService } from "../services/messageService.js";

export const getMessages = async (req, res) => {
    try {
        const messages = await getMessagesService(
            {
            channelId: req.params.channelId,
            },
            req.query.page || 1,
            req.query.limit || 20,
            req.user
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

export const getPresignedUrlFromAWS = async (req, res) => {
    try {
        const url = await s3.getSignedUrlPromise('putObject', {
            Bucket: AWS_BUCKET_NAME,
            Key: `${Date.now()}`,
            Expires: 60, // 1 Minute
        });
        return res
            .status(StatusCodes.OK)
            .json(successResponse(url, "Presigned url fetched successfully"));
    } catch (err) {
        console.log('Error in getPresignedUrlFromAWS', err);
        if(err.statusCode){
            return res.status(err.statusCode).json(customErrorResponse(err));
        }
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(err));
    }
}