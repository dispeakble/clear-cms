import App, { AppContext, AppInitialProps } from 'next/app'
import {Helmet} from "react-helmet";

import AppStore from "../infrastructure/store";
import {WebSocketClient} from "../infrastructure/webSocketClient";

class WebApp extends App {
  private wsCallbacks = {}

  static async getInitialProps({Component, ctx}: AppContext): Promise<AppInitialProps> {
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

    return { pageProps };
  }

  componentDidMount() {
    if (typeof window === 'object') {
      WebSocketClient.init().then(() => {
        WebSocketClient.subscribe({
          channel: 'app',
          callbacks: {
            message: (response) => this.onMessage(response)
          }
        });
      });
    }
  }

  onMessage(params: any) {
    try {
      this.wsCallbacks[params.id](params.data);
    } catch (err) {
      console.log(err);
    }
    console.log('got message in _app.tsx', params);
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
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
        <Component {...pageProps} />
      </>
    );
  }
}

export default AppStore.withRedux(WebApp);
