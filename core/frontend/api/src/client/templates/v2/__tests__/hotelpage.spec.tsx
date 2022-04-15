import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import HotelPage from "../HotelPage";
import { IntlProvider } from "next-intl";

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

const hotelPageProps: any = {
    websiteName: "Example website",
    websiteUrl: "example.com",
    websiteSlogan: "Example website slogan",
    colorScheme: {}
};

const Wrapper = ({ ...props }: any) => {
    return (
      <IntlProvider locale="en" messages={messages}>
          <HotelPage {...props} />
      </IntlProvider>
    );
};

describe("Hotel Page Suite", () => {
    it("Should render the hotel page", async () => {
        const homePage = render(<Wrapper {...hotelPageProps} />);
        expect(homePage).toMatchSnapshot();
    });
});


