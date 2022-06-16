import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import HomePage from "../HomePage";

import * as React from "react";

import { IntlProvider } from "next-intl";
import { WsContext } from "../../../context/SocketContext";
import { ThemeProvider } from "styled-components";
import { myMockTheme } from "./mocks/theme";

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
  }
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: () => {
    return "not found";
  }
}));

beforeEach(() => {
  cleanup();
});

afterEach(() => {
  cleanup();
});

const messages = require("../../../languages/agency/en.json");

const homePageProps: any = {
  websiteName: "Example website",
  websiteUrl: "example.com",
  websiteSlogan: "Example website slogan",
  colorScheme: {}
};

const Wrapper = ({ ...props }: any) => {
  const WsContextProviderValue = {
    ws: {
      socket: false,
      sendMessage: (data: any) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const result = {
              dateInterval: new Date(),
              departure: [{
                Id: 0,
                Name: "Abc",
                IntName: "Abc"
              }, {
                Id: 1,
                Name: "Def",
                IntName: "Def"
              }],
              destination: [{
                Id: 0,
                Name: "Abc",
                IntName: "Abc"
              }, {
                Id: 1,
                Name: "Def",
                IntName: "Def"
              }]
            };

            resolve(result);
          }, 30);
        });
      }
    }
  };


  return (
      <ThemeProvider theme={myMockTheme}>
        <IntlProvider locale="en" messages={messages}>
          <WsContext.Provider value={WsContextProviderValue}>
            <HomePage {...props} />
          </WsContext.Provider>
        </IntlProvider>
      </ThemeProvider>
  );
};

