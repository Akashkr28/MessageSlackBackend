import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

import channelRepository from '../repositories/channelRepository.js';
import workspaceRepository from "../repositories/workspaceRepository.js";
import ClientError from '../utils/errors/clientError.js';
import ValidationError from '../utils/errors/validationError.js';


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

    const isAllowed = workspace.members.find(
      (member) => 
        member?.membersId?.toString() === userId._id?.toString() && member.role === 'admin'
    );
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