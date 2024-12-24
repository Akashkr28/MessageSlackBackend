import { StatusCodes } from "http-status-codes";

import { customErrorResponse, internalErrorResponse, successResponse } from "../common/responseObjects.js";
import { addChannelToWorkspaceService, addMemberToWorkspaceService, createWorkspaceService, deleteWorkSpaceService, getWorkspaceByJoinCodeService, joinWorkspaceService, resetWorkspaceJoinCodeService, updateWorkspaceService } from "../services/workspaceService.js";
import { getWorkspaceUserIsMemberOfService } from "../services/workspaceService.js";
import { getWorkspaceService } from "../services/workspaceService.js";

export const createWorkspaceController = async (req, res) => {
    try {
        const response = await createWorkspaceService({
            ...req.body,
            owner: req.user
        });
        return res
            .status(StatusCodes.CREATED)
            .json(successResponse(response, "Workspace created successfully"));
    } catch (error) {
        console.log(error);
        if(error.statusCode){
            return res
            .status(error.statusCode)
            .json(customErrorResponse(error));
        }
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
    }
};

export const getWorkspaceUserIsMemberOfController = async (req, res) => {
    try {
        const response = await getWorkspaceUserIsMemberOfService(req.user);
        return res
            .status(StatusCodes.OK)
            .json(successResponse(response, "Workspace fetched successfully"));
    } catch (error) {
        console.log(error);
        if(error.statusCode){
            return res.status(error.statusCode).json(customErrorResponse(error));
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
    }
};

export const deleteWorkSpaceController = async (req, res) => {
    try {
        const response = await deleteWorkSpaceService(
            req.params.workspaceId,
            req.user
        );
        return res
            .status(StatusCodes.OK)
            .json(successResponse(response, "Workspace deleted successfully"));
    } catch (error) {
        console.log(error);
        if(error.statusCode){
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
    }
    

}

export const getWorkspaceController = async (req, res) => {
    try {
        const response = await getWorkspaceService(
            req.params.workspaceId,
            req.user
        );
        return res
            .status(StatusCodes.OK)
            .json(successResponse(response, "Workspace get successfully"));
    } catch (error) {
        console.log('Get workspace controller error', error);
        if(error.statusCode){
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
    }
}


export const getWorkspaceByJoinCodeController = async (req, res) => {
    try {
        const response = await getWorkspaceByJoinCodeService(
            req.params.joinCode,
            req.user
        );
        return res
            .status(StatusCodes.OK)
            .json(successResponse(response, "Workspace joincode fetched successfully"));
    } catch (error) {
        console.log('Get workspace by join code controller error', error);
        if(error.statusCode){
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
    }
}

export const updateWorkspaceController = async (req, res) => {
    try {
        const response = await updateWorkspaceService(
            req.params.workspaceId,
            req.body,
            req.user
        );
        return res
            .status(StatusCodes.OK)
            .json(successResponse(response, "Workspace updated successfully"));
    } catch (error) {
        console.log('Update workspace controller error', error);
        if(error.statusCode){
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
    }
}

export const addMemberToWorkspaceController = async (req, res) => {
    try {
        // Debugging: Log request details
        console.log('Received request:');
        console.log('Workspace ID:', req.params.workspaceId);
        console.log('Request body:', req.body);
        console.log('Authenticated user:', req.user);

        const membersId = req.body.membersId || req.body.memberId;
        const role = req.body.role || 'member';

        if (!membersId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'membersId is required',
                statusCode: StatusCodes.BAD_REQUEST,
            });
        }

        const response = await addMemberToWorkspaceService(
            req.params.workspaceId,
            membersId,
            role,
            req.user
        );
        return res
            .status(StatusCodes.OK) 
            .json(successResponse(response, "Member added successfully"));
    } catch (error) {
        console.log('Add member to workspace controller error', error);
        if(error.statusCode){
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        return res        
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
    }
}

export const addChannelToWorkspaceController = async (req, res) => {
    try {
      const response = await addChannelToWorkspaceService(
        req.params.workspaceId,
        req.body.channelName,
        req.user
      );
      return res
        .status(StatusCodes.OK)
        .json(
          successResponse(response, 'Channel added to workspace successfully')
        );
    } catch (error) {
      console.log('add channel to workspace controller error', error);
      if (error.statusCode) {
        return res.status(error.statusCode).json(customErrorResponse(error));
      }
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(internalErrorResponse(error));
    }
};

export const resetJoinCodeController = async (req, res) => {
    try {
        const response = await resetWorkspaceJoinCodeService(
            req.params.workspaceId,
            req.user
        );
        return res
            .status(StatusCodes.OK)
            .json(successResponse(response, "Join code reset successfully"));
    } catch (error) {
        console.log('Reset join code controller error', error);
        if(error.statusCode){
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
    }
}

export const joinWorkspaceController = async (req, res) => {
    try {
        const response = await joinWorkspaceService(
            req.params.workspaceId,
            req.body.joinCode,
            req.user
        );
        return res
            .status(StatusCodes.OK)
            .json(successResponse(response, "Workspace joined successfully"));
    } catch (error) {
        console.log('Join workspace controller error', error);
        if(error.statusCode){
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
    }
}