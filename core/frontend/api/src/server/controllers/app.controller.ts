import { Controller, Get, HttpCode, HttpStatus, Inject, Logger, Post, Request, Res, UseGuards } from "@nestjs/common";
import { EventPattern, MessagePattern, Payload } from "@nestjs/microservices";
import { ModuleInterface } from "../interfaces/module.interface";
import { PayloadInterface } from "../interfaces/PayloadInterface";
import { FsResponse } from "../interfaces/fs.interface";
import { ViewService } from "../services/view.service";
import { Response } from "express";
import { parse } from "url";
import { AuthService } from "../services/auth/auth.service";
import { ProtocolService } from "../services/protocol.service";
import { SystemService } from "../services/system.service";
import { PublicThemesService } from "../services/publicThemes.service";
import { CategoriesService } from "../services/categories.service";
import { UsersService } from "../services/users.service";
import { PagesService } from "../services/pages.service";
import { BucketService } from "../services/bucket.service";
import { HomeSearchPackagesService } from "../services/homeSearch/packages.service";
import { HomeSearchHotelsService } from "../services/homeSearch/hotels.service";
import { HomeSearchFlightsService } from "../services/homeSearch/flights.service";
import { firstValueFrom, lastValueFrom, Observable } from "rxjs";
import { SettingsService } from "../services/settings.service";
import { EmailService } from "../services/email.service";
import { LocalAuthGuard } from "../services/auth/common/guards/local-auth.guard";
import { JwtAuthGuard } from "../services/auth/common/guards/jwt-auth.guard";
import { JwtRtAuthGuard } from "../services/auth/common/guards/jwtRt-auth.guard";
import { JwtUpdateAuthGuard } from "../services/auth/common/guards/jwtUpdate-auth.guard";

@Controller("/")
export class AppController {

  public logger: Logger = new Logger("App.Controller");
  private moduleConfig: ModuleInterface = {
    name: `frontend`,
    version: "22.04.12",
    description: "Frontend Module",
    started: new Date(),
    config: {
      restart: true,
      stop: false
    },
    dependencies: [{
      name: `hub`,
      version: "latest"
    }, {
      name: `frontendproxy`,
      version: "latest"
    }]
  };

  private state: any = {
    ready: false
  };

  constructor(
    @Inject("ProtocolService") private protocolService: ProtocolService,
    @Inject("SystemService") private systemService: SystemService,
    @Inject("SettingsService") private settingsService: SettingsService,
    @Inject("PublicThemesService") private publicThemesService: PublicThemesService,
    @Inject("CategoriesService") private categoriesService: CategoriesService,
    @Inject("PagesService") private pagesService: PagesService,
    @Inject("BucketService") private bucketService: BucketService,
    @Inject("HomeSearchPackagesService") private homeSearchPackagesService: HomeSearchPackagesService,
    @Inject("HomeSearchFlightsService") private homeSearchFlightsService: HomeSearchFlightsService,
    @Inject("HomeSearchHotelsService") private homeSearchHotelsService: HomeSearchHotelsService,
    @Inject("EmailService") private emailService: EmailService,
    @Inject("AuthService") private authService: AuthService,
    @Inject("UsersService") private usersService: UsersService,
    @Inject("WsGateway") private wsGateway,
    private viewService: ViewService
  ) {
    this.state.ready = true;
  }

  @MessagePattern({ message: `${process.env.app}_frontend` })
  public onRedisMessage(@Payload() data: PayloadInterface) {
    return this.perform(data);
  }

  @EventPattern({ event: `${process.env.app}_frontend` })
  public onRedisEvent(@Payload() payload: PayloadInterface) {
    return this.perform(payload);
  }

  async onApplicationBootstrap() {
    await this.protocolService.start();

    const reg_msg = await this.systemService.registerModule(this.moduleConfig);
    this.logger.log(reg_msg);
    const port_map_msg = await firstValueFrom(this.protocolService.sendMessage({
      channel: `hub`,
      api: "module",
      act: "mapPort",
      payload: {
        channel: `frontend`,
        target: `frontendproxy`,
        port: process.env.backend_port,
        defaults: {
          url: "/"
        }
      }
    }));

    this.logger.log(port_map_msg);

    this.wsGateway.registerCallbacks({
      callbacks: {
        "onMessage": async (params) => {
          const response = await this.onWsMessage(params.data);
          return response;
        }
      }
    });

    this.emailService.updateSenderDetails();

    this.logger.log("Frontend api application started");
  }

  private onWsMessage(params) {
    try {
      return lastValueFrom(this.perform(params.data));
    } catch (err) {
      this.logger.log(err);
      return null;
    }
  }

  @Get("_next*")
  public async assets(@Request() req, @Res() res: Response) {
    await this.viewService.handler(req, res);
  }


