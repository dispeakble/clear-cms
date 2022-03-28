

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require("nodemailer");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const handlebars = require("handlebars");
// eslint-disable-next-line @typescript-eslint/no-var-requires

export async function sendEmail(email, subject: string, payload) {
        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            host: "mail.dosidoweb.com",
            secure: true,
            auth: {
                user: "noreply@dosidoweb.com",
                pass: "9PYG$Bh@Oh3w",
            },
        });
        const _template = 'Hi, {{name}} reset your password by accessing </br> <b>{{link}}</b>'
        const compiledTemplate = handlebars.compile(_template);
        const options = () => {
            return {
                from: "noreply@dosidoweb.com",
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