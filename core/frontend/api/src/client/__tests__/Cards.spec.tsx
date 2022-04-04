import {render, screen, waitFor} from '@testing-library/react'
import Cards from '../components/agency/Cards'
import '@testing-library/jest-dom'

const cards = [
    {
        Name: "Test title 1",
        Description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
        Name: "Test title 2",
        Description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    }
]

test("display card wrapper", async () => {
    render(<Cards cards={cards} />)
    const cardsWrapper = screen.getByTestId(/cards-wrapper/)

    expect(cardsWrapper).toBeInTheDocument()
})

test("display cards in card wrapper", async () => {


    await render(<Cards cards={cards} />)
    const cardsWrapper = screen.getByTestId(/cards-wrapper/)

    await waitFor(async() => {
        expect(cardsWrapper).toBeInTheDocument()
        expect(cardsWrapper).toHaveTextContent(/Test title/)
    })
})