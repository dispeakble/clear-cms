import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import "@testing-library/jest-dom";
import HotelList from "../hotel/list";
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
                <HotelList {...props} />
            </IntlProvider>
        </WsContextProvider>
    );
};

describe("Hotels list Page Suite", () => {
    it("Should render the hotel list page", async () => {
        const hotelsPage = render(<Wrapper {...pageProps} />);

        expect(hotelsPage).toMatchSnapshot()
    });

    it("Should open and close services container", async() => {
        const hotelsPage = render(<Wrapper {...pageProps} />);

        fireEvent.click(hotelsPage.getAllByText(/Included Services/)[0])

        fireEvent.click(hotelsPage.getAllByText(/Included Services/)[0])
    })

    it("Should open and close hotel description container", async() => {
        const hotelsPage = render(<Wrapper {...pageProps} />);

        fireEvent.click(hotelsPage.getAllByText(/Hotel Description/)[0])

        fireEvent.click(hotelsPage.getAllByText(/Hotel Description/)[0])
    })

    it("Should open filters", async() => {
        const hotelsPage = render(<Wrapper {...pageProps} />);

        fireEvent.click(hotelsPage.getByText(/Categories/))

    })

    it("Should close filters", async() => {
        const hotelsPage = render(<Wrapper {...pageProps} />);

        fireEvent.click(hotelsPage.getByText(/Categories/))
    })

    it("Should reset filters", async() => {
        const hotelsPage = render(<Wrapper {...pageProps} />);

        fireEvent.click(hotelsPage.getByText(/Reset/))
    })
})