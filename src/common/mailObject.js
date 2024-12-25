import { APP_LINK, MAIL_ID } from "../config/serverConfig.js";

export const workspaceJoinMail = function (workspace){
    return {
        from: MAIL_ID,
        subject: 'You have been added to a workspace',
        text: `Congratulation You have been added to a workspace by ${workspace.name}`           
    };
};

export const verifyEmailMail = function (verificationToken) {
    return {
        from: MAIL_ID,
        subject: 'Welcome to our platform, please verify your email',
        text: `Please verify your email address to get started: ${APP_LINK}/verify/${verificationToken}`
    };
};