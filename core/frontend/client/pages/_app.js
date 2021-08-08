import { withStyles, createTheme } from "@material-ui/core/styles";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import styles from "../src/assets/jss/clear-crm/global.js";
import { useRouter } from 'next/router'
import { useEffect, useState } from "react";
import WsService from "../src/services/ws.service";
import * as shortId from "shortid";
import { Helmet } from "react-helmet";
import CssBaseline from "@material-ui/core/CssBaseline";

function MyApp({ Component, pageProps }) {
  const channel = 'app';
  const [defaultPalette, setDefaultPalette] = useState({});
  const [wsInstance, setWsInstance] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);
  const messageCallbacks = {};

  useEffect(() => {
    const instance = new WsService();
    setWsInstance(instance)
  }, [])

  useEffect(() => {
    if (wsInstance) {
      wsInstance.start().then((connected) => {
        setWsConnected(connected);
      });
    }

  }, [wsInstance])

  useEffect(() => {
    if (wsInstance) {
      wsSubscribe();
      getTheme();
    }
  

  }, [wsConnected])

  const wsSubscribe = () => {
    if (wsConnected) {
      wsInstance.subscribe({
        channel: channel,
        callbacks: {
          message: (response) => onMessage(response)
        }
      });
      
    }
  }

  const onMessage = (params) => {
    if (messageCallbacks) {
      try {
        messageCallbacks[params.id](params.data);
      } catch (err) {
        console.log(err);
      }
    }
    
    console.log('got message in _app.tsx', params);
  }

  const sendMessage = async (params) => {
    return new Promise((resolve_send) => {
      const uniqueId = shortId.generate();
      messageCallbacks[uniqueId] = resolve_send
      wsInstance.emit({
        id: uniqueId,
        channel: 'app',
        module: params.module,
        api: params.api,
        act: params.act,
        payload: params.payload
      });
    });
  }


  const getTheme = async () => {
    const response = await sendMessage({
      module: 'system',
      api: 'publicThemes',
      act: 'getOne',
      payload: {
        where: {
          isdefault: 1
        }
      }
    })
    if (response && response.data && response.data.length) {
      setDefaultPalette(JSON.parse(response.data))
      localStorage.setItem('publicThemes', response.data)
    }
  }

  const createAppTheme = () => {
    return createTheme({
      palette: defaultPalette,
      overrides: {
        MuiDialog: {
          paper: {
            width: "100%",
          },
          paperWidthSm: {
            maxWidth: "100vw",
          },
        },
        MuiDropzoneArea: {
          root: {
            height: "145px",
            minHeight: "145px",
          },
          text: {
            fontSize: "1rem",
          },
        },
        MuiTab: {
          root: {
            textTransform: "none"
          }
        },
        MuiButton: {
          root: {
            textTransform: "none !important"
          }
        },
        MuiFormControlLabel: {
          label: {
            color: "#000",
          },
        },
        paperWidthSm: "100%",
      },
    });
  };
  return (
    wsConnected ? (
<>
    <Helmet
      htmlAttributes={{ lang: 'en' }}
      title="Next.js!"
      meta={[
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          property: 'og:title',
          content: 'Hello next.js!'
        },
      ]}
    />
    <MuiThemeProvider theme={createAppTheme()}>
      <CssBaseline />
      <Component {...pageProps} ws={wsInstance} />

    </MuiThemeProvider>
  </>
    ) : null
  )
}


export default withStyles(styles)(MyApp);