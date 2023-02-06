import { fireEvent, render, waitFor } from "@testing-library/react";
import { WsContextProvider } from "../../../context/SocketContext";
import { IntlProvider } from "next-intl";
import PackageCheckoutPage from "../package/checkout";
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
        <PackageCheckoutPage {...props} />
      </IntlProvider>
    </WsContextProvider>
  );
};

describe("Packages checkout page suite", () => {
  it("Should render package checkout page", async () => {
    const checkoutPage = render(<Wrapper {...pageProps} />);

    expect(checkoutPage).toMatchSnapshot();
  });


  /*it("Should go to second step", async () => {
    const checkoutPage = render(<Wrapper {...pageProps} />);

    fireEvent.click(checkoutPage.getByTestId(/test-next-button/));

    await waitFor(() => {
      expect(checkoutPage.getByTestId(/test-package-second-step/)).toBeInTheDocument();
    });
  });*/

  /*it("Should go back to first step", async () => {
    const checkoutPage = render(<Wrapper {...pageProps} />);

    fireEvent.click(checkoutPage.getByTestId(/test-next-button/));

    await waitFor(() => {
      expect(checkoutPage.getByTestId(/test-package-second-step/)).toBeInTheDocument();
    });

    fireEvent.click(checkoutPage.getByTestId(/test-previous-button/));

    await waitFor(() => {
      expect(checkoutPage.getByTestId(/test-package-first-step/)).toBeInTheDocument();
    });
  });*/

  it("Should throw invalid email error", async () => {
    const checkoutPage = render(<Wrapper {...pageProps} />);

    fireEvent.click(checkoutPage.getByTestId(/test-next-button/));

    await waitFor(() => {
      expect(checkoutPage.getByTestId(/test-package-first-step/)).toBeInTheDocument();
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

  it("Should fill inputs and go to first step", async () => {
    const checkoutPage = render(<Wrapper {...pageProps} />);

    fireEvent.click(checkoutPage.getByTestId(/test-next-button/));

    await waitFor(() => {
      expect(checkoutPage.getByTestId(/test-package-first-step/)).toBeInTheDocument();
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
      expect(checkoutPage.queryByTestId(/test-package-fourth-step/)).toBeInTheDocument();
    });

    fireEvent.click(checkoutPage.getByTestId(/test-next-button/));

    await waitFor(() => {
      expect(checkoutPage.getByTestId(/test-package-checkout-confirmation/)).toBeInTheDocument();
    });

    fireEvent.click(checkoutPage.getByTestId(/test-home-button/));
  });
});