import { Injectable } from "@nestjs/common";
import { ModuleInterface } from "../interfaces/module.interface";
import { ProtocolService } from "./protocol.service";
import { payloadInterface } from "../interfaces/payload.interface";
import { RedisCacheService } from "../cache/redisCache.service";
import * as crypto from "crypto";

@Injectable()
export class ModuleService {

  private methods = ["register", "mapPort", "getPort", "getChannel", "checkModules"];
  private modules = {};
  private moduleStatus = {};

  constructor(
    private protocolService: ProtocolService,
    private cacheService: RedisCacheService) {
    this.modules[`${process.env.app}_hub`] = {
      version: "version",
      description: `The main hub for ${process.env.app}`,
      started: new Date(),
      dependencies: []
    };
  }

  public async checkModules() {

    const modules = ['frontend', 'frontendproxy', 'adminproxy', 'system', 'bucket', 'db'];

    setInterval(() => {
      modules.map(async (module) => {
        const pingResponse = await this.pingModule({
          name: module
        });

        if(!pingResponse) {
          delete this.modules[`${process.env.app}_${module}`];
        } else {
          this.modules[`${process.env.app}_${module}`] = {
            version: pingResponse.version,
            description: '',
            started: new Date(),
            dependencies: []
          };
        }
      })
    }, 3000)

  }

  private pingModule = (dep) => {
    return new Promise<any>(async (resolve_ping) => {
      try {
        setTimeout(() => {
          resolve_ping(null);
        }, 1000);

        const payload: payloadInterface = {//todo export this globally. lazy load
          api: "protocol",
          act: "ping",
          channel: `${process.env.app}_hub`,
          payload: dep
        };

        const module_response = await this.protocolService.sendMessage({
          channel: `${process.env.app}_${dep.name}`,
          payload: payload
        });
        resolve_ping(module_response);
      } catch (ex) {
        resolve_ping(null);
      }
    })
  }

  private async register(params: ModuleInterface) {

    //

    this.moduleStatus[params.name] = this.moduleStatus[params.name] || { tries: 0 };

    this.moduleStatus[params.name].tries++;

    if (this.moduleStatus[params.name].tries >= 10) {
      const moduleRegistrationFailed = {
        status: "failed",
        resolution: {
          action: "stop"
        },
        reason: "retry count exceeded for " + params.name,
        data: null
      };

      this.moduleStatus[params.name].tries = 0;

      return moduleRegistrationFailed;
    }

    const missingDeps = [];
    let moduleAction = "";

    if (!params.dependencies) {
      const moduleRegistrationFailed = {
        status: "succeeded",
        resolution: {
          action: "start",
          after: 1
        },
        reason: "missing dependencies",
        data: missingDeps
      };
      return moduleRegistrationFailed;
    }

    await Promise.all(params.dependencies.map(async (dep) => {
      if (!this.modules.hasOwnProperty(dep.name)) {
        moduleAction = "retry";
        console.log("could not find " + dep.name + " in this.modules.");
        missingDeps.push(dep);
        return dep;
      }


      try {
        const pingResponse = await this.pingModule(dep);

        if (!pingResponse) {
          moduleAction = "retry";
        } else if (pingResponse.version === dep.version) {
          //console.log('found module: ' + pingResponse.name + '@' + pingResponse.version)
        } else if (dep.version === "latest") {
          //console.log('using ' + pingResponse.name + '@' + pingResponse.version + ' as latest ')
          dep.version = pingResponse.version;
        } else {
          //console.log('could not find ' + dep.name + ':' + dep.version);
          //console.log('got instead ' + pingResponse.name + '@' + pingResponse.version);
          dep.version = pingResponse.version;
          moduleAction = "restart";
          missingDeps.push({
            name: dep.name,
            version: pingResponse.version,
            requestedVersion: dep.version
          });
        }
      } catch (ex) {
        console.log(ex);
      }


    }));

    if (missingDeps.length === 0) {

      this.moduleStatus[params.name].tries = 0;

      this.modules[params.name] = {
        version: params.version,
        description: params.description,
        started: params.started,
        dependencies: params.dependencies
      };

      const moduleRegistrationSucceeded = {
        status: "registered",
        data: this.modules[params.name]
      };

      if (params.config.createdDatabases && params.config.createdDatabases) {
        (setTimeout(() => {
          ;(async () => {
            await this.seedInitialData(params.config.createdDatabases);
          })()
        }, 1000))
      }

      return moduleRegistrationSucceeded;
    } else {
      const moduleRegistrationFailed = {
        status: "failed",
        resolution: {
          action: moduleAction,
          after: 1
        },
        reason: "missing dependencies",
        data: missingDeps
      };
      return moduleRegistrationFailed;
    }

  }

