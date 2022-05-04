import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import HotelPage from "../HotelPage";
import { IntlProvider } from "next-intl";
import { AppContextProvider } from "../../../context/AppContext";
import { WsContextProvider } from "../../../context/SocketContext";

jest.mock("next/router", () => ({
    useRouter() {
        return {
            route: "/",
            pathname: "",
            query: "",
            asPath: ""
        };
    }
}));

jest.mock("next/image", () => ({
    __esModule: true,
    default: () => {
        return "voila";
    }
}));

const messages = require("../../../languages/agency/en.json");

const hotelPageProps = {
    websiteName: "Example website",
    websiteUrl: "example.com",
    websiteSlogan: "Example website slogan",
    colorScheme: {}
};

const Wrapper = ({ ...props }: any) => {
    return (
      <WsContextProvider settings={{}}>
          <IntlProvider locale="en" messages={messages}>
              <HotelPage {...props} />
          </IntlProvider>
      </WsContextProvider>
    );
};

describe("Hotel Page Suite", () => {
    it("Should render the hotel page", async () => {
        const homePage = render(<Wrapper {...hotelPageProps} />);
        expect(homePage).toMatchSnapshot();
    });
});


