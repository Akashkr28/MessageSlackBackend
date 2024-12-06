import { StatusCodes } from "http-status-codes";

import { customErrorResponse, internalErrorResponse, successResponse } from "../common/responseObjects.js";
import { createWorkspaceService, deleteWorkSpaceService, getWorkspaceByJoinCodeService } from "../services/workspaceService.js";
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