

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require("nodemailer");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const handlebars = require("handlebars");
// eslint-disable-next-line @typescript-eslint/no-var-requires
import fs = require('fs');
import path = require('path');

export async function sendEmail(email, subject: string, payload) {
        console.log("---- 1");
        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "cms.clear.mail@gmail.com",
                pass: "Test123*-", // naturally, replace both with your real credentials or an application-specific password
            },
        });
        const _template = 'Hi, {{name}} reset your password by accessing </br> <b>{{link}}</b>'
        const compiledTemplate = handlebars.compile(_template);
        const options = () => {
            return {
                from: "zrouqui.ahmed.az@gmail.com",
                to: email,
                subject: subject,
                html: compiledTemplate(payload),
            };
        };

        // Send email
        transporter.sendMail(options(), (error, info) => {
            console.log("entered 2")
            if (error) {
                console.log(error)
                return error;
            } else {
                console.log('sent')
                return true;
            }
        });
}

/*
Example:
sendEmail(
  "youremail@gmail.com,
  "Email subject",
  { name: "Eze" },
  "./templates/layouts/main.handlebars"
);
*/