import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

import { workspaceJoinMail } from '../common/mailObject.js';
import { addEmailtoMailQueue } from '../producers/mailQueueProducer.js';
import channelRepository from '../repositories/channelRepository.js';
import userRepository from '../repositories/userRepository.js';
import workspaceRepository from "../repositories/workspaceRepository.js";
import ClientError from '../utils/errors/clientError.js';
import ValidationError from '../utils/errors/validationError.js';

const isUserAdminOfWorkspace = (workspace, userId) => {
  console.log('Workspace Members:', workspace.members);
  console.log('User ID:', userId);

  if (!workspace.members || !Array.isArray(workspace.members)) {
    console.error('Invalid workspace members format.');
    return false;
  }

  const response = workspace.members.find(
    (member) =>
      member?.membersId?._id?.toString() === userId._id?.toString() &&
      member.role === 'admin'
  );

  console.log('Admin Check Result:', response);
  return !!response; // Return true if a matching admin is found
};

export const isUserMemberOfWorkspace = (workspace, userId) => {
  return workspace.members.find(
    (member) => 
      member.membersId._id.toString() === userId._id?.toString()
  );
}


const isChannelAlreadyPartOfWorkspace = (workspace, channelName) => {
  return workspace.channels.find(
    (channel) => channel.name.toLowerCase() === channelName.toLowerCase()
  );
}

export const createWorkspaceService = async (workspaceData) => {

    try {
        const joinCode = uuidv4().substring(0, 6).toUpperCase();
        const response = await workspaceRepository.create({
            name: workspaceData.name,
            description: workspaceData.description,
            joinCode,
        });
    
        await workspaceRepository.addMemberToWorkspace(
            response._id,
            workspaceData.owner,
            'admin'
        );
    
        const updatedWorkspace = await workspaceRepository.addChannelToWorkspace(
            response._id,
            'general'
        );
    
        return updatedWorkspace;
    } catch (error) {
        console.log('Create workspace service error', error);
        if (error.name === 'ValidationError') {
          throw new ValidationError(
            {
              error: error.errors
            },
            error.message
          );
        }
        if (error.name === 'MongoServerError' && error.code === 11000) {
          throw new ValidationError(
            {
              error: ['A workspace with same details already exists']
            },
            'A workspace with same details already exists'
          );
        }
        throw error;
    }
};

export const getWorkspaceUserIsMemberOfService = async (userId) => {
  try {
    const response = await workspaceRepository.fetchAllWorkspaceByMemberId(userId); 
    return response;
  } catch (error) {
    console.log('Workspace service error', error);
    throw error;
  }
};