const _Wrapper = ({...props}: any) => {
  const WsContextProviderValue = {
    ws: {
      socket: false,
      sendMessage: (data: any) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({});
          }, 30);
        });
      }
    }
  };

  return (
      <ThemeProvider theme={myMockTheme}>
        <IntlProvider locale="en" messages={messages}>
          <WsContext.Provider value={WsContextProviderValue}>
            <HomePage {...props} />
          </WsContext.Provider>
        </IntlProvider>
      </ThemeProvider>
  );
}

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
  });

  it("Should render the home page", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);
    expect(homePage).toMatchSnapshot();
  });

  it("Header should be fixed on scroll", async () => {
    render(<Wrapper {...homePageProps} />);

    fireEvent.scroll(window, {
      target: {
        scrollY: 100
      }
    });

    await waitFor(() => {
      expect(screen.getByTestId(/header-wrapper/)).toHaveClass("fixedHeader");
    });

    fireEvent.scroll(window, {
      target: {
        scrollY: 30
      }
    });

    await waitFor(() => {
      expect(screen.getByTestId(/header-wrapper/)).not.toHaveClass("fixedHeader");
    });
  });

  it("Should not perform Search with no data", async () => {
    render(<Wrapper {...homePageProps} />);

    fireEvent.click(
        screen.getByTestId(/search-submit-btn/)
    );

    await waitFor(async () => {
      expect(screen.getByTestId(/test-destination-search-input/)).toHaveFocus();
    });

  });

  /*it("Should perform Hotel Search with data", async () => {

    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.change(
      screen.getByTestId(/test-destination-search-input/),
      { target: { value: "New destination" } }
    );

    const today = new Date();

    fireEvent.click(
      homePage.getByTestId(/test-checkIn-button/)
    );

    await waitFor(() => {
      expect(homePage.getByTestId(/test-calendar/)).toBeInTheDocument();
    });

    const checkInDateInCalendar = homePage.container.querySelector(`[aria-label="${Intl.DateTimeFormat("en", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(new Date(today.setDate(today.getDate() + 1)))}"]`);

    fireEvent.click(
      checkInDateInCalendar
    );

    await waitFor(() =>
      expect(homePage.getByTestId(/test-calendar/)).toBeInTheDocument()
    );


    const checkOutDateInCalendar = homePage.container.querySelector(`[aria-label="${Intl.DateTimeFormat("en", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(new Date(today.setDate(today.getDate() + 2)))}"]`);

    fireEvent.click(
      checkOutDateInCalendar
    );

    fireEvent.click(
      screen.getByTestId(/search-submit-btn/)
    );

    await waitFor(() => expect(location).toContain("/hotels/search"));
  });

  it("Should perform Package Search with data", async () => {

    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-packages-search-tab/));

    await waitFor(() => {
      expect(homePage.getByTestId(/test-departure-search-input/)).toBeInTheDocument();
    });

    fireEvent.change(
      homePage.getByTestId(/test-departure-search-input/),
      { target: { value: "Abc" } }
    );

    fireEvent.change(
      homePage.getByTestId(/test-destination-search-input/),
      { target: { value: "Def" } }
    );

    const today = new Date();

    fireEvent.click(
      homePage.getByTestId(/test-checkIn-button/)
    );

    await waitFor(() => {
      expect(homePage.getByTestId(/test-calendar/)).toBeInTheDocument();
    });

    const checkInDateInCalendar = homePage.container.querySelector(`[aria-label="${Intl.DateTimeFormat("en", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(new Date(today.setDate(today.getDate() + 1)))}"]`);

    fireEvent.click(
      checkInDateInCalendar
    );

    await waitFor(() =>
      expect(homePage.getByTestId(/test-calendar/)).toBeInTheDocument()
    );

    const checkOutDateInCalendar = homePage.container.querySelector(`[aria-label="${Intl.DateTimeFormat("en", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(new Date(today.setDate(today.getDate() + 2)))}"]`);

    fireEvent.click(
      checkOutDateInCalendar
    );

    fireEvent.click(
      homePage.getByTestId(/search-submit-btn/)
    );

    await waitFor(() => expect(location).toContain("/packages/search"));
  });

  it("Should perform Flights Search with data", async () => {

    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-flights-search-tab/));

    fireEvent.change(
      screen.getByTestId(/test-departure-search-input/),
      { target: { value: "New departure" } }
    );

    fireEvent.change(
      screen.getByTestId(/test-destination-search-input/),
      { target: { value: "New destination" } }
    );

    const today = new Date();

    fireEvent.click(
      homePage.getByTestId(/test-checkIn-button/)
    );

    await waitFor(() => {
      expect(homePage.getByTestId(/test-calendar/)).toBeInTheDocument();
    });

    const checkInDateInCalendar = homePage.container.querySelector(`[aria-label="${Intl.DateTimeFormat("en", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(new Date(today.setDate(today.getDate() + 1)))}"]`);

    fireEvent.click(
      checkInDateInCalendar
    );

    await waitFor(() =>
      expect(homePage.getByTestId(/test-calendar/)).toBeInTheDocument()
    );


    const checkOutDateInCalendar = homePage.container.querySelector(`[aria-label="${Intl.DateTimeFormat("en", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(new Date(today.setDate(today.getDate() + 2)))}"]`);

    fireEvent.click(
      checkOutDateInCalendar
    );

    fireEvent.click(
      screen.getByTestId(/search-submit-btn/)
    );

    await waitFor(() => expect(location).toContain("/flights/search"));
  });*/

  it("Should change packages search input value", () => {
    render(<Wrapper {...homePageProps} />);

    fireEvent.change(
        screen.getByTestId(/test-destination-search-input/),
        { target: { value: "New destination" } }
    );

    expect(screen.getByTestId(/test-destination-search-input/)).toHaveValue("New destination");
  });

  it("Should change check in date picker value", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);
    const today = new Date();

    fireEvent.click(
        homePage.getByTestId(/test-checkIn-button/)
    );

    fireEvent.click(
        homePage.getByTestId("home-search-overlay")
    );

    fireEvent.click(
        homePage.getByTestId(/test-checkIn-button/)
    );

    await waitFor(() => {
      expect(homePage.getByTestId(/test-calendar/)).toBeInTheDocument();
    });

    const checkInDateInCalendar = homePage.container.querySelector(`[aria-label="${Intl.DateTimeFormat("en", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(new Date(today.setDate(today.getDate())))}"]`);

    fireEvent.click(
        checkInDateInCalendar
    );

    await waitFor(() => {
      expect(homePage.getByTestId(/test-checkIn-date-value/).textContent).toBe(formatDate(today).toString());
    });


  });

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
    );

    await waitFor(() => {
      expect(homePage.getByTestId(/test-adults-handler/)).toBeInTheDocument();
    });

    for (let i = 0; i < 20; i++) {
      fireEvent.click(
          homePage.getByTestId(/test-minus-handler/)
      );
    }

    await waitFor(() => {
      expect(homePage.getByTestId(/test-handler-value/).textContent).toBe("1");
    });

    for (let i = 0; i < 20; i++) {
      fireEvent.click(homePage.getByTestId(/test-plus-handler/));
    }

    await waitFor(() => {
      expect(homePage.getByTestId(/test-handler-value/).textContent).toBe("9");
    });
  });


  it("Should update stars number", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(
        homePage.getByTestId(/test-open-stars-handler/)
    );

    await waitFor(() => {
      expect(homePage.getByTestId(/test-stars-handler/)).toBeInTheDocument();
    });

    for (let i = 0; i < 6; i++) {
      fireEvent.click(
          homePage.getByTestId(/test-minus-handler/)
      );
    }

    await waitFor(() => {
      expect(homePage.getByTestId(/test-handler-value/).textContent).toBe("1");
    });

    for (let i = 0; i < 6; i++) {
      fireEvent.click(homePage.getByTestId(/test-plus-handler/));
    }

    await waitFor(() => {
      expect(homePage.getByTestId(/test-handler-value/).textContent).toBe("5");
    });
  });

  it("Should toggle hotels tab", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-hotels-search-tab/));

    await waitFor(() => {
      expect(homePage.getByTestId(/test-hotels-search-tab/)).toHaveClass("selected");
    });
  });

  it("Should toggle packages tab", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-packages-search-tab/));

    await waitFor(() => {
      expect(homePage.getByTestId(/test-packages-search-tab/)).toHaveClass("selected");
    });
  });

  it("Should toggle flights tab", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-flights-search-tab/));

    await waitFor(() => {
      expect(homePage.getByTestId(/test-flights-search-tab/)).toHaveClass("selected");
    });
  });
});

