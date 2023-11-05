import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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

    expect(hotelsPage).toMatchSnapshot();
  });

  it("Should open and close services container", async () => {
    const hotelsPage = render(<Wrapper {...pageProps} />);

    fireEvent.click(hotelsPage.getAllByText(/Included Services/)[0]);

    fireEvent.click(hotelsPage.getAllByText(/Included Services/)[0]);
  });

  it("Should open and close hotel description container", async () => {
    const hotelsPage = render(<Wrapper {...pageProps} />);

    fireEvent.click(hotelsPage.getAllByText(/Hotel Description/)[0]);

    fireEvent.click(hotelsPage.getAllByText(/Hotel Description/)[0]);
  });

  /*it("Should open and close filters", async () => {
    const hotelsPage = render(<Wrapper {...pageProps} />);

    fireEvent.click(hotelsPage.getByTestId('hotel-filter-wrapper'));

    await waitFor(() => {
      expect(hotelsPage.container.querySelectorAll(".isOpen")[0]).toBeInTheDocument();
    });

    fireEvent.click(hotelsPage.container.querySelectorAll(".filterHeaderWrapper")[0]);

    await waitFor(() => {
      expect(hotelsPage.container.querySelectorAll(".isOpen")[0]).toBeUndefined();
    });

  });*/

  it("Should reset filters", async () => {
    const hotelsPage = render(<Wrapper {...pageProps} />);

    fireEvent.click(hotelsPage.getByText(/Reset/));
  });

  it("Should load more items", async () => {
    const hotelsPage = render(<Wrapper {...pageProps} />);

    const cardsCount = hotelsPage.container.querySelectorAll(".cardWrapper").length;

    fireEvent.click(hotelsPage.getByTestId(/test-loadMore-button/));

    await waitFor(() => {
      expect(hotelsPage.container.querySelectorAll(".cardWrapper").length).toBeGreaterThan(cardsCount);
    });
  });
});