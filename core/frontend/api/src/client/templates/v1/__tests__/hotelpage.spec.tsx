import {render, screen, fireEvent, prettyDOM, within, waitFor} from "@testing-library/react";
import "@testing-library/jest-dom";
import HotelPage from "../HotelPage";
import { IntlProvider } from "next-intl";
import { WsContextProvider } from "../../../context/SocketContext";
import * as React from "react";
import {wait} from "next/dist/build/output/log";

const monthNames =  ["January", "February", "March","April","May","June","July", "August","September","October","November","December"];
const dayNames =   [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];

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

jest.setTimeout(250)

const messages = require("../../../languages/agency/en.json");

const hotelPageProps = {
    websiteName: "Example website",
    websiteUrl: "example.com",
    websiteSlogan: "Example website slogan",
    colorScheme: {}
};

const Wrapper = ({ ...props }: any) => {
    return (
      <WsContextProvider settings={{}}>
          <IntlProvider locale="en" messages={messages}>
              <HotelPage {...props} />
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


describe("Hotel Page Suite", () => {
    // it("Should render the hotel page", async () => {
    //     render(<Wrapper {...hotelPageProps} />);
    //     expect(screen.getByText('Hotel Victoria')).toBeInTheDocument();
    // });

    // it("Should select from destinations dropdown", async ()=> {
    //     const {getByText} = render(<Wrapper {...hotelPageProps} />);
    //     const autocomplete =  screen.getByTestId('autocomplete');
    //     const input: HTMLInputElement = await within(autocomplete).findByTestId('hotel');
    //     // console.log("Input: ", input);
    //
    //     fireEvent.mouseDown(autocomplete)
    //     // getByText(autocomplete, '');
    //     // console.log('Autocomplete DOM: ',prettyDOM(autocomplete))
    //
    //     // assign value to input field
    //     fireEvent.change(input, { target: { value: 'Aroma' } })
    //     await wait()
    //
    //     const element = screen.getByRole("listbox");
    //     // screen.get
    //     // eslint-disable-next-line no-console
    //     console.log('Element: ', prettyDOM(element))
    //     // navigate to the first item in the autocomplete box
    //     fireEvent.keyDown(autocomplete, { key: 'ArrowDown' })
    //     await wait()
    //     // select the first item
    //     fireEvent.keyDown(autocomplete, { key: 'Enter' })
    //     await wait()
    //
    //     await waitFor(() => expect(input.value).toEqual("Aroma"))
    //
    //     // check the new value of the input field
    //     // eslint-disable-next-line no-console
    //     console.error('input.value: ', input.value)
    //     // expect(input.value).toEqual('Aroma')
    // })

    it("Should select from check in date dropdown", async ()=> {
        const hotelPage = render(<Wrapper {...hotelPageProps} />);
        const today = new Date();

        fireEvent.click(
            hotelPage.getByTestId('checkInDateInput'),
        )

        await waitFor(() => {
            expect(hotelPage.getByTestId('checkInDateCont')).toBeInTheDocument();
        })

        const checkInDateCalendarInput = hotelPage.container.querySelector(`[aria-label="${Intl.DateTimeFormat('en', {
            month: "long",
            day: "numeric",
            year: "numeric"
        }).format(new Date(today.setDate(today.getDate())))}"]`);

        fireEvent.click(
            checkInDateCalendarInput
        )
        const checkInDateInput: HTMLInputElement | any = hotelPage.getByTestId('checkInDateInput');

        const formatedDate = `${dayNames[today.getDay()]}, ${today.getDate()} ${monthNames[today.getMonth()]}, ${today.getFullYear()}`;
        expect(checkInDateInput.value).toEqual(formatedDate);
    })

    it('Should select from check out date dropdown', async ()=> {
        const hotelPage = render(<Wrapper {...hotelPageProps} />);
        const today = new Date();

        fireEvent.click(
            hotelPage.getByTestId('checkOutDateInput'),
        )

        await waitFor(() => {
            expect(hotelPage.getByTestId('checkOutDateCont')).toBeInTheDocument();
        })

        const checkOutDateCalendarInput = hotelPage.container.querySelector(`[aria-label="${Intl.DateTimeFormat('en', {
            month: "long",
            day: "numeric",
            year: "numeric"
        }).format(new Date(today.setDate(today.getDate())))}"]`);

        fireEvent.click(
            checkOutDateCalendarInput
        )
        const checkOutDateInput: HTMLInputElement | any = hotelPage.getByTestId('checkOutDateInput');

        const formatedDate = `${dayNames[today.getDay()]}, ${today.getDate()} ${monthNames[today.getMonth()]}, ${today.getFullYear()}`;
        expect(checkOutDateInput.value).toEqual(formatedDate);
    })

   /* it('Should match adult number with choosed adult number', async () => {
        const hotelPage = render(<Wrapper {...hotelPageProps} />);
        fireEvent.click(
            hotelPage.getByTestId('detailsInput'),
        )
        await waitFor(() => {
            expect(hotelPage.getByTestId('detailsContainer')).toBeInTheDocument();
        })

    }) */
});


