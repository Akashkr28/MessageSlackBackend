import "../processors/mailProcessors.js"

import mailQueue from "../queues/mailQueue.js";


export const addEmailtoMailQueue = async (emailData) => {
    console.log('Initiating mail sending process');
    try {
        await mailQueue.add(emailData);
        console.log('Email added to mail queue successfully');
    } catch (error) {
        console.log('Mail Queue Producer Error', error);
    }
}