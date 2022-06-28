import {act, cleanup, fireEvent, render, screen, waitFor} from "@testing-library/react";
import "@testing-library/jest-dom";

import * as React from "react";

import { IntlProvider } from "next-intl";
import { WsContext } from "../../../context/SocketContext";
import { ThemeProvider } from "styled-components";
import { myMockTheme } from "./mocks/theme";
import LoginPage from "../login";

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
                        const result = {};

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
                    <LoginPage {...props} />
                </WsContext.Provider>
            </IntlProvider>
        </ThemeProvider>
    );
};


describe("Login Page Suite", () => {
    it("Should render Login page", async() => {
        const loginPage = render(<Wrapper {...homePageProps} />)

        await waitFor(() => {
            expect(loginPage).toMatchSnapshot()
        })
    })
    /*
    it("Should display email invalid and password error", async() => {
        const loginPage = render(<Wrapper {...homePageProps} />)

        fireEvent.click(
            loginPage.getByTestId(/test-rememberMe-login/)
        )

        await waitFor(() => {
            expect(loginPage.getByText(/Email required/)).toBeInTheDocument()
            expect(loginPage.getByText(/Password required/)).toBeInTheDocument()

        })

        fireEvent.change(
            loginPage.getByTestId(/test-email-login/),
            {
                target: {
                    value: "test"
                }
            }
        )
        await waitFor(() => {
            expect(loginPage.getByText(/Invalid email address/)).toBeInTheDocument()
        })
    })

    it("Should perform login password show", async () => {
        const loginPage = render(<Wrapper {...homePageProps} />)

        fireEvent.change(
            loginPage.getByTestId(/test-password-login/),
            {
                target: {
                    value: "test"
                }
            }
        )

        await waitFor(() => {
            expect(loginPage.getByTestId(/test-password-login/)).toHaveAttribute('type', 'password')
        })

        fireEvent.click(
            loginPage.getByTestId(/test-toggle-password-visibilty/)
        )

        await waitFor(() => {
            expect(loginPage.getByTestId(/test-password-login/)).toHaveAttribute('type', 'text')
        })
    })

    it("Should submit", async() => {
        const loginPage = render(<Wrapper {...homePageProps} />)

        fireEvent.change(
            loginPage.getByTestId(/test-email-login/),
            {
                target: {
                    value: "test"
                }
            }
        )

        fireEvent.change(
            loginPage.getByTestId(/test-password-login/),
            {
                target: {
                    value: "test"
                }
            }
        )

        await act(async () => {
            fireEvent.click(
                loginPage.getByTestId(/test-login-button/)
            )
        })
    })*/
})


