import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import HomePage from "../HomePage";
import { IntlProvider } from 'next-intl';

jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "",
      query: "",
      asPath: "",
    };
  },
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: () => {
    return 'voila';
  },
}));

const messages = require("../../../languages/agency/en.json");

const homePageProps: any = {
  websiteName: "Example website",
  websiteUrl: "example.com",
  websiteSlogan: "Example website slogan",
  colorScheme: {}
};

const Wrapper = ({ ...props }: any) => {
  return (
    <IntlProvider locale="en" messages={messages}>
      <HomePage {...props} />
    </IntlProvider>
  );
};

describe("Home Page Suite", () => {

  it("Should render the home page", () => {

    const homePage = render(<Wrapper {...homePageProps} />);

    expect(homePage).toMatchSnapshot();

  });

});