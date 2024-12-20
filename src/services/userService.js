import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";

import { createJWT } from "../common/authutils.js";
import userRepository from "../repositories/userRepository.js";
import ClientError from "../utils/errors/clientError.js";
import ValidationError from "../utils/errors/validationError.js";

export const signupService = async (data) => {
    try{
        const newUser = await userRepository.create(data);
        return newUser;        
    } catch (error) {
        console.log("User Service Error", error);
        if (error.name === "ValidationError") {
            throw new ValidationError ({
                error: error.errors,
            },
            error.message
            );
        }
        if(error.name === 'MongoServerError' && error.code === 11000) {
            throw new ValidationError({
                error: ['A user with same email or username already exists'],
            },
            'A user with same email or username already exists'
            );
        }
    }
};

export const signInService = async (data) => {
    try{
        const user = await userRepository.getUserByEmail(data.email);
        if(!user) {
            throw new ClientError({
                explanation: 'Inavalid data sent from the client',
                messgae: 'User does not exist',
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        // match the incoming password with the hashed password
        const isMatch = bcrypt.compareSync(data.password, user.password);
        if(!isMatch) {
            throw new ClientError({
                explanation: 'Inavalid data sent from the client',
                messgae: 'Invalid password, please try again',
                statusCode: StatusCodes.BAD_REQUEST
            });
        }

        return {
            username: user.username,
            avatar: user.avatar,
            email: user.email,
            id: user._id,
            token: createJWT({ id: user._id, email: user.email})
        }
    } catch (error) {
        console.log("User Service Error", error);
    }
}