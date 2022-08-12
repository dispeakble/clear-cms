import { fireEvent, render, waitFor } from "@testing-library/react";
import { WsContextProvider } from "../../../context/SocketContext";
import { IntlProvider } from "next-intl";
import FlightCheckoutPage from "../flight/checkout";
import "@testing-library/jest-dom";


jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "",
      query: "",
      asPath: "",
      push: jest.fn(),
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
        <FlightCheckoutPage {...props} />
      </IntlProvider>
    </WsContextProvider>
  );
};

describe("Flights checkout page suite", () => {
  it("Should render flights checkout page", async () => {
    const checkoutPage = render(<Wrapper {...pageProps} />);

    expect(checkoutPage).toMatchSnapshot();
  });

  it("Should expand flight pricing rules", async () => {
    const checkoutPage = render(<Wrapper {...pageProps} />);

    fireEvent.click(checkoutPage.getAllByText("Pricing rules")[0]);

    await waitFor(() => {
      expect(checkoutPage.getAllByText(/Lorem ipsum/)[0]).toBeInTheDocument();
    });

    fireEvent.click(checkoutPage.getAllByText("Pricing rules")[0]);
  });

  it("Should go to second step", async () => {
    const checkoutPage = render(<Wrapper {...pageProps} />);

    fireEvent.click(checkoutPage.getByTestId(/test-next-button/));

    await waitFor(() => {
      expect(checkoutPage.getByTestId(/test-flight-second-step/)).toBeInTheDocument();
    });
  });

  it("Shouldn't go to third step", async () => {
    const checkoutPage = render(<Wrapper {...pageProps} />);

    fireEvent.click(checkoutPage.getByTestId(/test-next-button/));

    await waitFor(() => {
      expect(checkoutPage.getByTestId(/test-flight-second-step/)).toBeInTheDocument();
    });

    fireEvent.click(checkoutPage.getByTestId(/test-next-button/));

    await waitFor(() => {
      expect(checkoutPage.getByTestId(/test-flight-second-step/)).toBeInTheDocument();
    });
  });

  it("Should go back to first step", async () => {
    const checkoutPage = render(<Wrapper {...pageProps} />);

    fireEvent.click(checkoutPage.getByTestId(/test-next-button/));

    await waitFor(() => {
      expect(checkoutPage.getByTestId(/test-flight-second-step/)).toBeInTheDocument();
    });

    fireEvent.click(checkoutPage.getByTestId(/test-previous-button/));

    await waitFor(() => {
      expect(checkoutPage.getByTestId(/test-flight-first-step/)).toBeInTheDocument();
    });
  });

  it("Should throw invalid email error", async () => {
    const checkoutPage = render(<Wrapper {...pageProps} />);

    fireEvent.click(checkoutPage.getByTestId(/test-next-button/));

    await waitFor(() => {
      expect(checkoutPage.getByTestId(/test-flight-second-step/)).toBeInTheDocument();
    });

    checkoutPage.container.querySelectorAll("input[type=\"email\"]").forEach(elem => {
      fireEvent.change(
        elem,
        {
          target: {
            value: "test"
          }
        }
      );
    });

    await waitFor(() => {
      expect(checkoutPage.getAllByText(/Invalid email address/)[0]).toBeInTheDocument();
      expect(checkoutPage.getAllByText(/Invalid email address/)[1]).toBeInTheDocument();

    });
  });

  it("Should fill inputs and go to third step", async () => {
    const checkoutPage = render(<Wrapper {...pageProps} />);

    fireEvent.click(checkoutPage.getByTestId(/test-next-button/));

    await waitFor(() => {
      expect(checkoutPage.getByTestId(/test-flight-second-step/)).toBeInTheDocument();
    });

    checkoutPage.container.querySelectorAll("input[type=\"text\"]").forEach(elem => {
      fireEvent.change(
        elem,
        {
          target: {
            value: "test"
          }
        }
      );
    });

    checkoutPage.container.querySelectorAll("input[type=\"number\"]").forEach(elem => {
      fireEvent.change(
        elem,
        {
          target: {
            value: 2
          }
        }
      );
    });

    checkoutPage.container.querySelectorAll("input[type=\"email\"]").forEach(elem => {
      fireEvent.change(
        elem,
        {
          target: {
            value: "test@email.com"
          }
        }
      );
    });

    checkoutPage.container.querySelectorAll("select").forEach(elem => {
      fireEvent.change(
        elem,
        {
          target: {
            value: "spain"
          }
        }
      );
    });

    fireEvent.click(checkoutPage.getByTestId(/test-next-button/));

    await waitFor(() => {
      expect(checkoutPage.queryByTestId(/test-flight-second-step/)).not.toBeInTheDocument();
    });

    fireEvent.click(checkoutPage.getByTestId(/test-next-button/));

    await waitFor(() => {
      expect(checkoutPage.queryByTestId(/test-flight-fourth-step/)).toBeInTheDocument();
    });

    fireEvent.click(checkoutPage.getByTestId(/test-next-button/));

    await waitFor(() => {
      expect(checkoutPage.getByTestId(/test-flight-checkout-confirmation/)).toBeInTheDocument();
    });

    fireEvent.click(checkoutPage.getByTestId(/test-home-button/));
  });
});