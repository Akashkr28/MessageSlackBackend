import { StatusCodes } from "http-status-codes";

import { customErrorResponse } from "../common/responseObjects.js";

export const validate = (schena) => {
    return async (req, res, next) => {
        try {
            await schena.parseAsync(req.body);
            next();
        } catch (error) {
            let explanation = [];
            let errorMessage = '';
            error.errors.forEach((key) => {
                explanation.push(key.path[0] + ' ' + key.message);
                errorMessage += ' : ' + key.path[0] + ' ' + key.message;
            });
            res.status(StatusCodes.BAD_REQUEST).json(
                customErrorResponse({
                    message: 'Validation error' + errorMessage,
                    explanation: explanation
                })
            );
        }
    };
};