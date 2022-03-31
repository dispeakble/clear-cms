import {rest} from 'msw'
import {_baseURL} from "../helpers/httpClient";

const mockResults = [[
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
    },
    {
        itemTitle: "Lorem ipsum",
        itemDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    }]]

const getResultsPath = `${_baseURL}/results-data`

const resultsHandler = rest.get(getResultsPath,
        async (req, res, ctx) => {
            return res(ctx.json({
                "results": mockResults.slice(0, 1),
                "page": 1,
                "hasMore": false,

            }))
        }
    )

export const resultsHandlerException = rest.get(
    getResultsPath,
    async(req, res,ctx) => {
        return res(ctx.status(500), ctx.json({error: "error"}));
    }
)

export const handlers = [resultsHandler]