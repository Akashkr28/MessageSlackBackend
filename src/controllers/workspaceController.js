import { StatusCodes } from "http-status-codes";

import { customErrorResponse, internalErrorResponse, successResponse } from "../common/responseObjects.js";
import { createWorkspaceService } from "../services/workspaceService.js"

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