import {act, cleanup, fireEvent, render, screen, waitFor} from "@testing-library/react";
import "@testing-library/jest-dom";

import HomePage from "../HomePage";
import { IntlProvider } from 'next-intl';
import { WsContextProvider } from "../../../context/SocketContext";

let location = "";

jest.mock("next/router", () => ({
  useRouter() {
    return {
      push: (url: any) => {
        location = url.pathname;
      },
      route: "/",
      pathname: "",
      query: "",
      asPath: "",
      locales: ["en", "es"]
    };
  },
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: () => {
    return 'not found';
  },
}));

afterEach(() => cleanup())
beforeEach(() => cleanup())

const messages = require("../../../languages/agency/en.json");

const homePageProps: any = {
  websiteName: "Example website",
  websiteUrl: "example.com",
  websiteSlogan: "Example website slogan",
  colorScheme: {}
};

const Wrapper = ({ ...props }: any) => {
  return (
    <WsContextProvider settings={{}}>
      <IntlProvider locale="en" messages={messages}>
        <HomePage {...props} />
      </IntlProvider>
    </WsContextProvider>

  );
};

const formatDate = (date: any) => {
  return Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    year: "2-digit"
  }).format(date);
};

describe("Home Page Suite", () => {

  beforeEach(() => {
    location = "";
  })

  it("Should render the home page", async () => {

    render(<Wrapper {...homePageProps} />);
    expect(screen.getByText(/Travel Any Corner of The World With Us/)).toBeInTheDocument();
  });

  /*it("Should not perform Search with no data", async () => {
   render(<Wrapper {...homePageProps} />);

    fireEvent.click(
        screen.getByTestId(/search-submit-btn/)
    )

    await waitFor(async () => {
      expect(screen.getByTestId(/test-calendar/)).toBeInTheDocument();
      expect(screen.getByTestId(/test-destination-search-input/)).toHaveFocus();
    })

  })*/

  /*it("Should perform Search with data", async () => {

    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.change(
        screen.getByTestId(/test-destination-search-input/),
        {target: {value: 'New destination'}},
    )

    const today = new Date();

    fireEvent.click(
        homePage.getByTestId(/test-checkIn-button/),
    )

    await waitFor(() => {
      expect(homePage.getByTestId(/test-calendar/)).toBeInTheDocument();
    })

    const checkInDateInCalendar = homePage.container.querySelector(`[aria-label="${Intl.DateTimeFormat('en', {
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(new Date(today.setDate(today.getDate() + 1)))}"]`);

    fireEvent.click(
      checkInDateInCalendar
    )

    await waitFor(() =>
      expect(homePage.getByTestId(/test-calendar/)).toBeInTheDocument()
    )


    const checkOutDateInCalendar = homePage.container.querySelector(`[aria-label="${Intl.DateTimeFormat('en', {
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(new Date(today.setDate(today.getDate() + 2)))}"]`);

    fireEvent.click(
      checkOutDateInCalendar
    )

    fireEvent.click(
        screen.getByTestId(/search-submit-btn/)
    )

    await waitFor(() => expect(location).toContain('/agency/search') )
  })*/

  it("Should change packages search input value", () => {
    render(<Wrapper {...homePageProps} />);
    
    fireEvent.change(
        screen.getByTestId(/test-destination-search-input/),
        {target: {value: 'New destination'}},
    )

    expect(screen.getByTestId(/test-destination-search-input/)).toHaveValue('New destination');
  })

  it("Should change check in date picker value", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);
    const today = new Date();

    fireEvent.click(
        homePage.getByTestId(/test-checkIn-button/),
    )

    fireEvent.click(
        homePage.getByTestId('home-search-overlay')
    )

    fireEvent.click(
        homePage.getByTestId(/test-checkIn-button/),
    )

    await waitFor(() => {
      expect(homePage.getByTestId(/test-calendar/)).toBeInTheDocument();
    })

    const checkInDateInCalendar = homePage.container.querySelector(`[aria-label="${Intl.DateTimeFormat('en', {
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(new Date(today.setDate(today.getDate())))}"]`);

    fireEvent.click(
      checkInDateInCalendar
    )

    await waitFor(() => {
      expect(homePage.getByTestId(/test-checkIn-date-value/).textContent).toBe(formatDate(today).toString());
    })


  })

  /*it("Should change check out date picker value", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);
    const today = new Date();

    act(() => {
      fireEvent.click(
        homePage.getByTestId(/test-checkOut-button/)
      )
    })

    act(() => {
      fireEvent.click(
        homePage.getByTestId('home-search-overlay')
      )
    })

    act(() => {
      fireEvent.click(
        homePage.getByTestId(/test-checkOut-button/)
      )
    });

    await waitFor(() => {
      expect(homePage.getByTestId(/test-calendar/)).toBeInTheDocument();
    })

    const checkInDateInCalendar = homePage.container.querySelector(`[aria-label="${Intl.DateTimeFormat('en', {
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(new Date(today.setDate(today.getDate() + 1)))}"]`);

    act(() => {
      fireEvent.click(
        checkInDateInCalendar
      )
    });

    await waitFor(() => {
      expect(homePage.getByTestId(/test-checkOut-date-value/).textContent).toBe(formatDate(today.setDate(today.getDate() + 1)).toString());
    })

  })*/

  it("Should update guests (adults) number", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(
        homePage.getByTestId(/test-open-adults-handler/)
    )

    await waitFor(() => {
      expect(homePage.getByTestId(/test-adults-handler/)).toBeInTheDocument()
    })

    for(let i =0; i < 20; i++){
      fireEvent.click(
          homePage.getByTestId(/test-minus-handler/)
      )
    }

    await waitFor(() => {
      expect(homePage.getByTestId(/test-handler-value/).textContent).toBe('1')
    })

    for(let i =0; i < 20; i++){
      fireEvent.click(homePage.getByTestId(/test-plus-handler/))
    }

    await waitFor(() => {
      expect(homePage.getByTestId(/test-handler-value/).textContent).toBe('9')
    })
  })

  /*it.only("Should update guests (children) number", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(
        homePage.getByTestId(/test-open-children-handler/)
    )

    await waitFor(() => {
      expect(homePage.getByTestId(/test-children-handler/)).toBeInTheDocument()
    })

    for(let i = 0; i < 20; i++){
      fireEvent.click(
          homePage.getByTestId(/test-minus-handler/)
      )
    }

    await waitFor(() => {
      expect(homePage.getByTestId(/test-handler-value/).textContent).toBe('0')
    })

    for(let i =0; i < 13; i++){
      fireEvent.click(homePage.getByTestId(/test-plus-handler/))
    }

    await waitFor(() => {
      expect(homePage.getByTestId(/test-handler-value/).textContent).toBe('4')
    })
  })*/

  it("Should update stars number", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(
        homePage.getByTestId(/test-open-stars-handler/)
    )

    await waitFor(() => {
      expect(homePage.getByTestId(/test-stars-handler/)).toBeInTheDocument()
    })

    for(let i = 0; i < 6; i++){
      fireEvent.click(
          homePage.getByTestId(/test-minus-handler/)
      )
    }

    await waitFor(() => {
      expect(homePage.getByTestId(/test-handler-value/).textContent).toBe('1')
    })

    for(let i = 0; i < 6; i++){
      fireEvent.click(homePage.getByTestId(/test-plus-handler/))
    }

    await waitFor(() => {
      expect(homePage.getByTestId(/test-handler-value/).textContent).toBe('5')
    })
  })

  it("Should toggle flights & hotel tab", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-first-tab-button/))

    await waitFor(() => {
      expect(homePage.getByText(/The complete package/)).toBeInTheDocument()
    })
  })

  it("Should toggle second tab", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-second-tab-button/))

    await waitFor(() => {
      expect(homePage.getByText(/Fun at the beach/)).toBeInTheDocument()
    })
  })

  it("Should toggle third tab", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-third-tab-button/))

    await waitFor(() => {
      expect(homePage.getByText(/Fun at the Zoo/)).toBeInTheDocument()
    })
  })




});


