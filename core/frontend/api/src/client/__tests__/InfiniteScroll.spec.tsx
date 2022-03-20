// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from "react"

import {render, screen} from '@testing-library/react'
import InfiniteScroll from '../components/results/InfiniteScroll'
import '@testing-library/jest-dom'
import { shallow, configure } from 'enzyme';
import {expect as chaiExpect} from "chai";
import Adapter from "enzyme-adapter-react-16";
import {server} from "../mock/mswServer";
import {resultsHandlerException} from "../mock/handlers";

configure({ adapter: new Adapter() });


describe("Component: Infinite Scroll", () => {
    let wrapper;

    beforeAll(() => {
        // eslint-disable-next-line no-console
        //console.log("@ beforeAll - Component: Infinite Scroll")
        server.listen()
    })
    beforeEach(async () => {
        wrapper =  await shallow(<InfiniteScroll/>)
    })
    afterEach(() => {
        server.resetHandlers()
    })
    afterAll(() => {
        // eslint-disable-next-line no-console
        //console.log("@ afterAll - Component: Infinite Scroll")
        server.close()
    })
    test("display Loading state", async () => {

        const loader = wrapper.find({"data-testid" : "loader-test"})

        // eslint-disable-next-line no-console
        //console.log(wrapper.debug())
        chaiExpect(loader.text()).to.equal('Loading...')


    })

    test("display result items", async () => {

        render(<InfiniteScroll />)

        const item = await screen.findByTestId(/infinite-scroll-container/)

        // eslint-disable-next-line no-console
        //console.log(wrapper.debug())
        expect(item).toBeInTheDocument()
    })

    test("display failed state", async () => {

        server.use(resultsHandlerException)
        render(<InfiniteScroll />)

        const error = await screen.findByTestId(/error-test/)

        // eslint-disable-next-line no-console
        //console.log(wrapper.debug())
        expect(error).toBeInTheDocument()

    })
})