describe("Children age popup suite", () => {
  it("Should not go less than 0 and more than 17", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);
    fireEvent.click(homePage.getByTestId(/test-open-children-handler/));

    await waitFor(() => {
      expect(homePage.getByTestId(/test-children-handler/)).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/test-plus-handler/));

    await waitFor(() => {
      expect(homePage.getByTestId(/test-children-ages-handler/)).toBeInTheDocument();
    });

    for (let i = 0; i < 20; i++) {
      fireEvent.click(homePage.getByTestId(/test-age-plus-handler/));
    }

    await waitFor(() => {
      expect(homePage.getByTestId(/test-age-handler-value/).textContent).toBe("17");
    });

    for (let i = 0; i < 20; i++) {
      fireEvent.click(homePage.getByTestId(/test-age-minus-handler/));
    }

    await waitFor(() => {
      expect(homePage.getByTestId(/test-age-handler-value/).textContent).toBe("0");
    });

  });

  it("Should Display top hotel cards", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    await waitFor(() => {
      expect(homePage.getByTestId(/test-topHotel-card-first/)).toBeInTheDocument();
      expect(homePage.getByTestId(/test-topHotel-card-second/)).toBeInTheDocument();
      expect(homePage.getByTestId(/test-topHotel-card-third/)).toBeInTheDocument();
    });
  });

  it("Should toggle top hotel cards", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-topHotel-button-second/));

    await waitFor(() => {
      expect(
          homePage
              .getByTestId(/test-topHotel-button-second/)
              .getAttribute("class"))
          .toMatch(/selected/i);
    });

    fireEvent.click(homePage.getByTestId(/test-topHotel-button-first/));

    await waitFor(() => {
      expect(
          homePage
              .getByTestId(/test-topHotel-button-first/)
              .getAttribute("class"))
          .toMatch(/selected/i);
    });

    fireEvent.click(homePage.getByTestId(/test-topHotel-button-third/));

    await waitFor(() => {
      expect(
          homePage
              .getByTestId(/test-topHotel-button-third/)
              .getAttribute("class"))
          .toMatch(/selected/i);
    });
  });

  it("Should toggle recommended hotels cards", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);
    fireEvent.click(homePage.getAllByTestId(/test-recommended-button/)[1]);

    await waitFor(() => {
      expect(homePage.getByTestId(/test-recommended-card-second/)).toBeInTheDocument();
    });

    fireEvent.click(homePage.getAllByTestId(/test-recommended-button/)[2]);

    await waitFor(() => {
      expect(homePage.getByTestId(/test-recommended-card-third/)).toBeInTheDocument();

    });

    fireEvent.click(homePage.getAllByTestId(/test-recommended-button/)[0]);

    await waitFor(() => {
      expect(homePage.getByTestId(/test-recommended-card-first/)).toBeInTheDocument();
    });
  });

  it("Should switch tabbed content", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-second-tab-button/));

    await waitFor(() => {
      expect(homePage.getByTestId(/test-second-tab-slide/)).toBeInTheDocument();
      expect(
          homePage
              .getByTestId(/test-second-tab-button/)
              .getAttribute("class"))
          .toMatch(/selected/i);
    });

    fireEvent.click(homePage.getByTestId(/test-first-tab-button/));

    await waitFor(() => {
      expect(homePage.getByTestId(/test-first-tab-slide/)).toBeInTheDocument();
      expect(
          homePage
              .getByTestId(/test-first-tab-button/)
              .getAttribute("class"))
          .toMatch(/selected/i);
    });

    fireEvent.click(homePage.getByTestId(/test-third-tab-button/));

    await waitFor(() => {
      expect(homePage.getByTestId(/test-third-tab-slide/)).toBeInTheDocument();
      expect(
          homePage
              .getByTestId(/test-third-tab-button/)
              .getAttribute("class"))
          .toMatch(/selected/i);
    });
  });
});

/*
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

*/

