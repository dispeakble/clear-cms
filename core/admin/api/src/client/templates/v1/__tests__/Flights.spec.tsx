import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import List from "../flight/list";
import { IntlProvider } from "next-intl";
import { WsContext } from "../../../context/SocketContext";
import { ThemeProvider } from "styled-components";
import { myMockTheme } from "./mocks/theme";

jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "",
      query: "",
      asPath: "",
      locales: ["en", "es"]
    };
  }
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: () => {
    return "voila";
  }
}));

beforeEach(() => {
  cleanup();
});

afterEach(() => {
  cleanup();
});

const messages = require("../../../languages/agency/en.json");

const pageProps = {
  websiteName: "Example website",
  websiteUrl: "example.com",
  websiteSlogan: "Example website slogan",
  colorScheme: {}
};

const Wrapper = ({ ...props }: any) => {
  const WsContextProviderValue = {
    ws: {
      socket: false,
      sendMessage: (data: any) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const result = {
              departure: [{
                Id: 0,
                Name: "Abc",
                IntName: "Abc"
              }, {
                Id: 1,
                Name: "Def",
                IntName: "Def"
              }]
            };

            resolve(result);
          }, 30);
        });
      }
    }
  };

  return (
    <ThemeProvider theme={myMockTheme}>
      <IntlProvider locale="en" messages={messages}>
        <WsContext.Provider value={WsContextProviderValue}>
          <List {...props} />
        </WsContext.Provider>
      </IntlProvider>
    </ThemeProvider>
  );
};

describe("Fights list Page Suite", () => {
  it("Should render the flights list page", async () => {
    const flightsPage = render(<Wrapper {...pageProps} />);

    expect(flightsPage).toMatchSnapshot();
  });

  it("Should toggle filter options", async () => {
    const flightsPage = render(<Wrapper {...pageProps} />);

    await waitFor(() => {
      expect(flightsPage.getAllByTestId(/test-filter-options-container/)[0]).toBeInTheDocument();
    });

    fireEvent.click(flightsPage.getAllByTestId(/test-filter-icon-handler/)[0]);

  });
});