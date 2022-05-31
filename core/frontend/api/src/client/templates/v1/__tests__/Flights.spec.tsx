import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import "@testing-library/jest-dom";
import List from "../flight/list";
import { IntlProvider } from "next-intl";
import { WsContextProvider } from "../../../context/SocketContext";

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

const messages = require("../../../languages/agency/en.json");

const pageProps = {
    websiteName: "Example website",
    websiteUrl: "example.com",
    websiteSlogan: "Example website slogan",
    colorScheme: {}
};

const Wrapper = ({ ...props }: any) => {
    return (
        <WsContextProvider settings={{}}>
            <IntlProvider locale="en" messages={messages}>
                <List {...props} />
            </IntlProvider>
        </WsContextProvider>
    );
};

describe("Fights list Page Suite", () => {
    it("Should render the flights list page", async () => {
        const flightsPage = render(<Wrapper {...pageProps} />);

        expect(flightsPage).toMatchSnapshot()
    });
})