describe("Hotels search form suite", () => {

  it("Should focus destination input on submit", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-hotels-search-tab/));

    await waitFor(() => {
      expect(homePage.container.querySelector(".hotelsSearchForm")).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/search-submit-btn/));

    await waitFor(() => {
      expect(document.activeElement)
          .toEqual(homePage.getByTestId("test-destination-search-input"));
    });

  });

  it("Shouldn't show the Hotel destinations list by name", async () => {
    const homePage = render(<_Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-hotels-search-tab/));

    fireEvent.change(
        screen.getByTestId(/test-destination-search-input/),
        {
          target: {
            value: "test"
          }
        }
    );

    await waitFor(async () => {
      expect(screen.queryByTestId(/hotels-destination-list/)).toBeNull();
    });
  });

  it("Should open calendar or submit", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-hotels-search-tab/));

    await waitFor(() => {
      expect(homePage.container.querySelector(".hotelsSearchForm")).toBeInTheDocument();
    });

    fireEvent.change(
        homePage.getByTestId(/test-destination-search-input/),
        {
          target: {
            value: "test"
          }
        }
    );

    fireEvent.change(
        homePage.getByTestId(/test-destination-search-input/),
        {
          target: {
            value: "test"
          }
        }
    );

    fireEvent.click(homePage.getByTestId(/search-submit-btn/));

    await waitFor(() => {
      expect(homePage.getByTestId(/test-calendar/)).toBeInTheDocument();
    });
  });

  it("Shouldn't show destinations list", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-hotels-search-tab/));

    await waitFor(() => {
      expect(homePage.container.querySelector(".hotelsSearchForm")).toBeInTheDocument();
    });

    fireEvent.change(
        homePage.getByTestId(/test-destination-search-input/),
        {
          target: {
            value: "Abc"
          }
        }
    );

    await waitFor(() => {
      expect(homePage.getByTestId(/hotels-destination-list/)).toBeInTheDocument()
    })

    fireEvent.click(
        homePage.getByTestId(/autocomplete-destination-0/)
    )

    await waitFor(() => {
      expect(homePage.getByTestId(/test-destination-search-input/)).toHaveDisplayValue(/Abc/)
    })
  });

  it("Should update destination input value", async () => {
    const homePage = render(<_Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-hotels-search-tab/));

    await waitFor(() => {
      expect(homePage.container.querySelector(".hotelsSearchForm")).toBeInTheDocument();
    });

    fireEvent.change(
        homePage.getByTestId(/test-destination-search-input/),
        {
          target: {
            value: "Abc"
          }
        }
    );

    await waitFor(() => {
      expect(homePage.queryByTestId(/hotels-destination-list/)).toBeNull()
    })
  });

  it("Should open and close calendar modal via overlay click", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-hotels-search-tab/));

    await waitFor(() => {
      expect(homePage.container.querySelector(".hotelsSearchForm")).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/test-checkIn-button/));

    await waitFor(() => {
      expect(homePage.getByTestId(/test-calendar/)).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/home-search-overlay/));

    await waitFor(() => {
      expect(homePage.queryByTestId(/home-search-overlay/)).toBeNull();
    });
  });

  it("Should change calendar date and close calendar", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);
    const today = new Date();
    const checkOut = new Date();

    fireEvent.click(homePage.getByTestId(/test-hotels-search-tab/));

    await waitFor(() => {
      expect(homePage.container.querySelector(".hotelsSearchForm")).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/test-checkIn-button/));

    await waitFor(() => {
      expect(homePage.getByTestId(/test-calendar/)).toBeInTheDocument();
    });

    const checkInFlightDateInCalendar = homePage.container.querySelector(`[aria-label="${Intl.DateTimeFormat("en", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(new Date(today.setDate(today.getDate())))}"]`);


    fireEvent.click(
        checkInFlightDateInCalendar
    );

    const checkOutFlightDateInCalendar = homePage.container.querySelector(`[aria-label="${Intl.DateTimeFormat("en", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(new Date(checkOut.setDate(checkOut.getDate() + 1)))}"]`);

    fireEvent.click(
        checkOutFlightDateInCalendar
    );

    await waitFor(() => {
      expect(homePage.getByTestId(/test-checkIn-date-value/).textContent).toBe(formatDate(today).toString());
      expect(homePage.getByTestId(/test-checkOut-date-value/).textContent).toBe(formatDate(checkOut).toString());
      expect(homePage.queryByTestId(/home-search-overlay/)).toBeNull();
    });
  });

  it("Should toggle filters (Adults)", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-hotels-search-tab/));

    await waitFor(() => {
      expect(homePage.container.querySelector(".hotelsSearchForm")).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/test-open-adults-handler/));

    await waitFor(() => {
      expect(homePage.getByTestId(/test-adults-handler/)).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/home-search-overlay/));

    await waitFor(() => {
      expect(homePage.queryByTestId(/home-search-overlay/)).toBeNull();
    });
  });
  it("Should change filters values (Adults)", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-hotels-search-tab/));

    await waitFor(() => {
      expect(homePage.container.querySelector(".hotelsSearchForm")).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/test-open-adults-handler/));

    await waitFor(() => {
      expect(homePage.getByTestId(/test-adults-handler/)).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/test-plus-handler/));

    await waitFor(() => {
      expect(Number(homePage.getByTestId(/test-handler-value/).textContent)).toBeGreaterThan(1);
    });
  });

  it("Should toggle filters (Children)", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-hotels-search-tab/));

    await waitFor(() => {
      expect(homePage.container.querySelector(".hotelsSearchForm")).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/test-open-children-handler/));

    await waitFor(() => {
      expect(homePage.getByTestId(/test-children-handler/)).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/home-search-overlay/));

    await waitFor(() => {
      expect(homePage.queryByTestId(/home-search-overlay/)).toBeNull();
    });
  });
  it("Should change filters values (Children)", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-hotels-search-tab/));

    await waitFor(() => {
      expect(homePage.container.querySelector(".hotelsSearchForm")).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/test-open-children-handler/));

    await waitFor(() => {
      expect(homePage.getByTestId(/test-children-handler/)).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/test-plus-handler/));

    await waitFor(() => {
      expect(homePage.getByTestId(/test-children-ages-handler/)).toBeInTheDocument();
      expect(Number(homePage.getByTestId(/test-handler-value/).textContent)).toBeGreaterThan(0);
    });
  });

  it("Should toggle filters (Stars)", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-hotels-search-tab/));

    await waitFor(() => {
      expect(homePage.container.querySelector(".hotelsSearchForm")).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/test-open-stars-handler/));

    await waitFor(() => {
      expect(homePage.getByTestId(/test-stars-handler/)).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/home-search-overlay/));

    await waitFor(() => {
      expect(homePage.queryByTestId(/home-search-overlay/)).toBeNull();
    });
  });
  it("Should change filters values (Stars)", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-hotels-search-tab/));

    await waitFor(() => {
      expect(homePage.container.querySelector(".hotelsSearchForm")).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/test-open-stars-handler/));

    await waitFor(() => {
      expect(homePage.getByTestId(/test-stars-handler/)).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/test-plus-handler/));

    await waitFor(() => {
      expect(Number(homePage.getByTestId(/test-handler-value/).textContent)).toBeGreaterThan(4);
    });
  });


  it("Should perform a submit after fields are filled", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);
    const today = new Date();
    const checkOut = new Date();

    fireEvent.click(homePage.getByTestId(/test-hotels-search-tab/));

    await waitFor(() => {
      expect(homePage.container.querySelector(".hotelsSearchForm")).toBeInTheDocument();
    });

    fireEvent.change(
        homePage.getByTestId(/test-destination-search-input/),
        {
          target: {
            value: "test"
          }
        }
    );

    fireEvent.click(homePage.getByTestId(/search-submit-btn/));

    await waitFor(() => {
      expect(homePage.getByTestId(/test-calendar/)).toBeInTheDocument();
    });

    const checkInFlightDateInCalendar = homePage.container.querySelector(`[aria-label="${Intl.DateTimeFormat("en", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(new Date(today.setDate(today.getDate())))}"]`);


    fireEvent.click(
        checkInFlightDateInCalendar
    );

    const checkOutFlightDateInCalendar = homePage.container.querySelector(`[aria-label="${Intl.DateTimeFormat("en", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(new Date(checkOut.setDate(checkOut.getDate() + 1)))}"]`);

    fireEvent.click(
        checkOutFlightDateInCalendar
    );

    await waitFor(() => {
      expect(homePage.queryByTestId(/home-search-overlay/)).toBeNull();
    });
  });
});

