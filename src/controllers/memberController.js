import { StatusCodes } from "http-status-codes";
import { customErrorResponse, internalErrorResponse, successResponse } from "../common/responseObjects.js";
import { isMemberPartOfWorksaceService } from "../services/memberService.js";

export const isMemberPartOfWorkspaceController = async function (req, res) {
    try {
        const response = await isMemberPartOfWorksaceService(req.params.workspaceId, req.user);

        return res
            .status(StatusCodes.OK)
            .json(successResponse(response, "User is a member of the workspace"));
    } catch (error) {
        console.log('User Controller Error', error);
        if(error.statusCode){
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
    }
}