export const deleteWorkSpaceService = async (workspaceId, userId) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace does not exist',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    console.log("Workspace Members:", workspace.members);
    console.log("User ID:", userId);

    if (!Array.isArray(workspace.members)) {
      throw new Error("Workspace members is not an array or is undefined");
    }

    const isAllowed = isUserAdminOfWorkspace(workspace, userId);
    
    if(isAllowed) {
      await channelRepository.deleteMany(workspace.channels);
      const response = await workspaceRepository.delete(workspaceId);
      return response;
    }
    throw new ClientError({
      explanation: "User is either not a member or an admin for the worksapace",
      message: "User is not allowed to delete workspace",
      statusCode: StatusCodes.UNAUTHORIZED
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getWorkspaceService = async (workspaceId, userId) => {
 try {
    const workspace = await workspaceRepository.getWorkspaceDetailsById(workspaceId);
    if(!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace does not exist',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isMember = isUserMemberOfWorkspace(workspace, userId);
    if(!isMember) {
      throw new ClientError({
        explanation: 'User is not a member of the workspace',
        message: 'User is not a member of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    return workspace;
 } catch (error) {
    console.log('Get workspace service error', error);
    throw error;
 } 
}

export const getWorkspaceByJoinCodeService = async (joinCode, userId) => {
  try {
    const workspace = await workspaceRepository.getWorkspaceByJoinCode(joinCode);
    if(!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace does not exist',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isMember = isUserMemberOfWorkspace(workspace, userId);
    if(!isMember) {
      throw new ClientError({
        explanation: 'User is not a member of the workspace',
        message: 'User is not a member of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    return workspace;
  } catch (error) {
    console.log('Get workspace by join code service error', error);
    throw error;
  }
}

export const updateWorkspaceService = async (workspaceId, workspaceData, userId) => {
  try {
    const worksapace = await workspaceRepository.getById(workspaceId);
    if(!worksapace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace does not exist',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isAdmin = isUserAdminOfWorkspace(worksapace, userId);
    if(!isAdmin) {
      throw new ClientError({
        explanation: 'User is not an admin of the workspace',
        message: 'User is not an admin of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    const updatedWorkspace = await workspaceRepository.update(workspaceId, workspaceData);
    return updatedWorkspace;
  } catch (error) {
    console.log('Get workspace by join code service error', error);
    throw error;
  }
}

export const resetWorkspaceJoinCodeService = async (workspaceId, userId) => {
  try {
    const newJoinCode = uuidv4().substring(0, 6).toUpperCase();
    const updatedWorkspace = await updateWorkspaceService(workspaceId, {
      joinCode: newJoinCode
    }, userId);
    return updatedWorkspace;
  } catch (error) {
    console.log('Get workspace by join code service error', error);
    throw error;
  }
};

export const addMemberToWorkspaceService = async (workspaceId, membersId, role, userId) => {
  try {

    console.log('Starting addMemberToWorkspaceService');
    console.log('Workspace ID:', workspaceId);
    console.log('Member ID:', membersId);


    const workspace = await workspaceRepository.getById(workspaceId);
    if(!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace does not exist',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if(!isAdmin) {
      throw new ClientError({
        explanation: 'User is not an admin of the workspace',
        message: 'User is not an admin of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    const isValidUser = await userRepository.getById(membersId);
    if(!isValidUser) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'User does not exist',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    console.log('Adding user to workspace...');

    const isMember = isUserMemberOfWorkspace(workspace, membersId);
    if(isMember) {
      throw new ClientError({
        explanation: 'User is already a member of the workspace',
        message: 'User is already a member of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    const response = await workspaceRepository.addMemberToWorkspace(workspaceId, membersId, role);

    addEmailtoMailQueue({
      ...workspaceJoinMail(workspace),
      to: isValidUser.email
    });
    
    
    return response;
  } catch (error) {
    console.log('Add member to workspace service error', error);
    throw error;
  }
}

export const addChannelToWorkspaceService = async (workspaceId, channelName, userId) => {
  try {
    const workspace = await workspaceRepository.getWorkspaceDetailsById(workspaceId);
    if(!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace does not exist',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if(!isAdmin) {
      throw new ClientError({
        explanation: 'User is not an admin of the workspace',
        message: 'User is not an admin of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    const isChannelPartOfWorkspace = isChannelAlreadyPartOfWorkspace(workspace, channelName);
    if(isChannelPartOfWorkspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Channel already part of workspace',
        statusCode: StatusCodes.FORBIDDEN
      });
    }
    const response = await workspaceRepository.addChannelToWorkspace(workspaceId, channelName);
    return response;
  } catch (error) {
    console.log('Add channel to workspace service error', error);
    throw error;
  }
}

export const joinWorkspaceService = async (workspaceId, joinCode, userId) => {
  try {
    const workspace = await workspaceRepository.getWorkspaceDetailsById(workspaceId);

    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace does not exist',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    if(workspace.joinCode !== joinCode) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Invalid join code',
        statusCode: StatusCodes.UNAUTHORIZED
      })
    }

    const updatedworkspace = await workspaceRepository.addMemberToWorkspace(
      workspaceId,
      userId,
      'member'
    );

    return updatedworkspace;

  } catch (error) {
    console.log('Join workspace service error', error);
    throw error;
  }
}