describe("Flights search form suite", () => {

  it("Should focus departure on submit", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-flights-search-tab/));

    await waitFor(() => {
      expect(homePage.container.querySelector(".flightsSearchForm")).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/search-submit-btn/));

    await waitFor(() => {
      expect(document.activeElement)
          .toEqual(homePage.getByTestId("test-departure-search-input"));
    });

  });

  it("Should show the flight departure list", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-flights-search-tab/));

    fireEvent.focus(
        screen.getByTestId(/test-departure-search-input/)
    );

    await waitFor(async () => {
      expect(screen.getByTestId(/flights-departure-list/)).toBeInTheDocument();
    });

  });

  it("Shouldn't show the flight departure list", async () => {
    const homePage = render(<_Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-flights-search-tab/));

    fireEvent.focus(
        screen.getByTestId(/test-departure-search-input/)
    );

    await waitFor(async () => {
      expect(screen.queryByTestId(/flights-departure-list/)).toBeNull();
    });

  });

  it("Shouldn't show the flight departure list by name", async () => {
    const homePage = render(<_Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-flights-search-tab/));

    fireEvent.change(
        screen.getByTestId(/test-departure-search-input/),
        {
          target: {
            value: "test"
          }
        }
    );


    await waitFor(async () => {
      expect(screen.queryByTestId(/flights-departure-list/)).toBeNull();
    });
  });

  it("Shouldn't show the flight destination list by name", async () => {
    const homePage = render(<_Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-flights-search-tab/));

    fireEvent.change(
        screen.getByTestId(/test-destination-search-input/),
        {
          target: {
            value: "test"
          }
        }
    );


    await waitFor(async () => {
      expect(screen.queryByTestId(/flights-destination-list/)).toBeNull();
    });
  });

  it("Should select destination and departure options from autocomplete - Flights", async() => {
    const homePage = render(<Wrapper {...homePageProps} />);


    fireEvent.click(homePage.getByTestId(/test-flights-search-tab/));

    fireEvent.focus(
        homePage.getByTestId(/test-departure-search-input/)
    );

    await waitFor(() => {
      expect(homePage.getByTestId(/flights-departure-list/)).toBeInTheDocument();
    });

    fireEvent.click(
        homePage.getByTestId(/autocomplete-departure-0/)
    )

    fireEvent.change(
        homePage.getByTestId(/test-destination-search-input/),
        {
          target: {
            value: "Def"
          }
        }
    )

    await waitFor(() => {
      expect(homePage.getByTestId(/flights-destination-list/)).toBeInTheDocument();
      console.log(homePage.getByTestId(/flights-destination-list/), "hak had test")
    });

    fireEvent.click(
        homePage.getByTestId(/autocomplete-destination-0/)
    )

    await waitFor(() => {
      expect(homePage.getByTestId(/test-destination-search-input/)).toHaveDisplayValue(/Def/)
    })
  })


  it("Should open calendar or submit", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-flights-search-tab/));

    await waitFor(() => {
      expect(homePage.container.querySelector(".flightsSearchForm")).toBeInTheDocument();
    });

    fireEvent.change(
        homePage.getByTestId(/test-departure-search-input/),
        {
          target: {
            value: "test"
          }
        }
    );

    fireEvent.change(
        homePage.getByTestId(/test-destination-search-input/),
        {
          target: {
            value: "test"
          }
        }
    );

    fireEvent.click(homePage.getByTestId(/search-submit-btn/));

    await waitFor(() => {
      expect(homePage.getByTestId(/test-calendar/)).toBeInTheDocument();
    });
  });


  it("Should update departure input value", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-flights-search-tab/));

    await waitFor(() => {
      expect(homePage.container.querySelector(".flightsSearchForm")).toBeInTheDocument();
    });

    fireEvent.change(
        homePage.getByTestId(/test-departure-search-input/),
        {
          target: {
            value: "test"
          }
        }
    );
  });

  it("Should update destination input value", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-flights-search-tab/));

    await waitFor(() => {
      expect(homePage.container.querySelector(".flightsSearchForm")).toBeInTheDocument();
    });

    fireEvent.change(
        homePage.getByTestId(/test-destination-search-input/),
        {
          target: {
            value: "test"
          }
        }
    );
  });

  it("Should open and close calendar modal via overlay click", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-flights-search-tab/));

    await waitFor(() => {
      expect(homePage.container.querySelector(".flightsSearchForm")).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/test-checkIn-button/));

    await waitFor(() => {
      expect(homePage.getByTestId(/test-calendar/)).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/home-search-overlay/));

    await waitFor(() => {
      expect(homePage.queryByTestId(/home-search-overlay/)).toBeNull();
    });
  });

  it("Should change calendar date and close calendar", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);
    const today = new Date();
    const checkOut = new Date();

    fireEvent.click(homePage.getByTestId(/test-flights-search-tab/));

    await waitFor(() => {
      expect(homePage.container.querySelector(".flightsSearchForm")).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/test-checkIn-button/));

    await waitFor(() => {
      expect(homePage.getByTestId(/test-calendar/)).toBeInTheDocument();
    });

    const checkInFlightDateInCalendar = homePage.container.querySelector(`[aria-label="${Intl.DateTimeFormat("en", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(new Date(today.setDate(today.getDate())))}"]`);


    fireEvent.click(
        checkInFlightDateInCalendar
    );

    const checkOutFlightDateInCalendar = homePage.container.querySelector(`[aria-label="${Intl.DateTimeFormat("en", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(new Date(checkOut.setDate(checkOut.getDate() + 1)))}"]`);

    fireEvent.click(
        checkOutFlightDateInCalendar
    );

    await waitFor(() => {
      expect(homePage.getByTestId(/test-checkIn-date-value/).textContent).toBe(formatDate(today).toString());
      expect(homePage.getByTestId(/test-checkOut-date-value/).textContent).toBe(formatDate(checkOut).toString());
      expect(homePage.queryByTestId(/home-search-overlay/)).toBeNull();
    });
  });


  it("Should toggle filters (Adults)", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-flights-search-tab/));

    await waitFor(() => {
      expect(homePage.container.querySelector(".flightsSearchForm")).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/test-open-adults-handler/));

    await waitFor(() => {
      expect(homePage.getByTestId(/test-adults-handler/)).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/home-search-overlay/));

    await waitFor(() => {
      expect(homePage.queryByTestId(/home-search-overlay/)).toBeNull();
    });
  });
  it("Should change filters values (Adults)", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-flights-search-tab/));

    await waitFor(() => {
      expect(homePage.container.querySelector(".flightsSearchForm")).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/test-open-adults-handler/));

    await waitFor(() => {
      expect(homePage.getByTestId(/test-adults-handler/)).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/test-plus-handler/));

    await waitFor(() => {
      expect(Number(homePage.getByTestId(/test-handler-value/).textContent)).toBeGreaterThan(1);
    });
  });

  it("Should toggle filters (Children)", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-flights-search-tab/));

    await waitFor(() => {
      expect(homePage.container.querySelector(".flightsSearchForm")).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/test-open-children-handler/));

    await waitFor(() => {
      expect(homePage.getByTestId(/test-children-handler/)).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/home-search-overlay/));

    await waitFor(() => {
      expect(homePage.queryByTestId(/home-search-overlay/)).toBeNull();
    });
  });
  it("Should change filters values (Children)", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-flights-search-tab/));

    await waitFor(() => {
      expect(homePage.container.querySelector(".flightsSearchForm")).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/test-open-children-handler/));

    await waitFor(() => {
      expect(homePage.getByTestId(/test-children-handler/)).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/test-plus-handler/));

    await waitFor(() => {
      expect(homePage.getByTestId(/test-children-ages-handler/)).toBeInTheDocument();
      expect(Number(homePage.getByTestId(/test-handler-value/).textContent)).toBeGreaterThan(0);
    });
  });

  it("Should toggle filters (One way flight)", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-flights-search-tab/));

    await waitFor(() => {
      expect(homePage.container.querySelector(".flightsSearchForm")).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/test-checkbox-oneway-handler/));

    await waitFor(() => {
      expect(homePage.container.querySelector("input[type=\"checkbox\"]")).toHaveProperty("checked", true);
    });

    fireEvent.click(homePage.getByTestId(/test-checkbox-oneway-handler/));

    await waitFor(() => {
      expect(homePage.container.querySelector("input[type=\"checkbox\"]")).toHaveProperty("checked", false);
    });
  });

  it("Should perform a submit after fields are filled", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);
    const today = new Date();
    const checkOut = new Date();

    fireEvent.click(homePage.getByTestId(/test-flights-search-tab/));

    await waitFor(() => {
      expect(homePage.container.querySelector(".flightsSearchForm")).toBeInTheDocument();
    });

    fireEvent.change(
        homePage.getByTestId(/test-departure-search-input/),
        {
          target: {
            value: "test"
          }
        }
    );

    fireEvent.change(
        homePage.getByTestId(/test-destination-search-input/),
        {
          target: {
            value: "test"
          }
        }
    );

    fireEvent.click(homePage.getByTestId(/search-submit-btn/));

    await waitFor(() => {
      expect(homePage.getByTestId(/test-calendar/)).toBeInTheDocument();
    });

    const checkInFlightDateInCalendar = homePage.container.querySelector(`[aria-label="${Intl.DateTimeFormat("en", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(new Date(today.setDate(today.getDate())))}"]`);


    fireEvent.click(
        checkInFlightDateInCalendar
    );

    const checkOutFlightDateInCalendar = homePage.container.querySelector(`[aria-label="${Intl.DateTimeFormat("en", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(new Date(checkOut.setDate(checkOut.getDate() + 1)))}"]`);

    fireEvent.click(
        checkOutFlightDateInCalendar
    );

    await waitFor(() => {
      expect(homePage.queryByTestId(/home-search-overlay/)).toBeNull();
    });
  });
});

