import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import HomePage, { HomePageProps } from "../HomePage";
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

const homePageProps: HomePageProps = {
  websiteName: "Example website",
  websiteUrl: "example.com",
  websiteSlogan: "Example website slogan"
};

const Wrapper = ({ ...props }: HomePageProps) => {
  return (
    <IntlProvider locale="en" messages={messages}>
      <HomePage {...props} />
    </IntlProvider>
  );
};

describe("Home Page Suite", () => {

  it("Should render the home page", () => {

    const homePage = render(<Wrapper {...homePageProps} />);

    //TODO add tests for the search form
    //TODO add tests for every component
  });

});