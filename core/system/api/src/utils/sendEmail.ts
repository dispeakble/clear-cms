// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require("nodemailer");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const handlebars = require("handlebars");
import * as fs from "fs"
import path from "path"
// eslint-disable-next-line @typescript-eslint/no-var-requires

export async function sendEmail(emailSender,emailSenderPassword, email, subject: string, payload) {
        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            host: "mail.dosidoweb.com",
            secure: true,
            auth: {
                user: emailSender,
                pass: emailSenderPassword,
            },
        });
        const document = fs.readFileSync(path.join(__dirname, './template/password-recover.handlebars'), "utf-8")
        const compiledTemplate = handlebars.compile(document);
        const options = () => {
            return {
                from: emailSender,
                to: email,
                subject: subject,
                html: compiledTemplate(payload),
            };
        };

        // Send email
        transporter.sendMail(options(), (error) => {
            if (error) {
                console.log(error.message)
                return error.message;
            } else {
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