describe("Packages search form suite", () => {

  it("Should focus departure on submit", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-packages-search-tab/));

    await waitFor(() => {
      expect(homePage.container.querySelector(".packagesSearchForm")).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/search-submit-btn/));

    await waitFor(() => {
      expect(document.activeElement)
          .toEqual(homePage.getByTestId("test-departure-search-input"));
    });

  });

  it("Should show the packages departure list", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-packages-search-tab/));

    fireEvent.focus(
        screen.getByTestId(/test-departure-search-input/)
    );

    await waitFor(async () => {
      expect(screen.getByTestId(/packages-departure-list/)).toBeInTheDocument();
    });

  });

  it("Shouldn't show the packages departure list", async () => {
    const homePage = render(<_Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-packages-search-tab/));

    fireEvent.focus(
        screen.getByTestId(/test-departure-search-input/)
    );

    await waitFor(async () => {
      expect(screen.queryByTestId(/packages-departure-list/)).toBeNull();
    });

  });

  it("Shouldn't show the package departure list by name", async () => {
    const homePage = render(<_Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-packages-search-tab/));

    fireEvent.change(
        screen.getByTestId(/test-departure-search-input/),
        {
          target: {
            value: "test"
          }
        }
    );


    await waitFor(async () => {
      expect(screen.queryByTestId(/packages-departure-list/)).toBeNull();
    });
  });

  it("Shouldn't show the package destination list by name", async () => {
    const homePage = render(<_Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-packages-search-tab/));

    fireEvent.change(
        screen.getByTestId(/test-destination-search-input/),
        {
          target: {
            value: "test"
          }
        }
    );


    await waitFor(async () => {
      expect(screen.queryByTestId(/packages-destination-list/)).toBeNull();
    });
  });

  it("Should select destination and departure options from autocomplete - Flights", async() => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-packages-search-tab/));

    fireEvent.focus(
        homePage.getByTestId(/test-departure-search-input/)
    );

    await waitFor(() => {
      expect(homePage.getByTestId(/packages-departure-list/)).toBeInTheDocument();
    });

    fireEvent.click(
        homePage.getByTestId(/autocomplete-departure-0/)
    )

    fireEvent.change(
        homePage.getByTestId(/test-destination-search-input/),
        {
          target: {
            value: "Def"
          }
        }
    )

    await waitFor(() => {
      expect(homePage.getByTestId(/packages-destination-list/)).toBeInTheDocument();
    });

    fireEvent.click(
        homePage.getByTestId(/autocomplete-destination-0/)
    )

    await waitFor(() => {
      expect(homePage.getByTestId(/test-destination-search-input/)).toHaveDisplayValue(/Def/)
    })
  })


  it("Should open calendar or submit", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-packages-search-tab/));

    await waitFor(() => {
      expect(homePage.container.querySelector(".packagesSearchForm")).toBeInTheDocument();
    });

    fireEvent.change(
        homePage.getByTestId(/test-departure-search-input/),
        {
          target: {
            value: "test"
          }
        }
    );

    fireEvent.change(
        homePage.getByTestId(/test-destination-search-input/),
        {
          target: {
            value: "test"
          }
        }
    );

    fireEvent.click(homePage.getByTestId(/search-submit-btn/));

    await waitFor(() => {
      expect(homePage.getByTestId(/test-calendar/)).toBeInTheDocument();
    });
  });

  it("Should update departure input value", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-packages-search-tab/));

    await waitFor(() => {
      expect(homePage.container.querySelector(".packagesSearchForm")).toBeInTheDocument();
    });

    fireEvent.change(
        homePage.getByTestId(/test-departure-search-input/),
        {
          target: {
            value: "test"
          }
        }
    );
  });

  it("Should update destination input value", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-packages-search-tab/));

    await waitFor(() => {
      expect(homePage.container.querySelector(".packagesSearchForm")).toBeInTheDocument();
    });

    fireEvent.change(
        homePage.getByTestId(/test-destination-search-input/),
        {
          target: {
            value: "test"
          }
        }
    );
  });

  it("Should open and close calendar modal via overlay click", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-packages-search-tab/));

    await waitFor(() => {
      expect(homePage.container.querySelector(".packagesSearchForm")).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/test-checkIn-button/));

    await waitFor(() => {
      expect(homePage.getByTestId(/test-calendar/)).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/home-search-overlay/));

    await waitFor(() => {
      expect(homePage.queryByTestId(/home-search-overlay/)).toBeNull();
    });
  });

  it("Should change calendar date", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);
    const today = new Date();
    const checkOut = new Date();

    fireEvent.click(homePage.getByTestId(/test-packages-search-tab/));

    await waitFor(() => {
      expect(homePage.container.querySelector(".packagesSearchForm")).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/test-checkIn-button/));

    await waitFor(() => {
      expect(homePage.getByTestId(/test-calendar/)).toBeInTheDocument();
    });

    const checkInFlightDateInCalendar = homePage.container.querySelector(`[aria-label="${Intl.DateTimeFormat("en", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(new Date(today.setDate(today.getDate())))}"]`);


    fireEvent.click(
        checkInFlightDateInCalendar
    );

    const checkOutFlightDateInCalendar = homePage.container.querySelector(`[aria-label="${Intl.DateTimeFormat("en", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(new Date(checkOut.setDate(checkOut.getDate() + 1)))}"]`);

    fireEvent.click(
        checkOutFlightDateInCalendar
    );

    await waitFor(() => {
      expect(homePage.getByTestId(/test-checkIn-date-value/).textContent).toBe(formatDate(today).toString());
      expect(homePage.getByTestId(/test-checkOut-date-value/).textContent).toBe(formatDate(checkOut).toString());
      expect(homePage.queryByTestId(/home-search-overlay/)).toBeNull();
    });
  });

  it("Should toggle filters (Adults)", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-packages-search-tab/));

    await waitFor(() => {
      expect(homePage.container.querySelector(".packagesSearchForm")).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/test-open-adults-handler/));

    await waitFor(() => {
      expect(homePage.getByTestId(/test-adults-handler/)).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/home-search-overlay/));

    await waitFor(() => {
      expect(homePage.queryByTestId(/home-search-overlay/)).toBeNull();
    });
  });
  it("Should change filters values (Adults)", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-packages-search-tab/));

    await waitFor(() => {
      expect(homePage.container.querySelector(".packagesSearchForm")).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/test-open-adults-handler/));

    await waitFor(() => {
      expect(homePage.getByTestId(/test-adults-handler/)).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/test-plus-handler/));

    await waitFor(() => {
      expect(Number(homePage.getByTestId(/test-handler-value/).textContent)).toBeGreaterThan(1);
    });
  });

  it("Should toggle filters (Children)", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-packages-search-tab/));

    await waitFor(() => {
      expect(homePage.container.querySelector(".packagesSearchForm")).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/test-open-children-handler/));

    await waitFor(() => {
      expect(homePage.getByTestId(/test-children-handler/)).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/home-search-overlay/));

    await waitFor(() => {
      expect(homePage.queryByTestId(/home-search-overlay/)).toBeNull();
    });
  });
  it("Should change filters values (Children)", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-packages-search-tab/));

    await waitFor(() => {
      expect(homePage.container.querySelector(".packagesSearchForm")).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/test-open-children-handler/));

    await waitFor(() => {
      expect(homePage.getByTestId(/test-children-handler/)).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/test-plus-handler/));

    await waitFor(() => {
      expect(homePage.getByTestId(/test-children-ages-handler/)).toBeInTheDocument();
      expect(Number(homePage.getByTestId(/test-handler-value/).textContent)).toBeGreaterThan(0);
    });
  });

  it("Should toggle filters (Stars)", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-packages-search-tab/));

    await waitFor(() => {
      expect(homePage.container.querySelector(".packagesSearchForm")).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/test-open-stars-handler/));

    await waitFor(() => {
      expect(homePage.getByTestId(/test-stars-handler/)).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/home-search-overlay/));

    await waitFor(() => {
      expect(homePage.queryByTestId(/home-search-overlay/)).toBeNull();
    });
  });
  it("Should change filters values (Stars)", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);

    fireEvent.click(homePage.getByTestId(/test-packages-search-tab/));

    await waitFor(() => {
      expect(homePage.container.querySelector(".packagesSearchForm")).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/test-open-stars-handler/));

    await waitFor(() => {
      expect(homePage.getByTestId(/test-stars-handler/)).toBeInTheDocument();
    });

    fireEvent.click(homePage.getByTestId(/test-plus-handler/));

    await waitFor(() => {
      expect(Number(homePage.getByTestId(/test-handler-value/).textContent)).toBeGreaterThan(4);
    });
  });

  it("Should perform a submit after fields are filled", async () => {
    const homePage = render(<Wrapper {...homePageProps} />);
    const today = new Date();
    const checkOut = new Date();

    fireEvent.click(homePage.getByTestId(/test-packages-search-tab/));

    await waitFor(() => {
      expect(homePage.container.querySelector(".packagesSearchForm")).toBeInTheDocument();
    });

    fireEvent.change(
        homePage.getByTestId(/test-departure-search-input/),
        {
          target: {
            value: "test"
          }
        }
    );

    fireEvent.change(
        homePage.getByTestId(/test-destination-search-input/),
        {
          target: {
            value: "test"
          }
        }
    );

    fireEvent.click(homePage.getByTestId(/search-submit-btn/));

    await waitFor(() => {
      expect(homePage.getByTestId(/test-calendar/)).toBeInTheDocument();
    });

    const checkInFlightDateInCalendar = homePage.container.querySelector(`[aria-label="${Intl.DateTimeFormat("en", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(new Date(today.setDate(today.getDate())))}"]`);


    fireEvent.click(
        checkInFlightDateInCalendar
    );

    const checkOutFlightDateInCalendar = homePage.container.querySelector(`[aria-label="${Intl.DateTimeFormat("en", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(new Date(checkOut.setDate(checkOut.getDate() + 1)))}"]`);

    fireEvent.click(
        checkOutFlightDateInCalendar
    );

    await waitFor(() => {
      expect(homePage.queryByTestId(/home-search-overlay/)).toBeNull();
    });
  });

});


