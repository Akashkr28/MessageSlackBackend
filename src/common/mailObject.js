import { MAIL_ID } from "../config/serverConfig.js";

export const workspaceJoinMail = function (workspace){
    return {
        from: MAIL_ID,
        subject: 'You have been added to a workspace',
        text: `Congratulation You have been added to a workspace by ${workspace.name}`           
    };
};