  @Get("files/*")
  public async getFiles(@Request() req, @Res() res: Response) {
    req.params[0] = `files/${req.params[0]}`;
    const fileReq = {
      channel: `frontend`,
      payload: {
        ip: req.ip,
        hostname: req.hostname,
        params: req.params,
        headers: req.headers,
        query: req.query
      }
    };

    const fileStats = await this.bucketService.getMeta(fileReq.payload);
    if (!fileStats) {
      res.status(HttpStatus.NOT_FOUND);//TODO ADD A 404 PAGE
      res.end();
      return;
    }

    const getSubscriber = this.bucketService.get(fileReq.payload);


    let bigBuffer = Buffer.alloc(0);
    const file_meta = {
      content_length: 0,
      content_type: ""
    };

    getSubscriber.subscribe({
      next: (data: FsResponse) => {
        try {
          switch (data.type) {
            case "meta":
              res.status(HttpStatus.OK);
              AppController.filesResponse({ res, file: data, fileStats });

              file_meta.content_type = data.content_type;
              file_meta.content_length = data.content_length;
              break;
            case "Buffer":
              bigBuffer = Buffer.concat([bigBuffer, Buffer.from(data.data)]);
              res.write(Buffer.from(data.data));
              break;
          }
        } catch (err) {
          this.logger.log(err);
        }

      }, error: (error) => {
        this.logger.log(error);
        res.status(HttpStatus.NOT_FOUND);
        res.end();
      }, complete: () => {
        res.end();
      }
    });
  }

  @UseGuards(LocalAuthGuard)
  @Post("api/auth/login")
  @HttpCode(HttpStatus.OK)
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get("api/user/profile")
  async getProfile(@Request() req) {
    return await this.authService.getProfile(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post("api/auth/logout")
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req) {
    return await this.authService.logout(req.user);
  }

  @UseGuards(JwtUpdateAuthGuard)
  @Post("api/user/update")
  @HttpCode(HttpStatus.OK)
  async update(@Request() req) {
    if (req.user) {
      return await this.authService.update(req.body, req.user);
    }
    return HttpStatus.FORBIDDEN;
  }

  @UseGuards(JwtAuthGuard)
  @Post("/api/user/checkPassword")
  @HttpCode(HttpStatus.OK)
  async checkPassword(@Request() req) {
    if (req.user) {
      return await this.authService.checkPassword(req.body, req.user);
    }
    return HttpStatus.FORBIDDEN;
  }

  @UseGuards(JwtAuthGuard)
  @Post("/api/user/updatePassword")
  @HttpCode(HttpStatus.OK)
  async updatePassword(@Request() req) {
    if (req.user) {
      return await this.authService.updatePassword(req.body, req.user);
    }
    return HttpStatus.FORBIDDEN;
  }

  @UseGuards(JwtRtAuthGuard)
  @Post("api/auth/refresh")
  @HttpCode(HttpStatus.OK)
  async refresh(@Request() req) {
    return await this.authService.refreshTokens(req.user);
  }

  @Get("api/auth/recaptcha")
  @HttpCode(HttpStatus.OK)
  async isHuman(@Request() req) {
    return await this.authService.isHuman(req.query.token);
  }

  @Get("api/*")
  public async apiGet(@Request() req) {
    const parts = req.url.slice(1).split("/");
    return await lastValueFrom(this.perform({
      channel: `frontend`,
      api: parts[1],
      act: parts[2]
    }));
  }

  @Post("api/*")
  public async apiPost(@Request() req) {
    const parts = req.url.slice(1).split("/");
    return await lastValueFrom(this.perform({
      channel: `frontend`,
      api: parts[1],
      act: parts[2],
      payload: req.body
    }));
  }

  @Get("*")
  public async showHome(@Request() req, @Res() res: Response) {
    const url = parse(req.url, true);
    await this.viewService.handler(req, res, url);
  }

  private static filesResponse(params) {
    const { res, file, fileStats } = params;
    res.set("Content-Type", file.content_type);
    res.set("Content-Length", file.content_length);
    res.set("Content-Security-Policy", "img-src 'self'; default-src 'self'; script-src 'self'; style-src 'unsafe-inline' 'self' https://fonts.googleapis.com *.fontawesome.com; font-src 'self' data: https://fonts.gstatic.com *.fontawesome.com");
    res.set("X-Frame-Options", "SAMEORIGIN");
    res.set("X-Content-Type-Options", "nosniff");
    res.set("Strict-Transport-Security", "max-age=604800; includeSubDomains; preload");
    res.set("Cache-Control", "public, max-age=604800");
    res.set("ETag", fileStats.data.etagId);
    res.status(HttpStatus.OK);
    if (params.finish) {
      res.write(Buffer.from(file.data.data));
      res.end();
    }
  }

  private perform(params: PayloadInterface) {
    try {

      if (!this.state.ready) {
        return new Observable((subscriber) => {
          subscriber.next({
            data: "not ready"
          });
        });
      }

      const callback = (response) => {
        return this.perform(response);
      };

      params.payload = Object.assign({}, params.payload, { perform: callback });
      return this[params.api + "Service"].perform(params, this.moduleConfig);

    } catch (ex) {
      return {
        error: "Could not find " + params.api + ":" + params.act
      };
    }
  }

}