  async seedInitialData(createdDatabases: string[]) {
    if (!createdDatabases || !createdDatabases.length || !process.env.admin_email) {
      return false;
    }

    const adminPayload = {
      channel: `${process.env.app}_db`,
      payload: {
        api: "sql",
        act: "add",
        payload: {
          data: {
            db: 'main',
            what: "auth",
            data: {
              fullname: `${process.env.admin_fname} ${process.env.admin_lname}`,
              fname: process.env.admin_fname,
              lname: process.env.admin_lname,
              email: process.env.admin_email,
              password: crypto.createHash('md5').update(process.env.admin_password).digest("hex"),
              active: 1
            }
          }
        }
      }
    };

    try {
      const newAdminResponse = await this.protocolService.sendMessage(adminPayload);
    } catch (err) {
      console.log(err);
    }

    const defaultSettings = {
      "websiteName": process.env.website_name,
      "websiteDomain": process.env.website_domain,
      "websiteOwner": `${process.env.admin_fname} ${process.env.admin_lname}`,
      "websiteAdminEmail": process.env.website_email,
      "applicationVersion": process.env.app_version,
      "emailSender": "admin@localhost.local",
      "emailPassword": "1qaz",
      "colorScheme": {
        primaryColor: "#DC6B03",
        primaryColorRBG: "220, 107, 3",
        primaryColorFadedRBG: "252, 232, 221",
        primaryDark: "orange",
        primaryLight: "#FF9F5A",
        primaryColorHover: "#FC8C25",
        primaryRed: "#DC0303",
        secondaryColor: "#FF0000",
        accentColor: "#f39200",
        darkRed: "#E90000",
        jetBlack: "#333",
        black: "#000",
        offWhite: "#f5f5f5",
        white: "#fff",
        gray: "#505050",
        mainBackground: "#E5E5E5",
        footerLinks: "#868484",
        greyBorder: "#ACACAC",
        borderOutline: "#DBDBDB"
      },
      "selectedTheme": "V1"
    };

    const test = {
      "websiteName": "Mario Viajes",
      "websiteDomain": "marioviajes.com",
      "websiteOwner": "Mario Viajes Mario Viajes",
      "websiteAdminEmail": "contact@marioviajes.com",
      "applicationVersion": "1.5.0",
      "emailSender": "admin@localhost.local",
      "emailPassword": "1qaz",
      "colorScheme": {
        "primaryColor": { "label": "Primary Color", "value": "#9c1b90" },
        "primaryColorRBG": { "label": "Primary Color RBG", "value": { "r": 220, "g": 107, "b": 3 } },
        "primaryColorFadedRBG": { "label": "Primary Color Faded RBG", "value": { "r": 252, "g": 232, "b": 221 } },
        "primaryDark": { "label": "Primary Dark", "value": "orange" },
        "primaryLight": { "label": "Primary Light", "value": "#FF9F5A" },
        "primaryColorHover": { "label": "Primary Color Hover", "value": "#FC8C25" },
        "primaryRed": { "label": "Primary Red", "value": "#DC0303" },
        "secondaryColor": { "label": "Secondary Color", "value": "#FF0000" },
        "accentColor": { "label": "Accent Color", "value": "#f39200" },
        "darkRed": { "label": "Dark Red", "value": "#E90000" },
        "jetBlack": { "label": "Jet Black", "value": "#333" },
        "black": { "label": "Black", "value": "#000" },
        "offWhite": { "label": "Off White", "value": "#f5f5f5" },
        "white": { "label": "White", "value": "#fff" },
        "gray": { "label": "Gray", "value": "#505050" },
        "mainBackground": { "label": "Main Background", "value": "#E5E5E5" },
        "footerLinks": { "label": "Footer Links", "value": "#868484" },
        "greyBorder": { "label": "Grey Border", "value": "#ACACAC" },
        "borderOutline": { "label": "Border Outline", "value": "#DBDBDB" }
      },
      "selectedTheme": "V1"
    };

    const settingsPayload = {
      channel: `${process.env.app}_db`,
      payload: {
        api: "sql",
        act: "add",
        payload: {
          data: {
            db: 'main',
            what: "setting",
            data: {
              isDefault: 1,
              data: JSON.stringify(defaultSettings)
            }
          }
        }
      }
    };

    try {
      const newSettingsResponse = await this.protocolService.sendMessage(settingsPayload);

    } catch (err) {
      console.log(err);
    }

    const boxes = [
      [8, 'New Box', 'RAM Module', 1, '#959595', 10, 14, 1, '{"data":""}', 11, 28, 0],
      [9, 'New Box', 'NET Module', 1, '#818181', 10, 14, 1, '{"data":""}', 11, 42, 0],
      [3, '123', 'Admin Activity Module',  1, '#959595', 10, 56, 11, '{"data":""}', 0, 0, 0],
      [7, 'New Box', 'CPU Module', 1, '#7e7e7e', 10, 14, 1, '{"data":""}', 11, 14, 0],
      [6, 'New Box', 'Clock Module', 1, '#7a7a7a', 10, 14, 1, '{"data":""}', 11, 0, 0],
    ];



    const addDoashboardBox = async (box) => {
      const boxPayload = {
        channel: `${process.env.app}_db`,
        payload: {
          api: "sql",
          act: "add",
          payload: {
            data: {
              db: 'main',
              what: 'dashboardBox',
              data: {
                id: box[0],
                title: box[1],
                module: box[2],
                borderWidth: box[3],
                borderColor: box[4],
                borderRadius: box[5],
                height: box[6],
                width: box[7],
                moduleOptions: box[8],
                x: box[9],
                y: box[10],
                scrollbar: box[11]
              }
            }
          }
        }
      };

      try {
        const newBoxResponse = await this.protocolService.sendMessage(boxPayload);
        return newBoxResponse;
      } catch (err) {
        console.log(err);
      }
    }

    await Promise.all(boxes.map(box => {
      return addDoashboardBox(box);
    }));

    const darkTheme = {title: 'Dark theme', isDefault: 1, data: '{"common":{"black":"rgba(230, 225, 225, 1)","white":"rgba(161, 161, 161, 1)"},"type":"light","primary":{"light":"rgba(146, 146, 146, 1)","main":"rgba(110, 110, 110, 1)","dark":"rgba(185, 185, 185, 1)","contrastText":"rgba(53, 53, 53, 1)"},"secondary":{"light":"rgba(202, 201, 202, 1)","main":"rgba(136, 136, 136, 1)","dark":"rgba(24, 24, 24, 1)","contrastText":"rgba(207, 205, 205, 1)"},"error":{"light":"rgba(194, 122, 122, 1)","main":"rgba(136, 102, 99, 1)","dark":"rgba(122, 10, 10, 1)","contrastText":"rgba(189, 156, 156, 1)"},"warning":{"light":"#ffb74d","main":"#ff9800","dark":"#f57c00","contrastText":"rgba(0, 0, 0, 0.87)"},"info":{"light":"#64b5f6","main":"#2196f3","dark":"#1976d2","contrastText":"#fff"},"success":{"light":"#81c784","main":"#4caf50","dark":"#388e3c","contrastText":"rgba(0, 0, 0, 0.87)"},"grey":{"50":"#fafafa","100":"#f5f5f5","200":"#eeeeee","300":"#e0e0e0","400":"#bdbdbd","500":"#9e9e9e","600":"#757575","700":"#616161","800":"#424242","900":"#212121","A100":"#d5d5d5","A200":"#aaaaaa","A400":"#303030","A700":"#616161"},"contrastThreshold":3,"tonalOffset":0.2,"text":{"primary":"rgba(184, 180, 180, 0.87)","secondary":"rgba(0, 0, 0, 0.54)","disabled":"rgba(0, 0, 0, 0.38)","hint":"rgba(0, 0, 0, 0.38)"},"divider":"rgba(0, 0, 0, 0.12)","background":{"paper":"rgba(131, 131, 131, 1)","default":"rgba(63, 61, 61, 1)"},"action":{"active":"rgba(0, 0, 0, 0.54)","hover":"rgba(0, 0, 0, 0.04)","hoverOpacity":0.04,"selected":"rgba(0, 0, 0, 0.08)","selectedOpacity":0.08,"disabled":"rgba(0, 0, 0, 0.26)","disabledBackground":"rgba(0, 0, 0, 0.12)","disabledOpacity":0.38,"focus":"rgba(0, 0, 0, 0.12)","focusOpacity":0.12,"activatedOpacity":0.12}}'};
    const dayTheme = {title: 'Day theme', isDefault: 0, data: '{"common":{"black":"#000","white":"#fff"},"type":"light","primary":{"light":"#7986cb","main":"rgba(56, 160, 160, 1)","dark":"#303f9f","contrastText":"#fff"},"secondary":{"light":"rgba(241, 188, 145, 1)","main":"rgba(240, 126, 55, 1)","dark":"rgba(151, 81, 36, 1)","contrastText":"rgba(238, 238, 238, 1)"},"error":{"light":"rgba(241, 180, 180, 1)","main":"rgba(201, 68, 58, 1)","dark":"rgba(156, 26, 26, 1)","contrastText":"#fff"},"warning":{"light":"#ffb74d","main":"#ff9800","dark":"#f57c00","contrastText":"rgba(0, 0, 0, 0.87)"},"info":{"light":"#64b5f6","main":"#2196f3","dark":"#1976d2","contrastText":"#fff"},"success":{"light":"#81c784","main":"#4caf50","dark":"#388e3c","contrastText":"rgba(0, 0, 0, 0.87)"},"grey":{"50":"#fafafa","100":"#f5f5f5","200":"#eeeeee","300":"#e0e0e0","400":"#bdbdbd","500":"#9e9e9e","600":"#757575","700":"#616161","800":"#424242","900":"#212121","A100":"#d5d5d5","A200":"#aaaaaa","A400":"#303030","A700":"#616161"},"contrastThreshold":3,"tonalOffset":0.2,"text":{"primary":"rgba(0, 0, 0, 0.87)","secondary":"rgba(0, 0, 0, 0.54)","disabled":"rgba(0, 0, 0, 0.38)","hint":"rgba(0, 0, 0, 0.38)"},"divider":"rgba(0, 0, 0, 0.12)","background":{"paper":"rgba(238, 238, 238, 1)","default":"rgba(245, 244, 244, 1)"},"action":{"active":"rgba(0, 0, 0, 0.54)","hover":"rgba(0, 0, 0, 0.04)","hoverOpacity":0.04,"selected":"rgba(0, 0, 0, 0.08)","selectedOpacity":0.08,"disabled":"rgba(0, 0, 0, 0.26)","disabledBackground":"rgba(0, 0, 0, 0.12)","disabledOpacity":0.38,"focus":"rgba(0, 0, 0, 0.12)","focusOpacity":0.12,"activatedOpacity":0.12}}'};

    const addThemes = async () => {
      await Promise.all([darkTheme, dayTheme].map(async theme => {
        const themesPayload = {
          channel: `${process.env.app}_db`,
          payload: {
            api: "sql",
            act: "add",
            payload: {
              data: {
                db: 'main',
                what: "adminTheme",
                data: {
                  isDefault: 1,
                  title: theme.title,
                  data: theme.data
                }
              }
            }
          }
        };

        try {
          const newThemesResponse = await this.protocolService.sendMessage(themesPayload);

          return true;
        } catch (err) {
          console.log(err);
          return true;
        }
      }));
    }

    addThemes();



  }

  async mapPort(data: any) {
    const p_string = await this.cacheService.get("ports");
    let ports = JSON.parse(p_string);
    ports = ports || {};
    ports[data.port] = data.channel;
    await this.cacheService.set("ports",
      JSON.stringify(ports));
    return this.protocolService.sendMessage({
      channel: data.target || `${process.env.app}_proxy`,
      payload: {
        api: "app",
        act: "updatePortMapping",
        payload: ports
      }
    });
  }

  async getPortByChannel(data: any) {
    let p_string = await this.cacheService.get("ports");
    let ports = JSON.parse(p_string);
    if (ports) {
      for (let port in ports) {
        if (ports[port] === data.channel) {
          return +port;
        }
      }
    }
    return null;
  }

  async getPortByPort(data: any) {
    let p_string = await this.cacheService.get("ports");
    let ports = JSON.parse(p_string);
    if (ports) {
      return ports[data.port];
    }
    return null;
  }

  public perform(data: any) {
    if (this.methods.includes(data.act)) {
      //console.log('ProtocolService.' + data.act + '(' + JSON.stringify(data.payload) + ')');
      return this[data.act](data.payload);
    } else {
      console.log("Hub.moduleService." + data.act + " not found");
    }
    return null;
  }

}