import { Inject, Injectable, Logger } from "@nestjs/common";
import { createTransport } from "nodemailer";
import { compile } from "handlebars";
import { ProtocolService } from "./protocol.service";
import { readFile } from "fs/promises";
import path from "path";
import { cwd } from "node:process";
import { PayloadInterface } from "../interfaces/PayloadInterface";
import { Observable } from "rxjs";
import * as fs from "fs";

@Injectable()
export class EmailService {

  public logger: Logger = new Logger("Email.Service");
  private methods = ["send"];
  private emailCredentials = {
    host: "",
    senderEmail: "",
    senderName: "",
    password: ""
  };

  constructor(@Inject("ProtocolService") private protocolService: ProtocolService) {
  }

  public updateSenderDetails() {
    try {
      this.protocolService.sendMessage({
        channel: "db",
        act: "get",
        api: "sql",
        payload: {
          db: `main`,
          channel: `frontend`,
          data: {
            what: `setting`,
            where: {
              isDefault: 1
            },
            limit: [0, 1]
          }
        }
      }).subscribe({
        next: (response: Record<string, any>) => {
          this.setSenderDetails(response.data);
        },
        error: (err) => {
          this.logger.error(err.message);
        },
        complete: () => {
        }
      });
    } catch (err) {
      this.logger.log(err.message);
    }
  }

  private setSenderDetails(data: string) {
    try {
      const details = JSON.parse(data);
      this.emailCredentials.senderEmail = details.emailSender;
      this.emailCredentials.host = details.emailHost || "mail.dosidoweb.com";
      this.emailCredentials.senderName = details.websiteOwner;
      this.emailCredentials.password = details.emailPassword;
    } catch (err) {
      this.logger.error(err.message);
    }
  }

  private send(params: any) {
    return new Observable(() => {
      (async () => {
        try {
          const settings = await this.getSettings();

          if (!settings) {
            return null;
          }

          const transporter = createTransport({
            host: this.emailCredentials.host,
            secure: true,
            auth: {
              user: settings.emailSender,
              pass: settings.emailPassword
            }
          });

          const messageData = await this.compileMessage({
            type: params.type,
            destination: params.destination,
            invoiceNumber: 12345,
            emailInfos: "email test"
            //TODO need further info such as name, price and product
          });

          // Send the email
          const emailResult = await transporter.sendMail({
            from: {
              name: this.emailCredentials.senderName,
              address: this.emailCredentials.senderEmail
            },
            to: {
              name: params.destination.name,
              address: params.destination.address
            },
            subject: messageData.subject,
            html: messageData.body,
            attachments: [{   // stream as an attachment
              filename: "order-preview-icon.png",
              content: fs.createReadStream(__dirname + "../../../src/client/assets/template-icons/order-preview-icon.png"),
              cid: "order-preview-icon"
            },
              {   // stream as an attachment
                filename: "check-icon.png",
                content: fs.createReadStream(__dirname + "../../../src/client/assets/template-icons/check-icon.png"),
                cid: "check-icon"
              },
              {   // stream as an attachment
                filename: "paymentemail-main-image.png",
                content: fs.createReadStream(__dirname + "../../../src/client/assets/template-icons/paymentemail-main-image.png"),
                cid: "paymentemail-main-image"
              },
              {   // stream as an attachment
                filename: "down-icon.png",
                content: fs.createReadStream(__dirname + "../../../src/client/assets/template-icons/down-icon.png"),
                cid: "down-icon"
              }
            ]
          });

          this.logger.log(emailResult);
        } catch (err) {
          this.logger.log(err.message);
          return;
        }
      })();
    });
  }

  async getSettings() {
    const payload: PayloadInterface = {
      channel: `db`,
      api: "sql",
      act: "get",
      payload: {
        db: "main",
        data: {
          what: "setting",
          limit: [0, 1]
        }
      }
    };

    const result = {
      emailSender: "",
      emailPassword: "",
      websiteDomain: "",
      websiteName: ""
    };

    try {
      const res = await this.protocolService.sendMessage(payload).toPromise();
      const data = JSON.parse(res.data);

      result["emailSender"] = data["emailSender"];
      result["emailPassword"] = data["emailPassword"];
      result["websiteDomain"] = data["websiteDomain"];
      result["websiteName"] = data["websiteName"];

      return result;

    } catch (err) {
      this.logger.log(err.message);
    }

    return null;

  }

  private async compileMessage(params: any) {

    const data = {
      subject: "",
      templateFile: "",
      payload: params.payload
    };

    switch (params.type) {
      case "invoice":
        const invoiceNumber = params.invoiceNumber;
        //TODO use translation
        data.subject = `Invoice #${invoiceNumber} for ${params.destination.name}`;
        data.templateFile = "payment.hbs";
        break;
      case "registration":
        data.subject = `Registration confirmation for ${params.destination.name}`;
        data.templateFile = "registration.hbs";
        break;
      case "cancellation":
        data.subject = `Cancellation for ${params.destination.name}`;
        break;
    }

    const templatePath = path.join(cwd(), `emails/${data.templateFile}`);
    const document = await readFile(templatePath, "utf-8");
    const compiledTemplate = compile(document);

    return {
      subject: data.subject,
      body: compiledTemplate(params)
    };
  }

  public perform(data: any) {
    if (this.methods.includes(data.act)) {
      return this[data.act](Object.assign({}, data.payload));
    } else {
      this.logger.log(`Frontend.EmailService.${data.act} not found`);
    }
    return null;
  }

}
