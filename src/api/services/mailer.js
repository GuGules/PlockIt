const nodemailer = require("nodemailer");
const config = require("../../config");

const mailer = nodemailer.createTransport-{
    host: config.emailServer.host,
    port: config.emailServer.port,
    secure: config.emailServer.secure,
    auth:{
        user: config.emailServer.auth.user,
        pass: config.emailServer.auth.pass
    }
}

module.exports = { mailer };