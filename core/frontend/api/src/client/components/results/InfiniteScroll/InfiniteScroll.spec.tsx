import {render, screen, act, waitFor, cleanup} from '@testing-library/react'
import InfiniteScroll from './index'
import '@testing-library/jest-dom'

import { rest } from "msw"
import {setupServer} from "msw/node"


const server = setupServer(
    rest.post("/results-data",
        (req, res, ctx) => {

            const dummy = [[
                {
                    itemTitle: "Lorem ipsum - page1",
                    itemDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                },
                {
                    itemTitle: "Lorem ipsum",
                    itemDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                },
                {
                    itemTitle: "Lorem ipsum",
                    itemDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                },
                {
                    itemTitle: "Lorem ipsum",
                    itemDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                },
                {
                    itemTitle: "Lorem ipsum",
                    itemDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                }]]
            const ret = {
                "results": dummy,
                "page": 1,
                "hasMore": false,
            }

            return res(
                ctx.status(200),
                ctx.json({ret})
            )
        }
    )
)

beforeAll(() => server.listen())
afterEach(() => {
    cleanup()
    server.resetHandlers()
})
afterAll(() => server.close())

test("display infinite scroll component",async () => {

    await act(async () =>  {
        render(<InfiniteScroll/>)

        await waitFor(() => {
            expect(screen.getByTestId(/infinite-scroll-container/)).toBeInTheDocument()
        })
    })
})

test("display Loading state", async () => {

    await act(async () =>  {
        render(<InfiniteScroll/>)

        await waitFor(() => {
            expect(screen.getByTestId(/infinite-scroll-container/)).toBeInTheDocument()
            expect(screen.getByText(/Loading.../)).toBeInTheDocument()
        })
    })
})

test("display failed state", async () => {

    await server.use(
        rest.post("/results-data", (req, res, ctx) => {
            return res(ctx.status(404))
        })
    )

    await act(async () =>  {

        render(<InfiniteScroll/>)

        await waitFor(() => {
            expect(screen.getByTestId(/infinite-scroll-container/)).toBeInTheDocument()
            expect(screen.getByTestId(/error-test-message/)).toBeInTheDocument()
        });
    })

})