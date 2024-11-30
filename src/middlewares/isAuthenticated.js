import { StatusCodes } from "http-status-codes";
import { customErrorResponse } from "../common/responseObjects";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.header['x-access-token'];
        if(!token) {
            return res.status(StatusCodes.FORBIDDEN),json(
                customErrorResponse({
                    explanation: 'Invalid data sent from the clinet',
                    message: 'No token provided'
                })
            );
        }
        const response = jwt.verify(token, JWT_SECRET);
    
        if(!response) {
            return res.status(StatusCodes.FORBIDDEN),json(
                customErrorResponse({
                    explanation: 'Invalid data sent from the clinet',
                    message: 'Invalid auth token provided'
                })
            );
        }

        const user = await userRepository.getById(response.id);
        req.user = user;
        next();

    } catch (error) {
        console.log('Auth middleware error', error);
        if(error.name === 'JsonWebTokenError') {
            return res.status(StatusCodes.FORBIDDEN),json(
                customErrorResponse({
                    explanation: 'Invalid data sent from the clinet',
                    message: 'Invalid auth token provided'
                })
            );
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
    }
};