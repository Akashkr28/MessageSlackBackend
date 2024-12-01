import { StatusCodes } from "http-status-codes";
import Workspace from "../schema/workspaceSchema.js";
import User from "../schema/user.js";
import crudRepository from "./crudRepository.js";
import ClientError from "../utils/clientError.js";
import channelRepository from "./channelRepository.js";

const workspaceRepository = {
    ...crudRepository(Workspace),
    getWorkspaceByName: async function (workspaceName) {
        const workspace = await Workspace.findOne({ 
            name: workspaceName 
        });
        if(!workspace) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'Workspace does not exist',
                statusCode: StatusCodes.NOT_FOUND
            })
        }
        return workspace;
    },
    getWorkspaceByJoinCode: async function (joinCode) {
        const workspace = await Workspace.findOne({ 
            joinCode 
        });
        if(!workspace) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'Workspace does not exist',
                statusCode: StatusCodes.NOT_FOUND
            })
        }
        return workspace;
    },
    addMemberToWorkspace: async function (workspaceId, membersId, role) {
        const workspace = await Workspace.findById(workspaceId);

        if(!workspace) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'Workspace does not exist',
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        const isMemberAlreadyPartOfWorkspace = workspace.members.find((member) => member.membersId === membersId);

        if(isMemberAlreadyPartOfWorkspace) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'User already part of workspace',
                statusCode: StatusCodes.FORBIDDEN
            });
        }

        const isValidUser = await User.findById(membersId);
        if(!isValidUser){
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'Workspace does not exist',
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        workspace.members.push({
            membersId,
            role
        });

        await workspace.save();

        return workspace;
    },
    addChannelToWorkspace: async function (workspaceId, channelName) {
        const workspace = await Workspace.findById(workspaceId).populate('channels');

        if(!workspace){
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'Workspace does not exist',
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        const isChannelAlreadyPartofWorkspace = workspace.channels.find(
            (channel) => channel.name === channelName
        );

        if(isChannelAlreadyPartofWorkspace){
            throw new ClientError({
                explanation: 'Invalid data sent from client',
                message: 'Channel already part of workspace',
                statusCode: StatusCodes.FORBIDDEN
            });
        }

        const channel = await channelRepository.create({name: channelName});

        workspace.channels.push(channel);
        await workspace.save();

        return workspace;
    },
    fetchAllWorkspaceByMemberId: async function (membersId) {
        const workspaces = await Workspace.find({
            'members.membersId': membersId
        }).populate('members.membersId', 'username email avatar')
        return workspaces;
    }
};

export default workspaceRepository;