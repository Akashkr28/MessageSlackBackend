import { StatusCodes } from "http-status-codes";
import channelRepository from "../repositories/channelRepository.js";
import ClientError from "../utils/errors/clientError.js";
import { isUserMemberOfWorkspace } from "./workspaceService.js";

export const getChannelByIdService = async (channelId, userId) => {
    try {
        const channel = await channelRepository.getChannelwithWorkspaceDetails(channelId);

        console.log(channel);

        if(!channel || !channel.workspaceId) {
            throw new ClientError({
                explanation: 'Channel not found with the provided ID',
                message: 'Channel does not exist',
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        const isUserPartOfWorkspace = isUserMemberOfWorkspace(channel.workspaceId, userId);

        if(!isUserPartOfWorkspace) {
            throw new ClientError({
                explanation: 'User is not a member of the workspace and hence cannot access the channel',
                message: 'User is not a member of the workspace',
                statusCode: StatusCodes.UNAUTHORIZED
            });
        }

        return channel;       
    } catch (error) {
        console.log('Get channel by id service error', error);
        throw error;
    }
}