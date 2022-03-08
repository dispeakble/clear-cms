import {render} from '@testing-library/react'
import InfiniteScroll from './index'
import '@testing-library/jest-dom'

import { rest } from "msw"
import {setupServer} from "msw/node"


const server = setupServer(
    rest.post("http://localhost:9898/results-data",
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
                ctx.json(ret)
            )
    }
    ),
    rest.post("*", (req, res,ctw) => {
        console.error("dkhelti hna")
    })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
beforeAll(() => server.close())

test("display infinite scroll component",async () => {

    const {getByTestId} = await render(<InfiniteScroll />)

    expect(getByTestId(/infinite-scroll-container/)).toBeInTheDocument()
})

test("display Loading state", async () => {

    const {getByTestId, getByText} = await render(<InfiniteScroll />)


    expect(getByTestId(/infinite-scroll-container/)).toBeInTheDocument()
    expect(getByText("Loading...")).toBeInTheDocument()
})

test("display failed state", async () => {
    server.use(
        rest.post("http://localhost:9898/results-data", (req, res, ctx) => {
            return res(ctx.status(404))
        })
    )

    const {getByTestId, getByText} = await render(<InfiniteScroll />)


    expect(getByTestId(/infinite-scroll-container/)).toBeInTheDocument()
    expect(getByText("error")).toBeInTheDocument()
})