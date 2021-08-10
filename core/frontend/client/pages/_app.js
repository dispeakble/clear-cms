import { withStyles, createTheme } from "@material-ui/core/styles";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import styles from "../src/assets/jss/clear-crm/global.js";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import CssBaseline from "@material-ui/core/CssBaseline";

function MyApp({ Component, pageProps }) {
  const [defaultPalette, setDefaultPalette] = useState({});





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
<>
    <Helmet
      htmlAttributes={{ lang: 'en' }}
      title={pageProps?.pageData?.pageConfig?.pageTitle}
      meta={[
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          property: 'og:title',
          content: pageProps?.pageData?.pageConfig?.pageTitle
        },
      ]}
    />
    <MuiThemeProvider theme={createAppTheme()}>
      <CssBaseline />
      <Component {...pageProps}/>

    </MuiThemeProvider>
  </>
  )
}


export default withStyles(styles)(MyApp);