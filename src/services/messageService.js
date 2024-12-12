import messageRepository from "../repositories/messageRepository.js"
import channelRepository from "../repositories/channelRepository.js"
import { isUserMemberOfWorkspace } from "./workspaceService.js";
import { StatusCodes } from "http-status-codes";
import ClientError from "../utils/errors/clientError.js";

export const getMessagesService = async (messageParams, page, limit, user)  => {

    const channelDetails = await channelRepository.getChannelwithWorkspaceDetails(messageParams.channelId);

    const workspace = channelDetails.workspaceId;

    const isMember = isUserMemberOfWorkspace(workspace, user);

    const (!isMember) {
        throw new ClientError({
            explanation: 'User is not a member of the workspace',
            message: 'User is not a member of the workspace',
            statusCode: StatusCodes.UNAUTHORIZED
        })
    }

    const messages = await messageRepository.getPaginatedMessages(messageParams, page, limit);
    return messages;
};