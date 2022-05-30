    import {render, screen, fireEvent, waitFor} from "@testing-library/react";
    import "@testing-library/jest-dom";
    import Detail from "../hotel/detail";
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
                    <Detail {...props} />
                </IntlProvider>
            </WsContextProvider>
        );
    };

    describe("Hotel Page Suite", () => {
         it("Should render the hotel page", async () => {
             render(<Wrapper {...hotelPageProps} />);
             expect(screen.getByText('Hotel Victoria')).toBeInTheDocument();
         });


        it("Should select from destinations dropdown", async ()=> {
            const hotelPage= render(<Wrapper {...hotelPageProps} />);
            const input = hotelPage.getByTestId('hotelInput') as HTMLInputElement;
            const previousInputValue = input.value;
            fireEvent.change(input, {
                target: { value: "new value" }
            });
            await waitFor(() => expect(input.value).not.toEqual(previousInputValue));

        })

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
            }).format(new Date(today.setDate(today.getDate() + 1)))}"]`);

            fireEvent.click(
                checkInDateCalendarInput
            )

            const checkInDateInput: HTMLInputElement | any = hotelPage.getByTestId('checkInDateInput');

            const dateInputField = new Date(checkInDateInput.value);
            const dateSelectedFromCalender = new Date(checkInDateCalendarInput.getAttribute("aria-label"));

            expect(dateInputField).toEqual(dateSelectedFromCalender);
        })



        it("Should select from check out date dropdown", async ()=> {
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
            }).format(new Date(today.setDate(today.getDate() + 3)))}"]`);


            fireEvent.click(
                checkOutDateCalendarInput
            )
            const checkOutDateInput: HTMLInputElement | any = hotelPage.getByTestId('checkOutDateInput');

            const dateInputField = new Date(checkOutDateInput.value);
            const dateSelectedFromCalender = new Date(checkOutDateCalendarInput.getAttribute("aria-label"));

            expect(dateInputField).toEqual(dateSelectedFromCalender);
        })


        it("Should select from (Available) check  in date dropdown", async ()=> {
            const hotelPage = render(<Wrapper {...hotelPageProps} />);
            const today = new Date();

            fireEvent.click(
                hotelPage.getByTestId('avail-checkInDateInput'),
            )

            await waitFor(() => {
                expect(hotelPage.getByTestId('avail-checkInDateCont')).toBeInTheDocument();
            })

            const checkInDateCalendarInput = hotelPage.container.querySelector(`[aria-label="${Intl.DateTimeFormat('en', {
                month: "long",
                day: "numeric",
                year: "numeric"
            }).format(new Date(today.setDate(today.getDate() + 2)))}"]`);

            fireEvent.click(
                checkInDateCalendarInput
            )

            const dateInputField = hotelPage.getByTestId('avail-checkInDateInput');
            const dateSelectedFromCalender = new Date(checkInDateCalendarInput.getAttribute("aria-label"));
            const finalDateSelected = `0${dateSelectedFromCalender.getDate()} ${dateSelectedFromCalender.toLocaleDateString('en-US', { month: 'short' })} , ${dateSelectedFromCalender.toLocaleDateString('en-US', { weekday: 'short' })}`;

            expect(dateInputField.textContent).toEqual(finalDateSelected);
        })



        it("Should select from (Available) check out date dropdown", async ()=> {
            const hotelPage = render(<Wrapper {...hotelPageProps} />);
            const today = new Date();

            fireEvent.click(
                hotelPage.getByTestId('avail-checkOutDateInput'),
            )

            await waitFor(() => {
                expect(hotelPage.getByTestId('avail-checkOutDateCont')).toBeInTheDocument();
            })

            const checkOutDateCalendarInput = hotelPage.container.querySelector(`[aria-label="${Intl.DateTimeFormat('en', {
                month: "long",
                day: "numeric",
                year: "numeric"
            }).format(new Date(today.setDate(today.getDate() + 2)))}"]`);

            fireEvent.click(
                checkOutDateCalendarInput
            )

            const dateInputField = hotelPage.getByTestId('avail-checkOutDateInput');


            const dateSelectedFromCalender = new Date(checkOutDateCalendarInput.getAttribute("aria-label"));
            const finalDateSelected = `0${dateSelectedFromCalender.getDate()} ${dateSelectedFromCalender.toLocaleDateString('en-US', { month: 'short' })} , ${dateSelectedFromCalender.toLocaleDateString('en-US', { weekday: 'short' })}`;

            expect(dateInputField.textContent).toEqual(finalDateSelected);
        })

        it('Should match adult number with chosen adult number', async () => {
            const hotelPage = render(<Wrapper {...hotelPageProps} />);
            const adultNumberChosen = hotelPage.getByTestId('adultNumberChosen');

            fireEvent.click(
                hotelPage.getByTestId('detailsInput'),
            )
            await waitFor(() => {
                expect(hotelPage.getByTestId('detailsContainer')).toBeInTheDocument();
            })

            const adultNumberFromDropdown = hotelPage.getByTestId('adultNumberFromDropdown');

            fireEvent.click(
                hotelPage.getByTestId('incAdultNumber'),
            )
            await waitFor(() => {
                expect(`0${adultNumberChosen.innerHTML}`).toEqual(adultNumberFromDropdown.innerHTML);
            })

            fireEvent.click(
                hotelPage.getByTestId('decAdultNumber'),
            )

            await waitFor(() => {
                expect(`0${adultNumberChosen.innerHTML}`).toEqual(adultNumberFromDropdown.innerHTML);
            })

        })



        it('Should match child number with chosen child number', async () => {
            const hotelPage = render(<Wrapper {...hotelPageProps} />);
            const childNumberChosen = hotelPage.getByTestId('childNumberChosen');

            fireEvent.click(
                hotelPage.getByTestId('detailsInput'),
            )
            await waitFor(() => {
                expect(hotelPage.getByTestId('detailsContainer')).toBeInTheDocument();
            })
            const childNumberFromDropdown = hotelPage.getByTestId('childNumberFromDropdown');

            fireEvent.click(
                hotelPage.getByTestId('incChildNumber'),
            )
            await waitFor(() => {
                expect(`0${childNumberChosen.innerHTML}`).toEqual(childNumberFromDropdown.innerHTML);
            })

            fireEvent.click(
                hotelPage.getByTestId('decChildNumber'),
            )

            await waitFor(() => {
                expect(`0${childNumberChosen.innerHTML}`).toEqual(childNumberFromDropdown.innerHTML);
            })

        })

        it('should check number of rooms with chosen number of rooms row 0', async () => {
              const hotelPage = render(<Wrapper {...hotelPageProps} />);
              const numOfRoomsCont = hotelPage.getByTestId('numOfRoomsCont0');

              fireEvent.click(
                  numOfRoomsCont
              )

              await waitFor(() => {
                  expect(hotelPage.getByTestId('numOfRoomsUl0')).toBeInTheDocument();
              })

            const numOfRoomsInput= hotelPage.getByTestId('numOfRoomsInput0') as HTMLInputElement;

              fireEvent.click(
                  hotelPage.getByTestId('numOfRoomsUl0').firstChild
              )

            const amountOfRow = hotelPage.getByTestId('amountOfRow0')

            await waitFor(() =>  expect(amountOfRow).toHaveTextContent('10 €'));
              await waitFor(() => {
                  expect(numOfRoomsInput.value).toEqual('1 Room');
              })

          })



          it('should check number of rooms with chosen number of rooms row 1', async () => {

              const hotelPage = render(<Wrapper {...hotelPageProps} />);
              const numOfRoomsCont = hotelPage.getByTestId('numOfRoomsCont1');


              fireEvent.click(
                  numOfRoomsCont
              )

              await waitFor(() => {
                  expect(hotelPage.getByTestId('numOfRoomsUl1')).toBeInTheDocument();
              })

              const numOfRoomsInput= hotelPage.getByTestId('numOfRoomsInput1') as HTMLInputElement;

              fireEvent.click(
                  hotelPage.getByTestId('numOfRoomsUl1').firstChild
              )

              const amountOfRow = hotelPage.getByTestId('amountOfRow1')

              await waitFor(() =>  expect(amountOfRow).toHaveTextContent('10 €'));
              await waitFor(() => expect(numOfRoomsInput.value).toEqual('1 Room'));

          })

          it('should check number of rooms with chosen number of rooms row 2', async () => {
              const hotelPage = render(<Wrapper {...hotelPageProps} />);
              const numOfRoomsCont = hotelPage.getByTestId('numOfRoomsCont2');


              fireEvent.click(
                  numOfRoomsCont
              )

              await waitFor(() => {
                  expect(hotelPage.getByTestId('numOfRoomsUl2')).toBeInTheDocument();
              })
              const numOfRoomsInput= hotelPage.getByTestId('numOfRoomsInput2') as  HTMLInputElement;

              fireEvent.click(
                  hotelPage.getByTestId('numOfRoomsUl2').firstChild
              )

              const amountOfRow = hotelPage.getByTestId('amountOfRow2')

              await waitFor(() =>  expect(amountOfRow).toHaveTextContent('10 €'));
              await waitFor(() => expect(numOfRoomsInput.value).toEqual('1 Room'));

          })


          it('should check number of rooms with chosen number of rooms row 3', async () => {
              const hotelPage = render(<Wrapper {...hotelPageProps} />);
              const numOfRoomsCont = hotelPage.getByTestId('numOfRoomsCont3');

              fireEvent.click(
                  numOfRoomsCont
              )

              await waitFor(() => {
                  expect(hotelPage.getByTestId('numOfRoomsUl3')).toBeInTheDocument();
              })

              const numOfRoomsInput = hotelPage.getByTestId('numOfRoomsInput3') as HTMLInputElement;

              fireEvent.click(
                  hotelPage.getByTestId('numOfRoomsUl3').firstChild
              )


              const amountOfRow = hotelPage.getByTestId('amountOfRow3')

              await waitFor(() =>  expect(amountOfRow).toHaveTextContent('10 €'));
              await waitFor(() => expect(numOfRoomsInput.value).toEqual('1 Room'));

          })


        it('Should match (In Available Section) child number with chosen child number', async () => {
            const hotelPage = render(<Wrapper {...hotelPageProps} />);
            const numberChosen = hotelPage.getByTestId('avail-childNumberChosen');

            fireEvent.click(
                hotelPage.getByTestId('avail-childNumberInput'),
            )
            await waitFor(() => {
                expect(hotelPage.getByTestId('avail-childNumberCont')).toBeInTheDocument();
            })

            const numberFromDropdown = hotelPage.getByTestId('avail-childNumberDropdown');

            fireEvent.click(
                hotelPage.getByTestId('avail-incChildNumber'),
            )

            await waitFor(() => expect(numberChosen.innerHTML).toEqual(numberFromDropdown.innerHTML));

            fireEvent.click(
                hotelPage.getByTestId('avail-decChildNumber'),
            )

            await waitFor(() => expect(numberChosen.innerHTML).toEqual(numberFromDropdown.innerHTML));
        })


        it('Should match (In Available Section) adult number with chosen child number', async () => {
            const hotelPage = render(<Wrapper {...hotelPageProps} />);
            const numberChosen = hotelPage.getByTestId('avail-adultNumberChosen');

            fireEvent.click(
                hotelPage.getByTestId('avail-adultNumberInput'),
            )
            await waitFor(() => {
                expect(hotelPage.getByTestId('avail-adultNumberCont')).toBeInTheDocument();
            })

            const numberFromDropdown = hotelPage.getByTestId('avail-adultNumberDropdown');

            fireEvent.click(
                hotelPage.getByTestId('avail-incAdultNumber'),
            )

            await waitFor(() => expect(numberChosen.innerHTML).toEqual(numberFromDropdown.innerHTML));

            fireEvent.click(
                hotelPage.getByTestId('avail-decAdultNumber'),
            )

            await waitFor(() => expect(numberChosen.innerHTML).toEqual(numberFromDropdown.innerHTML));
        })

        it("should render read less... on clicking on read more...", async () => {
            const hotelPage = render(<Wrapper {...hotelPageProps} />);

            fireEvent.click(hotelPage.getByTestId('readButton'));

            await waitFor(() => expect(hotelPage.getByTestId('readButton')).toHaveTextContent('read less...'))
        })

    });


