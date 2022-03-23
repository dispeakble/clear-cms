

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require("nodemailer");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const handlebars = require("handlebars");
import fs from "fs";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

export async function sendEmail(email, subject: string, payload, template: string) {
    try {
        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "zrouqui.ahmed.az@gmail.com",
                pass: "pass", // naturally, replace both with your real credentials or an application-specific password
            },
        });

        const source = fs.readFileSync(path.join(__dirname, template), "utf8");
        const compiledTemplate = handlebars.compile(source);
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
            if (error) {
                console.log(error)
                return error;
            } else {
                console.log('sent')
                return true;
            }
        });
    } catch (error) {
        return error;
    }
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