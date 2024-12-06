import nodemailer from "nodemailer";

import { MAIL_ID, MAIL_PASSWORD } from "./serverConfig.js";

export default nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth:{
        user: MAIL_ID,
        pass: MAIL_PASSWORD
    }
});