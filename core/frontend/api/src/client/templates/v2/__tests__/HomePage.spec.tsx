import {cleanup, fireEvent, render, screen, waitFor} from "@testing-library/react";
import "@testing-library/jest-dom";

import HomePage from "../HomePage";
import { IntlProvider } from 'next-intl';
import WS from "jest-websocket-mock";

import { WsContextProvider } from "../../../context/SocketContext";

let location = "";
let server;

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
beforeEach(() => {
  WS.clean()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  server = new WS("/api/ws");
  cleanup()
})

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
    const homePage = render(<Wrapper {...homePageProps} />)
    expect(homePage).toMatchSnapshot()
  });

  it("Header should be fixed on scroll", async () => {
    render(<Wrapper {...homePageProps} />);

    fireEvent.scroll(window, {
      target:{
        scrollY: 100
      }
    })

    await waitFor(() => {
      expect(screen.getByTestId(/header-wrapper/)).toHaveClass('fixedHeader')
    })

    fireEvent.scroll(window, {
      target:{
        scrollY: 30
      }
    })

    await waitFor(() => {
      expect(screen.getByTestId(/header-wrapper/)).not.toHaveClass('fixedHeader')
    })
  })

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

  it("Should toggle hotels tab", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-hotels-search-tab/))

    await waitFor(() => {
      expect(homePage.getByTestId(/test-hotels-search-tab/)).toHaveClass('selected')
    })
  })

  it("Should toggle packages tab", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-packages-search-tab/))

    await waitFor(() => {
      expect(homePage.getByTestId(/test-packages-search-tab/)).toHaveClass('selected')
    })
  })

  it("Should toggle flights tab", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-flights-search-tab/))

    await waitFor(() => {
      expect(homePage.getByTestId(/test-flights-search-tab/)).toHaveClass('selected')
    })
  })
});

describe("Children age popup suite", () => {
  it("Should not go less than 0 and more than 17", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);
    fireEvent.click(homePage.getByTestId(/test-open-children-handler/))

    await waitFor(() => {
      expect(homePage.getByTestId(/test-children-handler/)).toBeInTheDocument()
    })

    fireEvent.click(homePage.getByTestId(/test-plus-handler/))

    await waitFor(() => {
      expect(homePage.getByTestId(/test-children-ages-handler/)).toBeInTheDocument()
    })

    for(let i =0; i< 20; i++){
      fireEvent.click(homePage.getByTestId(/test-age-plus-handler/))
    }

    await waitFor(() => {
      expect(homePage.getByTestId(/test-age-handler-value/).textContent).toBe('17')
    })

    for(let i =0; i< 20; i++){
      fireEvent.click(homePage.getByTestId(/test-age-minus-handler/))
    }

    await waitFor(() => {
      expect(homePage.getByTestId(/test-age-handler-value/).textContent).toBe('0')
    })

  })
})

describe("Hotels search form suite", () => {
  it("Should display autocomplete list for hotels", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-hotels-search-tab/))

    fireEvent.change(
        homePage.getByTestId(/test-destination-search-input/),
        {
          target:{
            value: 'spa'
          }
        }
    )

    await waitFor(() => {
      expect(homePage.getByTestId(/test-autocomplete-list/)).toBeInTheDocument()
    })
  })

  it("Should display departure autocomplete list for packages", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-packages-search-tab/))

    homePage.getByTestId(/test-departure-search-input/).focus()

    await waitFor(() => {
      expect(homePage.getByTestId(/test-autocomplete-list/)).toBeInTheDocument()
    })
  })

  it("Should display destination autocomplete list for packages", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-packages-search-tab/))

    fireEvent.change(
        homePage.getByTestId(/test-destination-search-input/),
        {
          target:{
            value: 'tene'
          }
        }
    )

    await waitFor(() => {
      expect(homePage.getByTestId(/test-autocomplete-list/)).toBeInTheDocument()
    })
  })

  it("Should display departure autocomplete list for flights", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-flights-search-tab/))

    fireEvent.focus(
        homePage.getByTestId(/test-departure-search-input/)
    )

    await waitFor(() => {
      expect(homePage.getByTestId(/test-autocomplete-list/)).toBeInTheDocument()
    })
  })

  it("Should display destination autocomplete list for flights", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-flights-search-tab/))

    fireEvent.change(
        homePage.getByTestId(/test-destination-search-input/),
        {
          target:{
            value: 'tene'
          }
        }
    )

    await waitFor(() => {
      expect(homePage.getByTestId(/test-autocomplete-list/)).toBeInTheDocument()
    })
  })


})


