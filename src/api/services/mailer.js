import nodemailer from "nodemailer"
import config from "../../config.js";

export const mailer = nodemailer.createTransport-{
    host: config.emailServer.host,
    port: config.emailServer.port,
    secure: config.emailServer.secure,
    auth:{
        user: config.emailServer.auth.user,
        pass: config.emailServer.auth.pass
    }
}

export default mailer